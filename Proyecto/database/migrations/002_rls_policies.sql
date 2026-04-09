-- ============================================================
-- CORA — Row Level Security Policies
-- ============================================================
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.async_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNCIÓN HELPER: verificar si el usuario es admin
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = TRUE
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================

-- Usuarios ven su propio perfil
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Psicólogos y sus perfiles son visibles para todos (públicos)
CREATE POLICY "Psychologist profiles are public"
  ON public.profiles FOR SELECT
  USING (role = 'psychologist' AND is_active = TRUE);

-- Admins ven todos los perfiles
CREATE POLICY "Admins view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Usuarios actualizan su propio perfil
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins actualizan cualquier perfil
CREATE POLICY "Admins update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Solo el sistema (service_role) puede insertar perfiles directamente
-- El trigger handle_new_user usa SECURITY DEFINER y lo hace automáticamente

-- ============================================================
-- POLÍTICAS: psychologist_profiles
-- ============================================================

-- Perfil del psicólogo es público si está verificado
CREATE POLICY "Verified psychologist profiles are public"
  ON public.psychologist_profiles FOR SELECT
  USING (
    verification_status = 'approved'
    OR id = auth.uid()
    OR public.is_admin()
  );

-- Psicólogo actualiza su propio perfil
CREATE POLICY "Psychologist updates own profile"
  ON public.psychologist_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins actualizan (para verificación, suspensión)
CREATE POLICY "Admins update psychologist profiles"
  ON public.psychologist_profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: patient_profiles
-- ============================================================

-- Paciente ve solo su propio perfil
CREATE POLICY "Patient views own profile"
  ON public.patient_profiles FOR SELECT
  USING (id = auth.uid());

-- Psicólogo ve perfiles de sus pacientes asignados
CREATE POLICY "Psychologist views assigned patient profiles"
  ON public.patient_profiles FOR SELECT
  USING (
    therapist_id = auth.uid()
    OR public.is_admin()
  );

-- Paciente actualiza su propio perfil
CREATE POLICY "Patient updates own profile"
  ON public.patient_profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- POLÍTICAS: appointments
-- ============================================================

-- Paciente ve sus propias citas
CREATE POLICY "Patient views own appointments"
  ON public.appointments FOR SELECT
  USING (patient_id = auth.uid());

-- Psicólogo ve sus citas
CREATE POLICY "Psychologist views own appointments"
  ON public.appointments FOR SELECT
  USING (psychologist_id = auth.uid());

-- Admin ve todas las citas
CREATE POLICY "Admins view all appointments"
  ON public.appointments FOR SELECT
  USING (public.is_admin());

-- Paciente crea citas (solo como paciente)
CREATE POLICY "Patient creates appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    patient_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'patient'
    )
  );

-- Participantes actualizan la cita (paciente o psicólogo)
CREATE POLICY "Participants update appointment"
  ON public.appointments FOR UPDATE
  USING (patient_id = auth.uid() OR psychologist_id = auth.uid() OR public.is_admin())
  WITH CHECK (patient_id = auth.uid() OR psychologist_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: payments
-- ============================================================

-- Paciente ve sus propios pagos
CREATE POLICY "Patient views own payments"
  ON public.payments FOR SELECT
  USING (patient_id = auth.uid());

-- Psicólogo ve sus pagos recibidos
CREATE POLICY "Psychologist views own payments"
  ON public.payments FOR SELECT
  USING (psychologist_id = auth.uid());

-- Admin ve todos los pagos
CREATE POLICY "Admins view all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- Solo service_role puede insertar/actualizar pagos (backend con Stripe)
-- No hay políticas FOR INSERT para usuarios finales

-- ============================================================
-- POLÍTICAS: subscriptions
-- ============================================================

-- Usuario ve su propia suscripción
CREATE POLICY "User views own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: session_records
-- ============================================================

-- Solo participantes de la sesión pueden ver el registro
CREATE POLICY "Session participants view session records"
  ON public.session_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = session_records.appointment_id
      AND (a.patient_id = auth.uid() OR a.psychologist_id = auth.uid())
    )
    OR public.is_admin()
  );

-- ============================================================
-- POLÍTICAS: async_messages
-- ============================================================

