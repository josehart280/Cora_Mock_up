-- ============================================================
-- CORA — Usuarios de Prueba para Desarrollo
-- ============================================================
-- AUTOR: Jose Alonso Porras Ramirez
-- FECHA: 2026-04-09
-- VERSION: 1.0.0
-- ============================================================
-- IMPORTANTE: Este archivo contiene datos de prueba.
-- NUNCA ejecutar en producción.
-- ============================================================
-- INSTRUCCIONES:
-- 1. Ejecutar primero 001_initial_schema.sql
-- 2. Crear usuarios en Supabase Auth Dashboard
-- 3. Actualizar las UUIDs en este archivo con las reales
-- 4. Ejecutar este seed
-- ============================================================

-- ============================================================
-- NOTA: Las UUIDs son ejemplos. En desarrollo real:
-- 1. Crear usuarios en Supabase Auth (email + password)
-- 2. El trigger handle_new_user crea el profile automáticamente
-- 3. Actualizar profiles y psychologist_profiles con estos datos
-- ============================================================

-- ============================================================
-- PASSWORD PARA TODOS LOS USUARIOS DE PRUEBA: Test1234!
-- ============================================================

-- ============================================================
-- USUARIO ADMIN
-- ============================================================

-- Crear en Supabase Auth:
-- Email: admin@cora.local
-- Password: Test1234!

-- UUID de ejemplo (reemplazar con el real de Supabase Auth)
-- 'a0000000-0000-0000-0000-000000000001'::uuid

UPDATE public.profiles SET
  first_name = 'Admin',
  last_name = 'Sistema',
  full_name = 'Admin Sistema',
  phone = '+50688880001',
  role = 'admin',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'admin@cora.local';

-- ============================================================
-- PSICÓLOGOS VERIFICADOS
-- ============================================================

-- PSICÓLOGO 1: María Elena Vargas
-- Email: maria.vargas@cora.local
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'María Elena',
  last_name = 'Vargas Sánchez',
  full_name = 'María Elena Vargas Sánchez',
  phone = '+50688881001',
  role = 'psychologist',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'maria.vargas@cora.local';

