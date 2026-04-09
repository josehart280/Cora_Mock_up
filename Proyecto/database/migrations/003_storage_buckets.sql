-- ============================================================
-- CORA — Storage Buckets & Policies
-- ============================================================
-- NOTA: Los buckets se crean en Supabase Dashboard > Storage
-- Este archivo documenta la configuración y políticas de acceso
-- Las políticas SQL se pueden ejecutar en el SQL Editor
-- ============================================================

-- ============================================================
-- BUCKET 1: avatars
-- Fotos de perfil de usuarios y psicólogos
-- Visibilidad: PÚBLICO
-- ============================================================

-- En Supabase Dashboard > Storage > New Bucket:
-- Name: avatars
-- Public: TRUE
-- Max file size: 5MB
-- Allowed types: image/jpeg, image/png, image/webp

-- Política: cualquiera puede ver avatares
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Política: usuario sube su propio avatar (ruta: {user_id}/avatar.jpg)
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: usuario actualiza su propio avatar
CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Política: usuario elimina su propio avatar
CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- BUCKET 2: documents
-- Documentos de verificación de psicólogos
-- Visibilidad: PRIVADO
-- ============================================================

-- En Supabase Dashboard > Storage > New Bucket:
-- Name: documents
-- Public: FALSE
-- Max file size: 50MB
-- Allowed types: image/jpeg, image/png, application/pdf

-- Política: psicólogo sube sus propios documentos
-- Ruta esperada: {psychologist_id}/license.pdf, {psychologist_id}/degree.pdf
CREATE POLICY "Psychologist uploads own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'psychologist'
    )
  );

-- Política: psicólogo ve sus propios documentos
CREATE POLICY "Psychologist views own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

-- Política: admins ven todos los documentos
CREATE POLICY "Admins view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- BUCKET 3: recordings
-- Grabaciones de sesiones terapéuticas
-- CRÍTICO: Datos de salud mental — máxima privacidad
-- Visibilidad: PRIVADO (nunca público)
-- ============================================================

-- En Supabase Dashboard > Storage > New Bucket:
-- Name: recordings
-- Public: FALSE
-- Max file size: 2GB
-- Allowed types: video/mp4, video/webm, audio/mp3, audio/webm

-- Política: solo el paciente y su psicólogo pueden ver sus grabaciones
-- Ruta: {appointment_id}/recording.mp4
CREATE POLICY "Session participants view recordings"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'recordings'
    AND EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id::text = (storage.foldername(name))[1]
      AND (a.patient_id = auth.uid() OR a.psychologist_id = auth.uid())
      AND EXISTS (
        SELECT 1 FROM public.session_records sr
        WHERE sr.appointment_id = a.id AND sr.recording_consent = TRUE
      )
    )
  );

-- Política: solo el sistema (service_role via backend) puede subir grabaciones
-- No hay política INSERT para usuarios — el backend lo maneja con service_role

-- Política: admins pueden ver grabaciones (para soporte y compliance)
CREATE POLICY "Admins view recordings for compliance"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'recordings'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- BUCKET 4: blog-images
-- Imágenes para posts de la comunidad
-- Visibilidad: PÚBLICO
-- ============================================================

-- En Supabase Dashboard > Storage > New Bucket:
-- Name: blog-images
-- Public: TRUE
-- Max file size: 10MB
-- Allowed types: image/jpeg, image/png, image/webp, image/gif

CREATE POLICY "Blog images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users manage own blog images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- NOTAS IMPORTANTES DE SEGURIDAD
-- ============================================================
-- 1. La SERVICE_ROLE_KEY del backend puede bypassear RLS
--    Úsala solo en el backend, NUNCA en el frontend
--
-- 2. Las grabaciones deben encriptarse adicionalmente antes de subir
--    Usar AES-256 en el backend antes del upload
--
-- 3. Los documentos de psicólogos son sensibles:
--    - No indexar en buscadores
--    - URLs con expiración corta (1 hora)
--    - Log de cada acceso en audit_logs
--
-- 4. Configurar CORS en Supabase Storage:
--    Permitir solo tu dominio frontend (tucora.com)
--
-- 5. Configurar CDN solo para buckets públicos (avatars, blog-images)
--    Los privados nunca deben pasar por CDN sin autenticación
-- ============================================================