-- Solo el emisor o receptor puede ver el mensaje
CREATE POLICY "Message participants view messages"
  ON public.async_messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR public.is_admin());

-- Usuario puede enviar mensajes (solo de su parte)
CREATE POLICY "User sends messages as themselves"
  ON public.async_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Receptor puede marcar como leído
CREATE POLICY "Recipient marks message read"
  ON public.async_messages FOR UPDATE
  USING (recipient_id = auth.uid() OR public.is_admin())
  WITH CHECK (recipient_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: reviews
-- ============================================================

-- Reviews publicadas son visibles para todos
CREATE POLICY "Published reviews are public"
  ON public.reviews FOR SELECT
  USING (is_published = TRUE);

-- Paciente ve sus propias reseñas
CREATE POLICY "Patient views own reviews"
  ON public.reviews FOR SELECT
  USING (patient_id = auth.uid());

-- Admin ve todas las reseñas
CREATE POLICY "Admins view all reviews"
  ON public.reviews FOR SELECT
  USING (public.is_admin());

-- Paciente crea reseña solo si tiene la cita completada
CREATE POLICY "Patient creates review after completed appointment"
  ON public.reviews FOR INSERT
  WITH CHECK (
    patient_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id
      AND patient_id = auth.uid()
      AND status = 'completed'
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'patient'
    )
  );

-- ============================================================
-- POLÍTICAS: blog_posts
-- ============================================================

-- Posts publicados son visibles para todos
CREATE POLICY "Published blog posts are public"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Autores ven sus propios posts (incluyendo borradores)
CREATE POLICY "Authors view own posts"
  ON public.blog_posts FOR SELECT
  USING (author_id = auth.uid());

-- Admin ve todos los posts
CREATE POLICY "Admins view all posts"
  ON public.blog_posts FOR SELECT
  USING (public.is_admin());

-- Usuario autenticado puede crear posts
CREATE POLICY "Authenticated users create posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- Solo el autor puede actualizar y eliminar sus posts
CREATE POLICY "Author manages own posts"
  ON public.blog_posts FOR UPDATE
  USING (author_id = auth.uid() OR public.is_admin())
  WITH CHECK (author_id = auth.uid() OR public.is_admin());

CREATE POLICY "Author or admin deletes posts"
  ON public.blog_posts FOR DELETE
  USING (author_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: post_comments
-- ============================================================

-- Comentarios publicados son visibles
CREATE POLICY "Published comments are public"
  ON public.post_comments FOR SELECT
  USING (status = 'published');

-- Usuarios autenticados pueden comentar
CREATE POLICY "Authenticated users comment"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

-- Autor o admin puede eliminar/moderar comentario
CREATE POLICY "Author or admin manages comment"
  ON public.post_comments FOR UPDATE
  USING (author_id = auth.uid() OR public.is_admin());

-- ============================================================
-- POLÍTICAS: post_likes
-- ============================================================

-- Likes son visibles para todos
CREATE POLICY "Likes are public"
  ON public.post_likes FOR SELECT
  USING (TRUE);

-- Usuario autenticado puede dar like
CREATE POLICY "Authenticated users can like"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Usuario puede quitar su propio like
CREATE POLICY "User removes own like"
  ON public.post_likes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- POLÍTICAS: notifications
-- ============================================================

-- Usuario ve sus propias notificaciones
CREATE POLICY "User views own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Usuario puede marcar como leída su notificación
CREATE POLICY "User marks own notification read"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- POLÍTICAS: audit_logs
-- ============================================================

-- Solo admins pueden ver audit logs
CREATE POLICY "Admins view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- POLÍTICAS: assessments
-- ============================================================

-- Paciente ve sus propios assessments
CREATE POLICY "Patient views own assessments"
  ON public.assessments FOR SELECT
  USING (patient_id = auth.uid());

-- Psicólogo ve assessments de sus pacientes
CREATE POLICY "Psychologist views patient assessments"
  ON public.assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.patient_profiles
      WHERE id = assessments.patient_id AND therapist_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Paciente puede completar assessment
CREATE POLICY "Patient completes assessment"
  ON public.assessments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- ============================================================
-- FIN DE RLS POLICIES
-- ============================================================
