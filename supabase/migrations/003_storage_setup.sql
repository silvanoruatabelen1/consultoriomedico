-- Create storage bucket for estudios
INSERT INTO storage.buckets (id, name, public) VALUES ('estudios', 'estudios', false);

-- Create storage policies
CREATE POLICY "Staff can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'estudios' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Staff can view files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'estudios' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Staff can delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'estudios' AND
  auth.role() = 'authenticated'
);

-- Function to generate signed URLs for file downloads
CREATE OR REPLACE FUNCTION generate_signed_download_url(
  p_bucket_name TEXT,
  p_file_path TEXT,
  p_expires_in_seconds INTEGER DEFAULT 600
) RETURNS TEXT AS $$
DECLARE
  v_signed_url TEXT;
BEGIN
  -- This would integrate with your storage service to generate signed URLs
  -- For now, return a placeholder URL
  v_signed_url := 'https://storage.example.com/signed/' || p_bucket_name || '/' || p_file_path || 
                 '?expires=' || (EXTRACT(EPOCH FROM NOW() + (p_expires_in_seconds || ' seconds')::INTERVAL))::BIGINT;
  
  RETURN v_signed_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
