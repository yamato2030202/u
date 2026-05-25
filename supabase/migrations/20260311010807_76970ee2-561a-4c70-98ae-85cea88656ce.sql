
-- Drop conflicting storage policies and recreate
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

CREATE POLICY "Admins can upload images v2" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can update images v2" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Admins can delete images v2" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images' AND (SELECT has_role(auth.uid(), 'admin'::app_role)));
CREATE POLICY "Public can view images v2" ON storage.objects FOR SELECT USING (bucket_id = 'images');
