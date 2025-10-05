-- Enable Row Level Security on all tables
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudios ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pacientes
CREATE POLICY "Staff can view all patients" ON pacientes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert patients" ON pacientes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update patients" ON pacientes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for estudios
CREATE POLICY "Staff can view all studies" ON estudios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert studies" ON estudios
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update studies" ON estudios
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for archivos
CREATE POLICY "Staff can view all files" ON archivos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert files" ON archivos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for share_links
CREATE POLICY "Staff can view all share links" ON share_links
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert share links" ON share_links
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update share links" ON share_links
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for audit_log
CREATE POLICY "Staff can view all audit logs" ON audit_log
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert audit logs" ON audit_log
    FOR INSERT WITH CHECK (true);

-- Function to validate patient access via code
CREATE OR REPLACE FUNCTION validate_patient_access(
    p_dni VARCHAR(8),
    p_codigo VARCHAR(10)
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
    -- Check if code exists and is not expired
    SELECT sl.*, e.*, p.nombre, p.apellido
    INTO v_share_link
    FROM share_links sl
    JOIN estudios e ON sl.estudio_id = e.id
    JOIN pacientes p ON e.paciente_id = p.id
    WHERE sl.codigo = p_codigo
    AND sl.expira_en > NOW()
    AND (sl.bloqueado_hasta IS NULL OR sl.bloqueado_hasta < NOW())
    AND p.dni = p_dni;

    IF NOT FOUND THEN
        -- Log failed attempt
        INSERT INTO audit_log (evento, detalles, ip_address, user_agent)
        VALUES ('invalid_access_attempt', 
                jsonb_build_object('dni', p_dni, 'codigo', p_codigo),
                inet_client_addr(), current_setting('request.headers', true)::jsonb->>'user-agent');
        RETURN;
    END IF;

    -- Get files for the study
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'nombre_original', a.nombre_original,
            'tipo_mime', a.tipo_mime,
            'tamaño_bytes', a.tamaño_bytes,
            'es_principal', a.es_principal
        )
    ) INTO v_archivos
    FROM archivos a
    WHERE a.estudio_id = v_share_link.estudio_id;

    -- Log successful access
    INSERT INTO audit_log (evento, estudio_id, paciente_id, detalles, ip_address, user_agent)
    VALUES ('patient_view', 
            v_share_link.estudio_id,
            v_share_link.paciente_id,
            jsonb_build_object('dni', p_dni, 'codigo', p_codigo),
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

-- Function to generate signed URL for file download
CREATE OR REPLACE FUNCTION generate_signed_url(
    p_archivo_id UUID,
    p_expires_in_minutes INTEGER DEFAULT 10
) RETURNS TEXT AS $$
DECLARE
    v_archivo RECORD;
    v_signed_url TEXT;
BEGIN
    -- Get file information
    SELECT a.*, e.paciente_id
    INTO v_archivo
    FROM archivos a
    JOIN estudios e ON a.estudio_id = e.id
    WHERE a.id = p_archivo_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Generate signed URL (this would integrate with your storage service)
    -- For now, return a placeholder URL
    v_signed_url := 'https://storage.example.com/signed/' || p_archivo_id || '?expires=' || 
                   (EXTRACT(EPOCH FROM NOW() + (p_expires_in_minutes || ' minutes')::INTERVAL))::BIGINT;

    -- Log download attempt
    INSERT INTO audit_log (evento, estudio_id, paciente_id, detalles, ip_address, user_agent)
    VALUES ('download', 
            v_archivo.estudio_id,
            v_archivo.paciente_id,
            jsonb_build_object('archivo_id', p_archivo_id, 'archivo_nombre', v_archivo.nombre_original),
            inet_client_addr(), 
            current_setting('request.headers', true)::jsonb->>'user-agent');

    RETURN v_signed_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
