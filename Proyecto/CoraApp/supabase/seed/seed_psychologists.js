// ============================================
// Seed Data Script for Psychologists
// Run: node supabase/seed/seed_psychologists.js
// Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY env vars
// ============================================

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ============================================
// Seed Data - 18 Diverse Psychologists
// ============================================

const seedPsychologists = [
  {
    firstName: 'María Elena',
    lastName: 'Vargas Sánchez',
    title: 'Psicóloga Clínica',
    specializations: ['Ansiedad', 'Depresión', 'TCC', 'Estrés laboral', 'Duelo'],
    languages: ['Español', 'Inglés'],
    experience: 10,
    sessionPrice: 65,
    sessionTypes: ['video', 'audio'],
    bio: 'Psicóloga clínica con especialización en Terapia Cognitivo-Conductual. He ayudado a cientos de pacientes a superar la ansiedad y la depresión. Mi enfoque es empático y basado en evidencia científica.',
    approach: 'Cognitivo-Conductual (TCC) y Humanista',
    education: 'Licenciatura en Psicología, Universidad de Costa Rica. Maestría en Psicología Clínica, Universidad de Barcelona.',
    avatarSeed: 'MariaVargas',
    nextAvailable: '2026-04-12T09:00:00Z'
  },
  {
    firstName: 'Carlos',
    lastName: 'Mendoza Rojas',
    title: 'Psicólogo Familiar y de Pareja',
    specializations: ['Terapia de Pareja', 'Familia', 'Comunicación', 'Divorcio', 'Conflictos'],
    languages: ['Español'],
    experience: 15,
    sessionPrice: 75,
    sessionTypes: ['video', 'audio', 'chat'],
    bio: 'Especialista en terapia familiar sistémica. Ayudo a parejas y familias a mejorar su comunicación y resolver conflictos. Experiencia en mediación familiar y terapia de divorcio.',
    approach: 'Sistémica y Narrativa',
    education: 'Licenciatura en Psicología, UCR. Especialización en Terapia Familiar, Universidad Nacional.',
    avatarSeed: 'CarlosMendoza',
    nextAvailable: '2026-04-11T14:00:00Z'
  },
  {
    firstName: 'Ana Lucía',
    lastName: 'Jiménez Castro',
    title: 'Psicóloga Infantil y Adolescente',
    specializations: ['Adolescentes', 'TDAH', 'Autismo', 'Aprendizaje', 'Conducta'],
    languages: ['Español', 'Inglés'],
    experience: 8,
    sessionPrice: 55,
    sessionTypes: ['video', 'audio'],
    bio: 'Psicóloga especializada en niños y adolescentes. Trabajo con TDAH, autismo, problemas de aprendizaje y conducta. Ofrezco un espacio seguro donde los jóvenes pueden expresarse libremente.',
    approach: 'Cognitivo-Conductual y Juego Terapia',
    education: 'Licenciatura en Psicología, Universidad de Costa Rica. Especialización en Psicología Infantil.',
    avatarSeed: 'AnaJimenez',
    nextAvailable: '2026-04-11T10:00:00Z'
  },
  {
    firstName: 'Roberto',
    lastName: 'Soto Herrera',
    title: 'Psicólogo Trauma y PTSD',
    specializations: ['Trauma', 'PTSD', 'Abuso', 'Violencia', 'Crisis'],
    languages: ['Español', 'Portugués'],
    experience: 12,
    sessionPrice: 80,
    sessionTypes: ['video'],
    bio: 'Especialista en trauma y PTSD. Certificado en EMDR (Desensibilización y Reprocesamiento por Movimientos Oculares). Ayudo a personas que han experimentado situaciones traumáticas a recuperar su bienestar.',
    approach: 'EMDR y Psicodinámica',
    education: 'Doctorado en Psicología Clínica. Certificación internacional en EMDR.',
    avatarSeed: 'RobertoSoto',
    nextAvailable: '2026-04-13T11:00:00Z'
  },
  {
    firstName: 'Laura Patricia',
    lastName: 'Morales Vega',
    title: 'Psicóloga en Mindfulness y Estrés',
    specializations: ['Mindfulness', 'Burnout', 'Estrés', 'Meditación', 'Bienestar'],
    languages: ['Español', 'Inglés'],
    experience: 7,
    sessionPrice: 60,
    sessionTypes: ['video', 'audio', 'chat'],
    bio: 'Psicóloga especializada en mindfulness y manejo del estrés. Instructora certificada de mindfulness. Ayudo a profesionales con burnout y personas que buscan mayor bienestar emocional.',
    approach: 'Mindfulness-Based Stress Reduction (MBSR)',
    education: 'Licenciatura en Psicología. Certificación en MBSR, Centro de Mindfulness UMASS.',
    avatarSeed: 'LauraMorales',
    nextAvailable: '2026-04-11T16:00:00Z'
  },
  {
    firstName: 'Daniel',
    lastName: 'Campos López',
    title: 'Psicólogo en Adicciones',
    specializations: ['Adicciones', 'Alcoholismo', 'Drogas', 'Codependencia', 'Recuperación'],
    languages: ['Español'],
    experience: 14,
    sessionPrice: 70,
    sessionTypes: ['video', 'audio'],
    bio: 'Especialista en tratamiento de adicciones. Enfoque compasivo y sin juicios. Acompaño a personas en su proceso de recuperación y ayudo a familias afectadas por la codependencia.',
    approach: 'Motivacional y Cognitivo-Conductual',
    education: 'Maestría en Psicología Clínica. Especialización en Adicciones, UNED España.',
    avatarSeed: 'DanielCampos',
    nextAvailable: '2026-04-12T13:00:00Z'
  },
  {
    firstName: 'Isabela',
    lastName: 'Ruiz Fernández',
    title: 'Psicóloga LGBTQ+',
    specializations: ['LGBTQ+', 'Identidad', 'Transición', 'Orientación', 'Discriminación'],
    languages: ['Español', 'Inglés'],
    experience: 9,
    sessionPrice: 65,
    sessionTypes: ['video', 'chat'],
    bio: 'Psicóloga especializada en temáticas LGBTQ+. Espacio seguro y afirmativo. Acompaño en procesos de identidad, transición de género, y apoyo ante la discriminación. Ally certificada.',
    approach: 'Afirmativa y Cognitivo-Conductual',
    education: 'Licenciatura en Psicología. Certificación en Terapia Afirmativa LGBTQ+, WPATH.',
    avatarSeed: 'IsabelaRuiz',
    nextAvailable: '2026-04-11T09:00:00Z'
  },
  {
    firstName: 'Alejandro',
    lastName: 'Villalobos Méndez',
    title: 'Psicólogo Organizacional',
    specializations: ['Coaching', 'Liderazgo', 'Carrera', 'Burnout', 'Equipos'],
    languages: ['Español', 'Inglés'],
    experience: 11,
    sessionPrice: 85,
    sessionTypes: ['video', 'audio'],
    bio: 'Psicólogo organizacional y coach ejecutivo. Ayudo a líderes y profesionales a desarrollar su potencial, manejar el estrés laboral y alcanzar sus metas de carrera.',
    approach: 'Coaching Ontológico y Organizacional',
    education: 'Maestría en Psicología Organizacional. Certificación Internacional en Coaching.',
    avatarSeed: 'AlejandroVillalobos',
    nextAvailable: '2026-04-12T15:00:00Z'
  },
  {
    firstName: 'Fernanda',
    lastName: 'Castro Jiménez',
    title: 'Psicóloga en TCA',
    specializations: ['TCA', 'Anorexia', 'Bulimia', 'Imagen corporal', 'Alimentación'],
    languages: ['Español'],
    experience: 6,
    sessionPrice: 70,
    sessionTypes: ['video', 'audio'],
    bio: 'Especialista en Trastornos de la Conducta Alimentaria (TCA). Enfoque multidisciplinario trabajando en equipo con nutricionistas. Acompaño en la recuperación de una relación saludable con la comida.',
    approach: 'Integrativa y Cognitivo-Conductual',
    education: 'Licenciatura en Psicología. Especialización en TCA, Universidad de Barcelona.',
    avatarSeed: 'FernandaCastro',
    nextAvailable: '2026-04-14T10:00:00Z'
  },
  {
    firstName: 'Miguel',
    lastName: 'Aguilar Torres',
    title: 'Psicólogo del Sueño',
    specializations: ['Insomnio', 'Sueño', 'Cronobiología', 'Hábitos', 'Fatiga'],
    languages: ['Español', 'Inglés'],
    experience: 13,
    sessionPrice: 60,
    sessionTypes: ['video', 'audio', 'chat'],
    bio: 'Especialista en trastornos del sueño. Certificado en Terapia Cognitivo-Conductual para el Insomnio (CBT-I). Ayudo a personas con insomnio, problemas de horario y fatiga crónica.',
    approach: 'CBT-I y Higiene del Sueño',
    education: 'Doctorado en Neurociencias. Certificación CBT-I, Universidad de Pensilvania.',
    avatarSeed: 'MiguelAguilar',
    nextAvailable: '2026-04-11T20:00:00Z'
  },
  {
    firstName: 'Valentina',
    lastName: 'Navarro Silva',
    title: 'Psicóloga en Duelo',
    specializations: ['Duelo', 'Pérdida', 'Luto', 'Enfermedad terminal', 'Acompañamiento'],
    languages: ['Español'],
    experience: 16,
    sessionPrice: 68,
    sessionTypes: ['video', 'audio'],
    bio: 'Especialista en procesos de duelo y pérdida. Acompaño a personas que han perdido seres queridos, enfrentan enfermedades terminales o atraviesan procesos de despedida.',
    approach: 'Terapia del Duelo y Existencial',
    education: 'Maestría en Psicología Clínica. Especialización en Tanatología.',
    avatarSeed: 'ValentinaNavarro',
    nextAvailable: '2026-04-12T11:00:00Z'
  },
  {
    firstName: 'Sebastián',
    lastName: 'Rojas Moreno',
    title: 'Psicólogo en Sexología',
    specializations: ['Sexualidad', 'Pareja', 'Disfunciones', 'Orientación', 'Intimidad'],
    languages: ['Español', 'Portugués'],
    experience: 8,
    sessionPrice: 72,
    sessionTypes: ['video', 'audio'],
    bio: 'Psicólogo y sexólogo clínico. Abordo temas de sexualidad, disfunciones, orientación sexual y problemas de pareja. Enfoque sin juicios y basado en evidencia.',
    approach: 'Terapia Sexual Integrativa',
    education: 'Licenciatura en Psicología. Especialización en Sexología Clínica, UNAM México.',
    avatarSeed: 'SebastianRojas',
    nextAvailable: '2026-04-13T17:00:00Z'
  },
  {
    firstName: 'Camila',
    lastName: 'Duarte González',
    title: 'Psicóloga en Enfermedades Crónicas',
    specializations: ['Enfermedad crónica', 'Dolor', 'Diabetes', 'Cáncer', 'Ajuste'],
    languages: ['Español'],
    experience: 10,
    sessionPrice: 65,
    sessionTypes: ['video', 'audio'],
    bio: 'Especialista en psicología de la salud. Acompaño a personas con enfermedades crónicas (diabetes, cáncer, dolor crónico) en su ajuste emocional y calidad de vida.',
    approach: 'Psicología de la Salud y Mindfulness',
    education: 'Maestría en Psicología de la Salud. Especialización en Pacientes Oncológicos.',
    avatarSeed: 'CamilaDuarte',
    nextAvailable: '2026-04-11T14:00:00Z'
  },
  {
    firstName: 'Ricardo',
    lastName: 'Espinoza Vega',
    title: 'Psicólogo Forense',
    specializations: ['Forense', 'Violencia', 'Acoso', 'Evaluación', 'Peritaje'],
    languages: ['Español', 'Inglés'],
    experience: 18,
    sessionPrice: 90,
    sessionTypes: ['video'],
    bio: 'Psicólogo forense con experiencia en evaluaciones periciales. Especialista en violencia, acoso y casos legales. También atiendo víctimas de delitos y personas en procesos judiciales.',
    approach: 'Forense y Evaluación Psicológica',
    education: 'Doctorado en Psicología Forense. Certificación en Evaluación de Riesgo.',
    avatarSeed: 'RicardoEspinoza',
    nextAvailable: '2026-04-12T09:00:00Z'
  },
  {
    firstName: 'Paula',
    lastName: 'Cordero Ramírez',
    title: 'Psicóloga Gestalt',
    specializations: ['Gestalt', 'Consciencia plena', 'Aquí y ahora', 'Creatividad', 'Autoconocimiento'],
    languages: ['Español', 'Inglés'],
    experience: 9,
    sessionPrice: 62,
    sessionTypes: ['video', 'audio', 'chat'],
    bio: 'Psicóloga gestalt con enfoque en el "aquí y ahora". Ayudo a personas a tomar consciencia de sus patrones, conectar con su creatividad y vivir más auténticamente.',
    approach: 'Gestalt y Psicodrama',
    education: 'Licenciatura en Psicología. Formación en Gestalt, Instituto Gestalt de Santiago.',
    avatarSeed: 'PaulaCordero',
    nextAvailable: '2026-04-11T11:00:00Z'
  },
  {
    firstName: 'Hugo',
    lastName: 'Mora Delgado',
    title: 'Psicólogo Psicoanalítico',
    specializations: ['Psicoanálisis', 'Inconsciente', 'Trauma temprano', 'Personalidad', 'Depresión'],
    languages: ['Español', 'Alemán'],
    experience: 20,
    sessionPrice: 85,
    sessionTypes: ['video', 'audio'],
    bio: 'Psicoanalista con formación lacaniana. Ofrezco espacio para el análisis profundo de conflictos inconscientes, trauma temprano y estructuras de personalidad. Análisis de alta frecuencia.',
    approach: 'Psicoanálisis Lacaniano',
    education: 'Formación en Psicoanális. Miembro de la Asociación Mundial de Psicoanálisis.',
    avatarSeed: 'HugoMora',
    nextAvailable: '2026-04-13T19:00:00Z'
  },
  {
    firstName: 'Natalia',
    lastName: 'Herrera Ponce',
    title: 'Psicóloga en Neurodivergencia',
    specializations: ['TDAH', 'Autismo', 'Asperger', 'Altas capacidades', 'Evaluación neuropsicológica'],
    languages: ['Español', 'Inglés'],
    experience: 7,
    sessionPrice: 75,
    sessionTypes: ['video', 'audio'],
    bio: 'Especialista en neurodivergencia (TDAH, autismo, altas capacidades). Realizo evaluaciones neuropsicológicas y acompaño a neurodivergentes y sus familias.',
    approach: 'Neuropsicología y Cognitivo-Conductual',
    education: 'Maestría en Neuropsicología. Especialización en Espectro Autista.',
    avatarSeed: 'NataliaHerrera',
    nextAvailable: '2026-04-14T09:00:00Z'
  },
  {
    firstName: 'Francisco',
    lastName: 'Santos Morales',
    title: 'Psicólogo en Fobias y TOC',
    specializations: ['Fobias', 'TOC', 'Ansiedad', 'Rituales', 'Evitación'],
    languages: ['Español'],
    experience: 11,
    sessionPrice: 68,
    sessionTypes: ['video', 'audio', 'chat'],
    bio: 'Especialista en fobias específicas, TOC y trastornos de ansiedad. Uso técnicas de exposición graduada y ERP (Exposición y Prevención de Respuesta).',
    approach: 'TCC con Exposición y ERP',
    education: 'Maestría en Psicología Clínica. Especialización en TOC, Universidad de Austin.',
    avatarSeed: 'FranciscoSantos',
    nextAvailable: '2026-04-11T15:00:00Z'
  }
]

