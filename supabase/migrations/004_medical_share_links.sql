-- Create medical_share_links table for temporary sharing with doctors
CREATE TABLE medical_share_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estudio_id UUID NOT NULL REFERENCES estudios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_hash VARCHAR(255) NOT NULL,
    expira_en TIMESTAMP WITH TIME ZONE NOT NULL,
    creado_por_paciente BOOLEAN DEFAULT TRUE,
    revocado BOOLEAN DEFAULT FALSE,
    revocado_por UUID, -- user_id who revoked it
    revocado_en TIMESTAMP WITH TIME ZONE,
    motivo_revocacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_medical_share_links_token ON medical_share_links(token);
CREATE INDEX idx_medical_share_links_estudio_id ON medical_share_links(estudio_id);
CREATE INDEX idx_medical_share_links_expira_en ON medical_share_links(expira_en);

-- Enable RLS
ALTER TABLE medical_share_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Staff can view all medical share links" ON medical_share_links
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert medical share links" ON medical_share_links
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update medical share links" ON medical_share_links
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Function to create medical share link
CREATE OR REPLACE FUNCTION create_medical_share_link(
    p_estudio_id UUID,
    p_hours_duration INTEGER DEFAULT 48,
    p_creado_por_paciente BOOLEAN DEFAULT TRUE
) RETURNS TABLE (
    id UUID,
    token VARCHAR(255),
    expira_en TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_token VARCHAR(255);
    v_token_hash VARCHAR(255);
    v_expira_en TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate unique token
    v_token := encode(gen_random_bytes(32), 'base64url');
    v_token_hash := encode(digest(v_token, 'sha256'), 'hex');
    
    -- Calculate expiration
    v_expira_en := NOW() + (p_hours_duration || ' hours')::INTERVAL;
    
    -- Insert share link
    INSERT INTO medical_share_links (
        estudio_id,
        token,
        token_hash,
        expira_en,
        creado_por_paciente
    ) VALUES (
        p_estudio_id,
        v_token,
        v_token_hash,
        v_expira_en,
        p_creado_por_paciente
    ) RETURNING medical_share_links.id, medical_share_links.token, medical_share_links.expira_en
    INTO id, token, expira_en;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate medical share link
CREATE OR REPLACE FUNCTION validate_medical_share_link(
    p_token VARCHAR(255)
) RETURNS TABLE (
    estudio_id UUID,
    paciente_nombre VARCHAR(255),
    paciente_apellido VARCHAR(255),
    titulo VARCHAR(255),
    fecha_estudio DATE,
    archivos JSONB
) AS $$
DECLARE
    v_share_link RECORD;
    v_estudio RECORD;
    v_archivos JSONB;
BEGIN
    -- Check if token exists and is not expired or revoked
    SELECT msl.*, e.*, p.nombre, p.apellido
    INTO v_share_link
    FROM medical_share_links msl
    JOIN estudios e ON msl.estudio_id = e.id
    JOIN pacientes p ON e.paciente_id = p.id
    WHERE msl.token = p_token
    AND msl.expira_en > NOW()
    AND msl.revocado = FALSE;

    IF NOT FOUND THEN
        -- Log failed attempt
        INSERT INTO audit_log (evento, detalles, ip_address, user_agent)
        VALUES ('invalid_medical_share_attempt', 
                jsonb_build_object('token', p_token),
                inet_client_addr(), 
                current_setting('request.headers', true)::jsonb->>'user-agent');
        RETURN;
    END IF;

    -- Get files for the study
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'nombre_original', a.nombre_original,
            'tipo_mime', a.tipo_mime,
            'tamaño_bytes', a.tamaño_bytes,
            'es_principal', a.es_principal,
            'ruta_s3', a.ruta_s3
        )
    ) INTO v_archivos
    FROM archivos a
    WHERE a.estudio_id = v_share_link.estudio_id;

    -- Log successful access
    INSERT INTO audit_log (evento, estudio_id, paciente_id, detalles, ip_address, user_agent)
    VALUES ('medical_share_view', 
            v_share_link.estudio_id,
            v_share_link.paciente_id,
            jsonb_build_object('token', p_token, 'medical_share_link_id', v_share_link.id),
            inet_client_addr(), 
            current_setting('request.headers', true)::jsonb->>'user-agent');

    -- Return study data
    RETURN QUERY SELECT 
        v_share_link.estudio_id,
        v_share_link.nombre,
        v_share_link.apellido,
        v_share_link.titulo,
        v_share_link.fecha_estudio,
        COALESCE(v_archivos, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke medical share link
CREATE OR REPLACE FUNCTION revoke_medical_share_link(
    p_token VARCHAR(255),
    p_motivo TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_updated_rows INTEGER;
BEGIN
    UPDATE medical_share_links 
    SET revocado = TRUE,
        revocado_en = NOW(),
        motivo_revocacion = p_motivo,
        updated_at = NOW()
    WHERE token = p_token
    AND revocado = FALSE;
    
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
    
    -- Log revocation
    IF v_updated_rows > 0 THEN
        INSERT INTO audit_log (evento, detalles, ip_address, user_agent)
        VALUES ('medical_share_revoked', 
                jsonb_build_object('token', p_token, 'motivo', p_motivo),
                inet_client_addr(), 
                current_setting('request.headers', true)::jsonb->>'user-agent');
    END IF;
    
    RETURN v_updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger
CREATE TRIGGER update_medical_share_links_updated_at BEFORE UPDATE ON medical_share_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
