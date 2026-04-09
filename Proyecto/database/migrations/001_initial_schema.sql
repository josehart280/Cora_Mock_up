-- ============================================================
-- CORA TELETHERAPY PLATFORM — Supabase SQL Schema
-- ============================================================
-- Versión: 1.0.0
-- Fecha: 2026-04-07
-- Autor: Jose Alonso Porras Ramirez / Cora
-- ============================================================
-- INSTRUCCIONES:
-- 1. Ir a Supabase Dashboard > SQL Editor
-- 2. Pegar este archivo y ejecutar
-- 3. Luego ejecutar 002_rls_policies.sql
-- 4. Luego ejecutar 003_storage_buckets.sql (en Storage tab)
-- 5. Opcionalmente ejecutar seed/seed_data.sql para datos de prueba
-- ============================================================

-- ============================================================
-- EXTENSIONES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda fuzzy de psicólogos

-- ============================================================
-- ENUMS
-- ============================================================

-- Roles de usuario en la plataforma
CREATE TYPE user_role AS ENUM (
  'patient',         -- Paciente buscando terapia
  'psychologist',    -- Psicólogo/terapeuta certificado
  'admin'            -- Administrador de la plataforma
);

-- Estado de las citas
CREATE TYPE appointment_status AS ENUM (
  'pending',         -- Creada, pendiente de confirmación del psicólogo
  'scheduled',       -- Confirmada por ambas partes
  'in_progress',     -- Sesión actualmente en curso
  'completed',       -- Sesión finalizada exitosamente
  'cancelled',       -- Cancelada por cualquier parte
  'no_show'          -- Paciente no se presentó
);

-- Estado de los pagos
CREATE TYPE payment_status AS ENUM (
  'pending',         -- Pago iniciado, esperando confirmación
  'processing',      -- Siendo procesado por Stripe
  'completed',       -- Pago exitoso
  'failed',          -- Pago fallido
  'refunded',        -- Reembolsado
  'partially_refunded' -- Reembolso parcial
);

-- Planes de suscripción
CREATE TYPE subscription_plan AS ENUM (
  'per_session',     -- Pago por sesión (sin suscripción)
  'basic',           -- Básico: $52/semana, 1 sesión/mes
  'standard',        -- Estándar: $72/semana, 1 sesión/semana
  'premium'          -- Premium: $95/semana, 2 sesiones/semana
);

-- Estado de suscripción
CREATE TYPE subscription_status AS ENUM (
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'unpaid'
);

-- Tipo de sesión
CREATE TYPE session_type AS ENUM (
  'video',           -- Videollamada WebRTC
  'audio',           -- Solo audio VoIP
  'chat',            -- Chat en tiempo real
  'messaging'        -- Mensajería asincrónica
);

-- Estado de verificación de psicólogos
CREATE TYPE verification_status AS ENUM (
  'pending',         -- Documentos subidos, en revisión
  'in_review',       -- Bajo revisión activa
  'approved',        -- Verificado y activo
  'rejected',        -- Rechazado (con razón)
  'suspended'        -- Suspendido temporalmente
);

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users de Supabase
-- ============================================================

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'patient',
  phone         TEXT,
  avatar_url    TEXT,
  date_of_birth DATE,
  gender        TEXT CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')),
  preferred_language TEXT DEFAULT 'es',
  timezone      TEXT DEFAULT 'America/Costa_Rica',
  is_active     BOOLEAN DEFAULT TRUE,
  profile_complete BOOLEAN DEFAULT FALSE,
  last_seen_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Perfil público de todos los usuarios de la plataforma Cora';

-- ============================================================
-- TABLA: psychologist_profiles
-- Perfil extendido solo para psicólogos
-- ============================================================

