-- ============================================================
-- CORA — Seed Data para Desarrollo y Demo
-- ============================================================
-- PRECAUCIÓN: Solo ejecutar en entornos de DESARROLLO
-- NUNCA en producción
-- ============================================================
-- Requisito: ejecutar primero la migración y luego crear
-- los usuarios en Supabase Auth (el trigger crea los perfiles)
-- ============================================================

-- ============================================================
-- NOTA: Estas UUIDs son las que Supabase Auth generaría
-- En desarrollo real, crea los usuarios en Auth primero
-- y usa sus IDs reales aquí
-- ============================================================

-- Usuarios demo (UUIDs fijos para reproducibilidad en dev)
-- psicólogo 1
-- psicólogo 2
-- psicólogo 3
-- paciente 1
-- paciente 2

-- ============================================================
-- PSICÓLOGO 1: Carlos Rodríguez Vargas
-- ============================================================

-- Nota: El trigger handle_new_user crea el profile automáticamente
-- al hacer signup en Supabase Auth. Aquí actualizamos los datos.

-- Ejemplo de cómo se actualizaría en código real:
/*
UPDATE public.profiles SET
  first_name = 'Carlos',
  last_name = 'Rodríguez Vargas',
  full_name = 'Carlos Rodríguez Vargas',
  phone = '+50688881001',
  role = 'psychologist',
  is_active = TRUE,
  profile_complete = TRUE
WHERE id = 'PSY_001_UUID_AQUI';

INSERT INTO public.psychologist_profiles (
  id, license_number, license_type, specialties, languages,
  approach, bio, education, years_experience, hourly_rate_usd,
  verification_status, license_verified, license_verified_at,
  is_accepting_patients, average_rating, total_reviews,
  session_types, available_hours
) VALUES (
  'PSY_001_UUID_AQUI',
  'CPC-2024-1234',
  'CPJ',
  ARRAY['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual', 'Estrés'],
  ARRAY['Español', 'Inglés'],
  'Cognitivo-Conductual (TCC)',
  'Especialista en terapia cognitivo-conductual con más de 12 años de experiencia...',
  'Doctorado en Psicología Clínica, UCR',
  12,
  65.00,
  'approved',
  TRUE,
  NOW() - INTERVAL ''30 days'',
  TRUE,
  4.9,
  127,
  ARRAY[''video''::session_type, ''audio''::session_type, ''chat''::session_type],
  ''{
    "monday": ["09:00", "10:00", "11:00", "15:00", "16:00", "17:00"],
    "tuesday": [],
    "wednesday": ["09:00", "10:00", "11:00", "15:00", "16:00"],
    "thursday": [],
    "friday": ["09:00", "10:00", "14:00", "15:00"],
    "saturday": [],
    "sunday": []
  }''::jsonb
);
*/

-- ============================================================
-- POSTS DE COMUNIDAD — Demo
-- ============================================================

-- Insertar posts de demostración (sin foreign key a auth.users reales)
-- Esto usa NULL como author_id para demo (posts "anónimos")

INSERT INTO public.blog_posts
  (title, content, excerpt, category, tags, is_anonymous, status, like_count, comment_count, read_time_minutes)