// ============================================
// Helper Functions
// ============================================

function generateLicenseNumber(index) {
  const year = 2015 + Math.floor(Math.random() * 9)
  const number = 1000 + index + Math.floor(Math.random() * 900)
  return `CPC-${year}-${number}`
}

function generateEmail(firstName, lastName) {
  const normalized = `${firstName.toLowerCase()}.${lastName.toLowerCase().split(' ')[0]}@cora.local`
  return normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.@]/g, '')
}

function generateAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

// ============================================
// OpenAI Embedding Generation
// ============================================

async function generateEmbedding(text) {
  if (!openaiApiKey) {
    console.warn('⚠️  OPENAI_API_KEY not set, using zero vector')
    return new Array(384).fill(0)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 384
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate embedding')
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message)
    // Return zero vector as fallback
    return new Array(384).fill(0)
  }
}

async function generateTherapistEmbedding(therapist) {
  const text = `
    ${therapist.bio}
    Enfoque: ${therapist.approach}
    Especialidades: ${therapist.specializations.join(', ')}
    Título: ${therapist.title}
    Experiencia: ${therapist.experience} años
    Modalidades: ${therapist.sessionTypes.join(', ')}
    Idiomas: ${therapist.languages.join(', ')}
  `.trim()

  return generateEmbedding(text)
}

