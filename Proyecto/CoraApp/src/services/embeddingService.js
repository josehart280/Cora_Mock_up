// ============================================
// Embedding Service
// Generates vector embeddings using OpenAI API
// Uses text-embedding-3-small for cost efficiency
// ============================================

const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings'

/**
 * Generate embedding for text using OpenAI API
 * Uses text-embedding-3-small (384 dimensions) for cost efficiency
 * @param {string} text - Text to embed
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<number[]>} - 384-dimensional embedding array
 */
export async function generateEmbedding(text, signal) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('⚠️ VITE_OPENAI_API_KEY not set, returning zero vector')
    return new Array(384).fill(0)
  }

  if (!text || text.trim().length === 0) {
    console.warn('⚠️ Empty text provided, returning zero vector')
    return new Array(384).fill(0)
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.trim(),
        dimensions: 384
      }),
      signal
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.data?.[0]?.embedding) {
      throw new Error('Invalid response format from OpenAI')
    }

    return data.data[0].embedding
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error // Re-throw abort errors
    }
    console.error('❌ Failed to generate embedding:', error.message)
    // Return zero vector as fallback
    return new Array(384).fill(0)
  }
}

/**
 * Generate embedding from patient quiz answers for matching
 * @param {Object} quizAnswers - Answers from the matching quiz
 * @returns {Promise<number[]>}
 */
export async function generatePatientEmbedding(quizAnswers) {
  if (!quizAnswers) {
    console.warn('⚠️ No quiz answers provided')
    return new Array(384).fill(0)
  }

  // Build a comprehensive text from quiz answers
  const parts = []

  // Therapy type preferences
  if (quizAnswers.therapyType) {
    parts.push(`Busco terapia para: ${quizAnswers.therapyType}`)
  }

  // Specific concerns/issues
  if (quizAnswers.concerns?.length > 0) {
    parts.push(`Preocupaciones: ${quizAnswers.concerns.join(', ')}`)
  }

  // Goals
  if (quizAnswers.goals?.length > 0) {
    parts.push(`Objetivos: ${quizAnswers.goals.join(', ')}`)
  }

  // Preferred session format
  if (quizAnswers.sessionFormat?.length > 0) {
    parts.push(`Preferencia de sesiones: ${quizAnswers.sessionFormat.join(', ')}`)
  }

  // Schedule preferences
  if (quizAnswers.schedule?.length > 0) {
    parts.push(`Disponibilidad: ${quizAnswers.schedule.join(', ')}`)
  }

  // Therapist gender preference
  if (quizAnswers.therapistGender) {
    parts.push(`Preferencia de género del terapeuta: ${quizAnswers.therapistGender}`)
  }

  // Approach preference
  if (quizAnswers.approachPreference) {
    parts.push(`Enfoque preferido: ${quizAnswers.approachPreference}`)
  }

  // Experience level preference
  if (quizAnswers.experiencePreference) {
    parts.push(`Preferencia de experiencia: ${quizAnswers.experiencePreference}`)
  }

  // Budget
  if (quizAnswers.budget) {
    parts.push(`Presupuesto: ${quizAnswers.budget}`)
  }

  // Language preference
  if (quizAnswers.language) {
    parts.push(`Idioma preferido: ${quizAnswers.language}`)
  }

  // Additional notes
  if (quizAnswers.additionalNotes?.trim()) {
    parts.push(`Notas adicionales: ${quizAnswers.additionalNotes.trim()}`)
  }

  const text = parts.join('. ')

  if (parts.length === 0) {
    console.warn('⚠️ No meaningful quiz answers to embed')
    return new Array(384).fill(0)
  }

  return generateEmbedding(text)
}

/**
 * Generate embedding for therapist profile
 * @param {Object} therapist - Therapist profile
 * @returns {Promise<number[]>}
 */
export async function generateTherapistEmbedding(therapist) {
  if (!therapist) {
    console.warn('⚠️ No therapist provided')
    return new Array(384).fill(0)
  }

  const parts = []

  // Bio
  if (therapist.bio?.trim()) {
    parts.push(therapist.bio.trim())
  }

  // Approach
  if (therapist.approach?.trim()) {
    parts.push(`Enfoque terapéutico: ${therapist.approach.trim()}`)
  }

  // Specializations
  if (therapist.specializations?.length > 0) {
    parts.push(`Especialidades: ${therapist.specializations.join(', ')}`)
  }

  // Title
  if (therapist.title?.trim()) {
    parts.push(`Título: ${therapist.title.trim()}`)
  }

  // Experience
  if (therapist.years_experience || therapist.experience) {
    const years = therapist.years_experience || therapist.experience
    parts.push(`Experiencia: ${years} años`)
  }

  // Session types
  if (therapist.session_types?.length > 0 || therapist.sessionTypes?.length > 0) {
    const types = therapist.session_types || therapist.sessionTypes
    parts.push(`Modalidades: ${types.join(', ')}`)
  }

  // Languages
  if (therapist.languages?.length > 0) {
    parts.push(`Idiomas: ${therapist.languages.join(', ')}`)
  }

  // Education
  if (therapist.education?.trim()) {
    parts.push(`Formación: ${therapist.education.trim()}`)
  }

  const text = parts.join('. ')

  if (parts.length === 0) {
    console.warn('⚠️ No meaningful therapist data to embed')
    return new Array(384).fill(0)
  }

  return generateEmbedding(text)
}

/**
 * Generate embedding for search query
 * @param {string} query
 * @returns {Promise<number[]>}
 */
export async function generateSearchEmbedding(query) {
  if (!query?.trim()) {
    return new Array(384).fill(0)
  }

  // Enhance the search query with context
  const enhancedQuery = `Busco psicólogo especializado en: ${query.trim()}`
  return generateEmbedding(enhancedQuery)
}

/**
 * Calculate cosine similarity between two embeddings
 * @param {number[]} embeddingA
 * @param {number[]} embeddingB
 * @returns {number} - Similarity score between 0 and 1
 */
export function calculateSimilarity(embeddingA, embeddingB) {
  if (!embeddingA || !embeddingB || embeddingA.length !== embeddingB.length) {
    return 0
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i]
    normA += embeddingA[i] * embeddingA[i]
    normB += embeddingB[i] * embeddingB[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Batch generate embeddings for multiple texts
 * @param {string[]} texts
 * @param {Object} options
 * @param {number} options.batchSize
 * @param {number} options.delay
 * @returns {Promise<number[][]>}
 */
export async function batchGenerateEmbeddings(texts, options = {}) {
  const { batchSize = 5, delay = 1000 } = options
  const results = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const batchPromises = batch.map(text => generateEmbedding(text))

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Rate limiting - wait between batches
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return results
}

export default {
  generateEmbedding,
  generatePatientEmbedding,
  generateTherapistEmbedding,
  generateSearchEmbedding,
  calculateSimilarity,
  batchGenerateEmbeddings
}