CREATE TABLE public.psychologist_profiles (
  id                    UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number        TEXT NOT NULL,
  license_type          TEXT DEFAULT 'CPJ', -- CPJ = Colegio de Psicólogos de Costa Rica
  license_country       TEXT DEFAULT 'CR',
  license_verified      BOOLEAN DEFAULT FALSE,
  license_verified_at   TIMESTAMPTZ,
  verification_status   verification_status DEFAULT 'pending',
  rejection_reason      TEXT,
  specialties           TEXT[] DEFAULT '{}',
  languages             TEXT[] DEFAULT ARRAY['Español'],
  approach              TEXT,                -- Metodología (TCC, Gestalt, etc.)
  bio                   TEXT,
  education             TEXT,               -- Título y universidad
  years_experience      INTEGER DEFAULT 0 CHECK (years_experience >= 0),
  hourly_rate_usd       DECIMAL(10,2) NOT NULL CHECK (hourly_rate_usd >= 0),
  available_hours       JSONB DEFAULT '{
    "monday": [],
    "tuesday": [],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": [],
    "sunday": []
  }'::JSONB,
  average_rating        DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews         INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  total_sessions        INTEGER DEFAULT 0 CHECK (total_sessions >= 0),
  is_accepting_patients BOOLEAN DEFAULT TRUE,
  max_patients          INTEGER DEFAULT 30, -- Cupo máximo de pacientes activos
  session_types         session_type[] DEFAULT ARRAY['video'::session_type],
  documents_urls        JSONB DEFAULT '{}', -- { "license": "url", "degree": "url", "id": "url" }
  stripe_account_id     TEXT,              -- Para recibir pagos
  payout_enabled        BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.psychologist_profiles IS 'Información profesional y configuración de psicólogos verificados';

-- ============================================================
-- TABLA: patient_profiles
-- Perfil extendido para pacientes
-- ============================================================