VALUES
  (
    'Mi primera sesión de terapia online — lo que nadie te dice',
    'Cuando decidí buscar ayuda psicológica, tenía mil dudas sobre la terapia online. ¿Sería igual de efectiva? ¿Se perdería algo sin estar físicamente presente? Quiero compartir mi experiencia después de 3 meses para que otros puedan tomar una decisión informada.

La primera sesión fue rara. No voy a mentir. Estaba en mi cuarto, con mi laptop, intentando abrirme emocionalmente frente a una cámara web. Pero algo pasó en los primeros 10 minutos: empecé a olvidar que era "online". La presencia de mi terapeuta, su forma de escuchar, las preguntas que hacía... todo eso trascendió la pantalla.

Tres meses después, puedo decir que la terapia online cambió mi vida. La comodidad de estar en mi propio espacio me ayudó a abrirme más que en un consultorio. No tenía que manejar 45 minutos para llegar. Podía llorar sin que me viera nadie en la sala de espera.

Si estás dudando, te digo: dale una oportunidad.',
    'Mis dudas, miedos y lo que descubrí después de 3 meses de terapia virtual.',
    'experiences',
    ARRAY['terapia-online', 'primera-vez', 'ansiedad', 'experiencia-personal'],
    TRUE,
    'published',
    47,
    12,
    5
  ),
  (
    '5 técnicas de respiración para manejar ataques de ansiedad',
    'La ansiedad es una de las condiciones de salud mental más comunes, y saber cómo manejarla en el momento puede marcar una gran diferencia. Hoy quiero compartirles técnicas respaldadas por la ciencia que pueden practicar en cualquier momento.

## 1. Respiración 4-7-8

Esta técnica, popularizada por el Dr. Andrew Weil, es excelente para reducir la ansiedad aguda:
- Inhala por la nariz durante 4 segundos
- Mantén la respiración durante 7 segundos
- Exhala completamente por la boca durante 8 segundos

Repite 3-4 veces. El efecto se siente en menos de 1 minuto.

## 2. Respiración en caja (Box Breathing)

Usada por equipos de fuerzas especiales para mantenerse calmos bajo presión:
- Inhala 4 segundos
- Mantén 4 segundos
- Exhala 4 segundos
- Mantén vacío 4 segundos

## 3. Respiración abdominal

Pon una mano en tu pecho y otra en tu abdomen. Al inhalar, asegurate que sea tu abdomen el que se expanda, no tu pecho. Esto activa el sistema nervioso parasimpático.

## 4. Respiración alternada (Nadi Shodhana)

Técnica del yoga que equilibra los dos hemisferios cerebrales. Tapa una fosa nasal con el pulgar e inhala por la otra. Luego cambia.

## 5. Suspiro fisiológico

El más simple: toma dos inhalaciones rápidas seguidas por una exhalación lenta y completa. Esto elimina el CO2 acumulado que contribuye a la ansiedad.',
    'Técnicas respaldadas por ciencia para el manejo de ansiedad aguda.',
    'resources',
    ARRAY['ansiedad', 'técnicas', 'respiración', 'mindfulness', 'herramientas'],
    FALSE,
    'published',
    89,
    23,
    7
  ),
  (
    '¿Cómo saber si necesitás terapia? Las señales que yo ignoré',
    'Muchas veces nos preguntamos si lo que estamos sintiendo "es suficientemente grave" para buscar ayuda. Esta pregunta en sí misma es un síntoma del problema: minimizamos nuestro sufrimiento.

Quiero compartir las señales que yo ignoré por mucho tiempo antes de finalmente pedir ayuda. Si te identificás con alguna, es una señal de que hablar con alguien podría ayudarte.

**Señales de que podrías beneficiarte de terapia:**

1. Te sentís "bien" en términos objetivos pero igual estás triste o vacío
2. Tu forma de manejar el estrés está afectando tu salud (insomnio, dolores físicos)
3. Patrones repetitivos en tus relaciones o trabajo que no podés romper
4. Usás alcohol, comida, trabajo o redes sociales para no sentir
5. Tu estado de ánimo afecta tu trabajo, relaciones o autocuidado
6. Pensamientos que se repiten y no podés parar
7. Te cuesta decir que no o poner límites

La terapia no es solo para "crisis". Es también para crecer, entenderte mejor y vivir con más intención.',
    'Las señales de alerta que muchos ignoramos — y por qué la terapia no es solo para crisis.',
    'questions',
    ARRAY['salud-mental', 'autoconocimiento', 'señales', 'bienestar'],
    TRUE,
    'published',
    134,
    31,
    4
  );

-- ============================================================
-- NOTIFICACIONES DE EJEMPLO (si hay usuarios)
-- ============================================================

-- Ejemplo de notificación template (sin user_id específico)
-- INSERT INTO public.notifications (user_id, type, title, body, action_url)
-- VALUES (
--   'USER_UUID',
--   'appointment_reminder',
--   'Tu sesión es mañana',
--   'Recordatorio: Tenés una sesión con el Dr. Rodríguez mañana a las 15:00',
--   '/sesion/room_abc123'
-- );

-- ============================================================
-- MENSAJE FINAL
-- ============================================================

SELECT 'Seeds ejecutados correctamente' AS status;
SELECT 'Tablas con datos:' AS info;
SELECT 'blog_posts: ' || COUNT(*)::text FROM public.blog_posts;