-- Insertar perfil de psicólogo
INSERT INTO public.psychologist_profiles (
  id, license_number, license_type, license_country, license_verified, license_verified_at,
  verification_status, specialties, languages, approach, bio, education, years_experience,
  hourly_rate_usd, average_rating, total_reviews, total_sessions, is_accepting_patients,
  session_types, available_hours
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  'CPC-2018-4521',
  'CPJ',
  'CR',
  TRUE,
  NOW() - INTERVAL '60 days',
  'approved',
  ARRAY['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual', 'Estrés laboral', 'Duelo'],
  ARRAY['Español', 'Inglés'],
  'Cognitivo-Conductual (TCC) y Humanista',
  'Psicóloga clínica con más de 10 años de experiencia. Me especializo en terapia cognitivo-conductual para ansiedad y depresión. Mi enfoque es cálido y empático, creando un espacio seguro para que puedas explorar tus emociones. Creo firmemente que cada persona tiene los recursos para sanar y crecer.',
  'Licenciatura en Psicología, UCR. Maestría en Psicología Clínica, UNA.',
  10,
  65.00,
  4.92,
  156,
  892,
  TRUE,
  ARRAY['video'::session_type, 'audio'::session_type],
  '{
    "monday": ["09:00", "10:00", "11:00", "15:00", "16:00", "17:00"],
    "tuesday": ["09:00", "10:00", "14:00", "15:00", "16:00"],
    "wednesday": ["10:00", "11:00", "15:00", "16:00", "17:00"],
    "thursday": ["09:00", "10:00", "11:00"],
    "friday": ["14:00", "15:00", "16:00", "17:00"],
    "saturday": [],
    "sunday": []
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  license_number = EXCLUDED.license_number,
  verification_status = EXCLUDED.verification_status,
  specialties = EXCLUDED.specialties;

-- PSICÓLOGO 2: Carlos Rodríguez
-- Email: carlos.rodriguez@cora.local
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'Carlos',
  last_name = 'Rodríguez Mora',
  full_name = 'Carlos Rodríguez Mora',
  phone = '+50688881002',
  role = 'psychologist',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'carlos.rodriguez@cora.local';

INSERT INTO public.psychologist_profiles (
  id, license_number, license_type, license_country, license_verified, license_verified_at,
  verification_status, specialties, languages, approach, bio, education, years_experience,
  hourly_rate_usd, average_rating, total_reviews, total_sessions, is_accepting_patients,
  session_types, available_hours
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'carlos.rodriguez@cora.local'),
  'CPC-2015-3847',
  'CPJ',
  'CR',
  TRUE,
  NOW() - INTERVAL '120 days',
  'approved',
  ARRAY['Terapia de pareja', 'Terapia familiar', 'Comunicación', 'Conflictos'],
  ARRAY['Español'],
  'Sistémico y Terapia Familiar',
  'Terapeuta de pareja y familia con enfoque sistémico. Ayudo a parejas y familias a mejorar su comunicación, resolver conflictos y construir relaciones más saludables. Mi experiencia de 15 años me ha enseñado que todas las relaciones pueden sanar con el apoyo adecuado.',
  'Licenciatura en Psicología, UCR. Especialización en Terapia Familiar y de Pareja, Universidad de Barcelona.',
  15,
  70.00,
  4.88,
  203,
  1245,
  TRUE,
  ARRAY['video'::session_type],
  '{
    "monday": ["10:00", "11:00", "16:00", "17:00", "18:00"],
    "tuesday": [],
    "wednesday": ["10:00", "11:00", "16:00", "17:00", "18:00"],
    "thursday": [],
    "friday": ["09:00", "10:00", "11:00", "15:00", "16:00"],
    "saturday": ["10:00", "11:00"],
    "sunday": []
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  license_number = EXCLUDED.license_number,
  verification_status = EXCLUDED.verification_status,
  specialties = EXCLUDED.specialties;

-- PSICÓLOGO 3: Ana Lucía Jiménez
-- Email: ana.jimenez@cora.local
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'Ana Lucía',
  last_name = 'Jiménez Rojas',
  full_name = 'Ana Lucía Jiménez Rojas',
  phone = '+50688881003',
  role = 'psychologist',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'ana.jimenez@cora.local';

INSERT INTO public.psychologist_profiles (
  id, license_number, license_type, license_country, license_verified, license_verified_at,
  verification_status, specialties, languages, approach, bio, education, years_experience,
  hourly_rate_usd, average_rating, total_reviews, total_sessions, is_accepting_patients,
  session_types, available_hours
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'ana.jimenez@cora.local'),
  'CPC-2020-5892',
  'CPJ',
  'CR',
  TRUE,
  NOW() - INTERVAL '30 days',
  'approved',
  ARRAY['Terapia infantil', 'Adolescentes', 'TDAH', 'Problemas de conducta', 'Ansiedad en niños'],
  ARRAY['Español'],
  'Lúdico y Cognitivo-Conductual',
  'Psicóloga infantil especializada en terapia lúdica. Trabajo con niños y adolescentes para ayudarles a manejar sus emociones, mejorar su comportamiento y desarrollar habilidades sociales. Mi consultorio virtual está adaptado con recursos interactivos para los más pequeños.',
  'Licenciatura en Psicología, UCR. Maestría en Psicología Infantil, Universidad de Chile.',
  5,
  55.00,
  4.95,
  89,
  312,
  TRUE,
  ARRAY['video'::session_type, 'chat'::session_type],
  '{
    "monday": ["14:00", "15:00", "16:00"],
    "tuesday": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "wednesday": ["14:00", "15:00", "16:00", "17:00"],
    "thursday": ["09:00", "10:00", "11:00"],
    "friday": ["14:00", "15:00", "16:00"],
    "saturday": ["10:00", "11:00"],
    "sunday": []
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  license_number = EXCLUDED.license_number,
  verification_status = EXCLUDED.verification_status,
  specialties = EXCLUDED.specialties;

-- ============================================================
-- PACIENTES
-- ============================================================

-- PACIENTE 1: Juan Pérez
-- Email: juan.perez@ejemplo.com
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'Juan',
  last_name = 'Pérez González',
  full_name = 'Juan Pérez González',
  phone = '+50688882001',
  role = 'patient',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'juan.perez@ejemplo.com';

INSERT INTO public.patient_profiles (
  id, therapist_id, emergency_contact, therapy_goals, preferred_session_type,
  reason_for_therapy, intake_completed
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  '{"name": "María González", "phone": "+50688889999", "relationship": "Esposa"}'::jsonb,
  ARRAY['Manejar la ansiedad', 'Mejorar mi comunicación', 'Reducir el estrés laboral'],
  'video',
  'Siento ansiedad constante y tengo problemas para dormir. Quiero aprender herramientas para manejarlo.',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- PACIENTE 2: Laura Sandí
-- Email: laura.sandi@ejemplo.com
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'Laura',
  last_name = 'Sandí Valverde',
  full_name = 'Laura Sandí Valverde',
  phone = '+50688882002',
  role = 'patient',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'laura.sandi@ejemplo.com';

INSERT INTO public.patient_profiles (
  id, therapist_id, emergency_contact, therapy_goals, preferred_session_type,
  reason_for_therapy, intake_completed
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'laura.sandi@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'carlos.rodriguez@cora.local'),
  '{"name": "Roberto Valverde", "phone": "+50688888888", "relationship": "Padre"}'::jsonb,
  ARRAY['Mejorar la comunicación con mi pareja', 'Resolver conflictos familiares'],
  'video',
  'Mi pareja y yo tenemos problemas de comunicación y queremos trabajar en ello juntos.',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- PACIENTE 3: Diego Mora
-- Email: diego.mora@ejemplo.com
-- Password: Test1234!

UPDATE public.profiles SET
  first_name = 'Diego',
  last_name = 'Mora Vargas',
  full_name = 'Diego Mora Vargas',
  phone = '+50688882003',
  role = 'patient',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
  is_active = TRUE,
  profile_complete = TRUE
WHERE email = 'diego.mora@ejemplo.com';

INSERT INTO public.patient_profiles (
  id, therapist_id, emergency_contact, therapy_goals, preferred_session_type,
  reason_for_therapy, intake_completed
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'diego.mora@ejemplo.com'),
  NULL, -- Sin terapeuta asignado aún
  '{"name": "Patricia Vargas", "phone": "+50688887777", "relationship": "Madre"}'::jsonb,
  ARRAY['Entender mis emociones', 'Mejorar autoestima'],
  'video',
  'Me siento perdido y necesito orientación para entender qué quiero en la vida.',
  FALSE
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CITAS DE PRUEBA
-- ============================================================

-- Cita pasada (completada)
INSERT INTO public.appointments (
  patient_id, psychologist_id, scheduled_at, duration_minutes, status,
  session_type, room_id, notes, completed_at
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  NOW() - INTERVAL '2 days',
  50,
  'completed',
  'video',
  'room-past-001',
  'Primera sesión de evaluación. El paciente presenta ansiedad generalizada.',
  NOW() - INTERVAL '2 days' + INTERVAL '50 minutes'
) ON CONFLICT DO NOTHING;

-- Cita programada (futura)
INSERT INTO public.appointments (
  patient_id, psychologist_id, scheduled_at, duration_minutes, status,
  session_type, room_id, notes
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  NOW() + INTERVAL '3 days',
  50,
  'scheduled',
  'video',
  'room-future-001',
  'Segunda sesión. Continuación del tratamiento.'
) ON CONFLICT DO NOTHING;

-- Cita de Laura con Carlos
INSERT INTO public.appointments (
  patient_id, psychologist_id, scheduled_at, duration_minutes, status,
  session_type, room_id, notes
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'laura.sandi@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'carlos.rodriguez@cora.local'),
  NOW() + INTERVAL '1 day',
  50,
  'scheduled',
  'video',
  'room-couple-001',
  'Sesión de pareja.'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- REVIEWS DE PRUEBA
-- ============================================================

INSERT INTO public.reviews (
  patient_id, psychologist_id, appointment_id, rating, comment,
  is_anonymous, created_at
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  (SELECT id FROM public.appointments WHERE status = 'completed' LIMIT 1),
  5,
  'Excelente profesional. Me sentí muy cómodo hablando sobre mis problemas. María tiene una forma muy cálida de hacer sentir a uno escuchado.',
  FALSE,
  NOW() - INTERVAL '1 day'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- SUSCRIPCIÓN DE PRUEBA
-- ============================================================

INSERT INTO public.subscriptions (
  user_id, plan, status, current_period_start, current_period_end,
  price_cents, billing_interval, sessions_per_period
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  'standard',
  'active',
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '21 days',
  7200, -- $72 USD en centavos
  'week',
  1
) ON CONFLICT DO NOTHING;

-- ============================================================
-- MENSAJES DE PRUEBA
-- ============================================================

INSERT INTO public.messages (
  sender_id, receiver_id, content, read_at
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  '¡Hola Juan! Gracias por tu confianza. Nos vemos en nuestra próxima sesión el miércoles.',
  NULL
) ON CONFLICT DO NOTHING;

INSERT INTO public.messages (
  sender_id, receiver_id, content, read_at
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'juan.perez@ejemplo.com'),
  (SELECT id FROM public.profiles WHERE email = 'maria.vargas@cora.local'),
  'Gracias María! Estoy practicando los ejercicios de respiración que me enseñó.',
  NOW() - INTERVAL '2 hours'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- RESUMEN
-- ============================================================

SELECT 'Seed de usuarios ejecutado correctamente' AS status;

SELECT 'Admins: 1' AS usuarios UNION ALL
SELECT 'Psicólogos: 3' UNION ALL
SELECT 'Pacientes: 3' UNION ALL
SELECT 'Citas: 3' UNION ALL
SELECT 'Reviews: 1' UNION ALL
SELECT 'Suscripciones: 1';

-- ============================================================
-- CREDENCIALES DE PRUEBA (Resumen)
-- ============================================================
/*
+---------------------------+-------------------+------------+-------------------+
| Email                     | Password          | Rol        | Nombre            |
+---------------------------+-------------------+------------+-------------------+
| admin@cora.local          | Test1234!        | admin      | Admin Sistema     |
| maria.vargas@cora.local   | Test1234!        | psychologist| María Vargas     |
| carlos.rodriguez@cora.local| Test1234!       | psychologist| Carlos Rodríguez |
| ana.jimenez@cora.local    | Test1234!        | psychologist| Ana Jiménez      |
| juan.perez@ejemplo.com    | Test1234!        | patient    | Juan Pérez        |
| laura.sandi@ejemplo.com   | Test1234!        | patient    | Laura Sandí       |
| diego.mora@ejemplo.com    | Test1234!        | patient    | Diego Mora        |
+---------------------------+-------------------+------------+-------------------+
*/