CREATE TABLE public.patient_profiles (
  id                    UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id          UUID REFERENCES public.profiles(id),  -- Psicólogo asignado actual
  emergency_contact     JSONB,  -- { "name": "", "phone": "", "relationship": "" }
  insurance_info        JSONB,  -- Futuro: datos de seguro médico
  quiz_answers          JSONB,  -- Respuestas del cuestionario inicial
  therapy_goals         TEXT[],
  preferred_session_type session_type DEFAULT 'video',
  reason_for_therapy    TEXT,
  intake_completed      BOOLEAN DEFAULT FALSE,
  last_assessment_at    TIMESTAMPTZ,  -- Último PHQ-9/GAD-7
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: appointments
-- ============================================================

CREATE TABLE public.appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id        UUID NOT NULL REFERENCES public.profiles(id),
  psychologist_id   UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_at      TIMESTAMPTZ NOT NULL,
  ended_at          TIMESTAMPTZ,
  duration_minutes  INTEGER NOT NULL DEFAULT 50 CHECK (duration_minutes > 0 AND duration_minutes <= 180),
  status            appointment_status NOT NULL DEFAULT 'scheduled',
  session_type      session_type NOT NULL DEFAULT 'video',
  room_id           TEXT,                -- Sala WebRTC
  meeting_url       TEXT,                -- URL de acceso a la sesión
  notes             TEXT,                -- Notas del paciente antes de la sesión
  therapist_notes   TEXT,                -- Notas privadas del terapeuta (RLS)
  cancellation_reason TEXT,
  cancelled_by      UUID REFERENCES public.profiles(id),
  cancelled_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  no_show_at        TIMESTAMPTZ,
  reminder_24h_sent BOOLEAN DEFAULT FALSE,
  reminder_1h_sent  BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_different_users CHECK (patient_id != psychologist_id),
  CONSTRAINT valid_scheduled_time CHECK (scheduled_at > created_at)
);

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_psychologist ON public.appointments(psychologist_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON public.appointments(status);

COMMENT ON TABLE public.appointments IS 'Citas programadas entre pacientes y psicólogos';

-- ============================================================
-- TABLA: payments
-- ============================================================

CREATE TABLE public.payments (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id            UUID REFERENCES public.appointments(id),
  patient_id                UUID NOT NULL REFERENCES public.profiles(id),
  psychologist_id           UUID NOT NULL REFERENCES public.profiles(id),
  amount_cents              INTEGER NOT NULL CHECK (amount_cents > 0),
  platform_fee_cents        INTEGER NOT NULL CHECK (platform_fee_cents >= 0),  -- 15% por defecto
  psychologist_payout_cents INTEGER NOT NULL CHECK (psychologist_payout_cents >= 0),  -- 85%
  currency                  TEXT NOT NULL DEFAULT 'USD',
  status                    payment_status NOT NULL DEFAULT 'pending',
  payment_method            TEXT,                        -- 'card', 'bank_transfer'
  stripe_payment_intent_id  TEXT UNIQUE,
  stripe_charge_id          TEXT,
  refund_amount_cents        INTEGER DEFAULT 0,
  refund_reason             TEXT,
  stripe_refund_id          TEXT,
  metadata                  JSONB DEFAULT '{}',
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  completed_at              TIMESTAMPTZ,
  refunded_at               TIMESTAMPTZ
);

CREATE INDEX idx_payments_patient ON public.payments(patient_id);
CREATE INDEX idx_payments_psychologist ON public.payments(psychologist_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_stripe ON public.payments(stripe_payment_intent_id);

-- ============================================================
-- TABLA: subscriptions
-- ============================================================

CREATE TABLE public.subscriptions (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL REFERENCES public.profiles(id),
  plan                        subscription_plan NOT NULL,
  status                      subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id      TEXT UNIQUE,
  stripe_customer_id          TEXT,
  current_period_start        TIMESTAMPTZ,
  current_period_end          TIMESTAMPTZ,
  cancel_at_period_end        BOOLEAN DEFAULT FALSE,
  cancelled_at                TIMESTAMPTZ,
  cancellation_reason         TEXT,
  trial_start                 TIMESTAMPTZ,
  trial_end                   TIMESTAMPTZ,
  price_cents                 INTEGER NOT NULL,
  currency                    TEXT DEFAULT 'USD',
  billing_interval            TEXT DEFAULT 'week' CHECK (billing_interval IN ('week', 'month', 'year')),
  sessions_per_period         INTEGER DEFAULT 1, -- Sesiones incluidas en el plan
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================================
-- TABLA: session_records
-- Registro de sesiones de video/audio/chat
-- ============================================================

CREATE TABLE public.session_records (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id      UUID NOT NULL REFERENCES public.appointments(id) UNIQUE,
  room_id             TEXT NOT NULL,
  started_at          TIMESTAMPTZ NOT NULL,
  ended_at            TIMESTAMPTZ,
  duration_seconds    INTEGER,
  recording_url       TEXT,              -- URL encriptada en Supabase Storage
  recording_consent   BOOLEAN DEFAULT FALSE, -- Consentimiento explícito del paciente
  recording_consent_at TIMESTAMPTZ,
  participant_count   INTEGER DEFAULT 0,
  connection_quality  TEXT,              -- 'excellent', 'good', 'poor'
  technical_issues    TEXT,
  metadata            JSONB DEFAULT '{}'
);

-- ============================================================
-- TABLA: session_chat_messages
-- Mensajes de chat durante sesiones
-- ============================================================

CREATE TABLE public.session_chat_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID NOT NULL REFERENCES public.session_records(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.profiles(id),
  content         TEXT NOT NULL,
  content_encrypted TEXT,               -- Versión encriptada del contenido
  is_encrypted    BOOLEAN DEFAULT FALSE,
  sent_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: async_messages
-- Mensajería asincrónica entre paciente y psicólogo fuera de sesión
-- ============================================================

CREATE TABLE public.async_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,        -- Agrupa mensajes por par paciente-psicólogo
  sender_id       UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id    UUID NOT NULL REFERENCES public.profiles(id),
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT no_self_message CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_async_messages_conversation ON public.async_messages(conversation_id);
CREATE INDEX idx_async_messages_recipient ON public.async_messages(recipient_id, is_read);

-- ============================================================
-- TABLA: reviews
-- Reseñas de sesiones completadas
-- ============================================================

CREATE TABLE public.reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id    UUID NOT NULL REFERENCES public.appointments(id),
  patient_id        UUID NOT NULL REFERENCES public.profiles(id),
  psychologist_id   UUID NOT NULL REFERENCES public.profiles(id),
  rating            INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title             TEXT,
  content           TEXT NOT NULL,
  would_recommend   BOOLEAN DEFAULT TRUE,
  is_anonymous      BOOLEAN DEFAULT TRUE,
  is_published      BOOLEAN DEFAULT TRUE,  -- Para moderación
  therapist_response TEXT,                -- Respuesta del psicólogo
  therapist_response_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id)  -- Solo una reseña por cita
);

CREATE INDEX idx_reviews_psychologist ON public.reviews(psychologist_id, is_published);
CREATE INDEX idx_reviews_patient ON public.reviews(patient_id);

-- ============================================================
-- TABLA: blog_posts (Comunidad)
-- ============================================================

CREATE TABLE public.blog_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID REFERENCES public.profiles(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  excerpt     TEXT,
  category    TEXT DEFAULT 'general' CHECK (
    category IN ('experiences', 'resources', 'questions', 'support', 'news', 'general')
  ),
  tags        TEXT[] DEFAULT '{}',
  is_anonymous BOOLEAN DEFAULT TRUE,
  status      TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'flagged')),
  is_pinned   BOOLEAN DEFAULT FALSE,
  allow_comments BOOLEAN DEFAULT TRUE,
  like_count  INTEGER DEFAULT 0 CHECK (like_count >= 0),
  comment_count INTEGER DEFAULT 0 CHECK (comment_count >= 0),
  view_count  INTEGER DEFAULT 0 CHECK (view_count >= 0),
  read_time_minutes INTEGER DEFAULT 3,
  cover_image_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_category ON public.blog_posts(category, status);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- ============================================================
-- TABLA: post_comments
-- ============================================================

CREATE TABLE public.post_comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES public.profiles(id),
  parent_id   UUID REFERENCES public.post_comments(id), -- Para replies
  content     TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  like_count  INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'published' CHECK (status IN ('published', 'flagged', 'deleted')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON public.post_comments(post_id, status);

-- ============================================================
-- TABLA: post_likes
-- ============================================================

CREATE TABLE public.post_likes (
  post_id     UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- ============================================================
-- TABLA: audit_logs
-- Log de auditoría para compliance (Ley 8968)
-- ============================================================

CREATE TABLE public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.profiles(id),
  action      TEXT NOT NULL,  -- 'login', 'logout', 'view_session', 'cancel_subscription', etc.
  entity_type TEXT,           -- 'appointment', 'payment', 'profile', etc.
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action, created_at DESC);

-- ============================================================
-- TABLA: notifications
-- ============================================================

CREATE TABLE public.notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,  -- 'appointment_reminder', 'message', 'payment', 'system'
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  action_url      TEXT,          -- Deep link al recurso relacionado
  is_read         BOOLEAN DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- TABLA: assessments
-- PHQ-9, GAD-7 y otros cuestionarios de progreso
-- ============================================================

CREATE TABLE public.assessments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES public.profiles(id),
  type            TEXT NOT NULL CHECK (type IN ('PHQ-9', 'GAD-7', 'WHO-5', 'SDS')),
  score           INTEGER NOT NULL,
  severity        TEXT,             -- Basado en escala del cuestionario
  answers         JSONB NOT NULL,   -- Respuestas individuales
  notes           TEXT,
  completed_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_patient ON public.assessments(patient_id, completed_at DESC);

-- ============================================================
-- TABLA: waitlist
-- Lista de espera cuando psicólogo está lleno
-- ============================================================

CREATE TABLE public.waitlist (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES public.profiles(id),
  psychologist_id UUID NOT NULL REFERENCES public.profiles(id),
  notes           TEXT,
  notified        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(patient_id, psychologist_id)
);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Función: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER psychologist_profiles_updated_at BEFORE UPDATE ON public.psychologist_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER patient_profiles_updated_at BEFORE UPDATE ON public.patient_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Función: crear perfil al registrar usuario en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 2)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-crear perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función: actualizar rating promedio del psicólogo al agregar reseña
CREATE OR REPLACE FUNCTION public.update_psychologist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.psychologist_profiles
  SET
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.reviews
      WHERE psychologist_id = NEW.psychologist_id AND is_published = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*) FROM public.reviews
      WHERE psychologist_id = NEW.psychologist_id AND is_published = TRUE
    )
  WHERE id = NEW.psychologist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_created
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_psychologist_rating();