// ============================================
// Seed Function
// ============================================

async function seedPsychologists() {
  console.log('🌱 Starting seed process...\n')

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  for (let i = 0; i < seedPsychologists.length; i++) {
    const seed = seedPsychologists[i]
    console.log(`📋 Processing: ${seed.firstName} ${seed.lastName}`)

    try {
      // Generate embedding
      console.log('   🔄 Generating embedding...')
      const embedding = await generateTherapistEmbedding(seed)

      // Insert psychologist
      console.log('   💾 Inserting into database...')
      const { data: psychologist, error: insertError } = await supabase
        .from('psychologists')
        .insert({
          email: generateEmail(seed.firstName, seed.lastName),
          first_name: seed.firstName,
          last_name: seed.lastName,
          avatar_url: generateAvatarUrl(seed.avatarSeed),
          title: seed.title,
          license_number: generateLicenseNumber(i),
          education: seed.education,
          bio: seed.bio,
          approach: seed.approach,
          specializations: seed.specializations,
          languages: seed.languages,
          session_price: seed.sessionPrice,
          currency: 'USD',
          session_types: seed.sessionTypes,
          accepting_new_patients: true,
          next_available: seed.nextAvailable,
          years_experience: seed.experience,
          rating: (4.5 + Math.random() * 0.5).toFixed(2),
          review_count: Math.floor(Math.random() * 200) + 50,
          verified: true,
          verified_at: new Date().toISOString(),
          embedding: embedding
        })
        .select('id')
        .single()

      if (insertError) {
        console.error(`   ❌ Error inserting ${seed.firstName}:`, insertError.message)
        continue
      }

      // Generate availability (random slots for each day)
      console.log('   📅 Creating availability...')
      const availabilityData = []

      for (let day = 0; day < 7; day++) {
        // Skip some days randomly
        if (Math.random() > 0.8) continue

        const slots = []
        const morningSlots = Math.floor(Math.random() * 3) // 0-3 morning slots
        const afternoonSlots = Math.floor(Math.random() * 4) // 0-4 afternoon slots
        const eveningSlots = Math.floor(Math.random() * 3) // 0-3 evening slots

        // Morning: 8:00-12:00
        for (let j = 0; j < morningSlots; j++) {
          const hour = 8 + j
          slots.push(`${hour.toString().padStart(2, '0')}:00`)
        }

        // Afternoon: 13:00-18:00
        for (let j = 0; j < afternoonSlots; j++) {
          const hour = 13 + j
          slots.push(`${hour.toString().padStart(2, '0')}:00`)
        }

        // Evening: 19:00-21:00
        for (let j = 0; j < eveningSlots; j++) {
          const hour = 19 + j
          slots.push(`${hour.toString().padStart(2, '0')}:00`)
        }

        if (slots.length > 0) {
          availabilityData.push({
            psychologist_id: psychologist.id,
            day_of_week: day,
            time_slots: slots
          })
        }
      }

      if (availabilityData.length > 0) {
        const { error: availError } = await supabase
          .from('psychologist_availability')
          .insert(availabilityData)

        if (availError) {
          console.error(`   ⚠️  Error creating availability:`, availError.message)
        }
      }

      console.log(`   ✅ Successfully created ${seed.firstName} ${seed.lastName}\n`)

    } catch (error) {
      console.error(`   ❌ Error processing ${seed.firstName}:`, error.message)
    }
  }

  console.log('✅ Seed process completed!')
  console.log(`📝 Seeded ${seedPsychologists.length} psychologists`)
}

// ============================================
// Run
// ============================================

seedPsychologists().catch(console.error)