-- Función: actualizar contador de likes en posts
CREATE OR REPLACE FUNCTION public.update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.blog_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_like_count();

-- Función: actualizar contador de comentarios
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.blog_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'deleted' AND OLD.status != 'deleted' THEN
    UPDATE public.blog_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR UPDATE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();

-- ============================================================
-- VISTAS (para queries comunes)
-- ============================================================

-- Vista: psicólogos verificados con info completa
CREATE OR REPLACE VIEW public.verified_psychologists AS
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.full_name,
  p.avatar_url,
  pp.license_number,
  pp.license_type,
  pp.specialties,
  pp.languages,
  pp.approach,
  pp.bio,
  pp.education,
  pp.years_experience,
  pp.hourly_rate_usd,
  pp.available_hours,
  pp.average_rating,
  pp.total_reviews,
  pp.total_sessions,
  pp.is_accepting_patients,
  pp.session_types
FROM public.profiles p
INNER JOIN public.psychologist_profiles pp ON p.id = pp.id
WHERE
  p.role = 'psychologist'
  AND p.is_active = TRUE
  AND pp.verification_status = 'approved'
  AND pp.license_verified = TRUE;

COMMENT ON VIEW public.verified_psychologists IS 'Vista pública de psicólogos verificados y activos';

-- Vista: resumen de citas para calendario
CREATE OR REPLACE VIEW public.appointment_summary AS
SELECT
  a.id,
  a.scheduled_at,
  a.duration_minutes,
  a.status,
  a.session_type,
  a.room_id,
  a.patient_id,
  pat.first_name AS patient_first_name,
  pat.last_name AS patient_last_name,
  pat.avatar_url AS patient_avatar,
  a.psychologist_id,
  psy.first_name AS psychologist_first_name,
  psy.last_name AS psychologist_last_name,
  psy.avatar_url AS psychologist_avatar
FROM public.appointments a
JOIN public.profiles pat ON a.patient_id = pat.id
JOIN public.profiles psy ON a.psychologist_id = psy.id;

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================

-- Resumen de tablas creadas:
-- 1. profiles               - Todos los usuarios
-- 2. psychologist_profiles   - Perfil extendido de psicólogos
-- 3. patient_profiles        - Perfil extendido de pacientes
-- 4. appointments            - Citas programadas
-- 5. payments                - Pagos procesados
-- 6. subscriptions           - Suscripciones activas
-- 7. session_records         - Grabaciones y metadata de sesiones
-- 8. session_chat_messages   - Chat en sesión
-- 9. async_messages          - Mensajería fuera de sesión
-- 10. reviews                - Reseñas post-sesión
-- 11. blog_posts             - Comunidad / Blog
-- 12. post_comments          - Comentarios en posts
-- 13. post_likes             - Likes en posts
-- 14. audit_logs             - Log de auditoría (compliance)
-- 15. notifications          - Notificaciones push/in-app
-- 16. assessments            - PHQ-9, GAD-7, etc.
-- 17. waitlist               - Lista de espera
