// ============================================
// Psychologist Repository
// Data Access Layer for Supabase
// Supports both traditional filtering and vector search
// ============================================

import { supabase } from '../services/supabaseClient'

/**
 * @typedef {Object} PsychologistFilters
 * @property {string[]} specializations - Array of specialization names
 * @property {number} minPrice - Minimum session price
 * @property {number} maxPrice - Maximum session price
 * @property {string[]} sessionTypes - ['video', 'audio', 'chat']
 * @property {number} minRating - Minimum rating (0-5)
 * @property {string} searchQuery - Full-text search query
 * @property {boolean} acceptingNewPatients
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Page number (1-based)
 * @property {number} limit - Items per page
 */

/**
 * @typedef {Object} Psychologist
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 * @property {string} avatar
 * @property {string} title
 * @property {string} license
 * @property {string} education
 * @property {string} bio
 * @property {string} approach
 * @property {string[]} specializations
 * @property {string[]} languages
 * @property {number} sessionPrice
 * @property {string} currency
 * @property {string[]} sessionTypes
 * @property {boolean} acceptingNewPatients
 * @property {string} nextAvailable
 * @property {number} experience
 * @property {number} rating
 * @property {number} reviewCount
 * @property {boolean} verified
 */

export const psychologistRepository = {
  /**
   * Get psychologists with traditional filters (no vector search)
   * Uses pagination and supports multiple filter criteria
   * @param {PsychologistFilters} filters
   * @param {PaginationParams} pagination
   * @param {string} orderBy - 'rating' | 'price' | 'experience'
   * @param {string} sortOrder - 'asc' | 'desc'
   * @returns {Promise<{data: Psychologist[], count: number, totalPages: number, currentPage: number}>}
   */
  async getWithFilters(
    filters = {},
    pagination = { page: 1, limit: 12 },
    orderBy = 'rating',
    sortOrder = 'desc'
  ) {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit - 1

    // Build query
    let query = supabase
      .from('psychologists')
      .select('*', { count: 'exact' })
      .eq('verified', true)
      .eq('accepting_new_patients', true)

    // Apply filters
    if (filters.specializations?.length > 0) {
      query = query.overlaps('specializations', filters.specializations)
    }

    if (filters.sessionTypes?.length > 0) {
      query = query.overlaps('session_types', filters.sessionTypes)
    }

    if (filters.languages?.length > 0) {
      query = query.overlaps('languages', filters.languages)
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      query = query.gte('session_price', filters.minPrice)
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      query = query.lte('session_price', filters.maxPrice)
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating)
    }

    // Text search (full-text search vector)
    if (filters.searchQuery?.trim()) {
      query = query.textSearch('search_vector', filters.searchQuery.trim(), {
        type: 'websearch',
        config: 'spanish'
      })
    }

    // Apply ordering
    const orderFields = {
      rating: 'rating',
      price: 'session_price',
      experience: 'years_experience',
      name: 'last_name'
    }

    const orderField = orderFields[orderBy] || 'rating'
    query = query.order(orderField, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const { data, error, count } = await query.range(start, end)

    if (error) {
      throw new Error(`Failed to fetch psychologists: ${error.message}`)
    }

    return {
      data: data.map(transformFromDB),
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  },

  /**
   * Search psychologists by vector similarity
   * Uses the RPC function for efficient HNSW-based search
   * @param {number[]} queryEmbedding - 384-dimensional embedding array
   * @param {PsychologistFilters} filters - Additional filters
   * @param {Object} options
   * @param {number} options.threshold - Minimum similarity (0-1)
   * @param {number} options.limit - Max results
   * @returns {Promise<Psychologist[]>}
   */
  async searchByVector(queryEmbedding, filters = {}, options = {}) {
    const {
      threshold = 0.3,
      limit = 20
    } = options

    // Call the RPC function
    const { data, error } = await supabase.rpc('search_psychologists', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      filter_specializations: filters.specializations || null,
      min_price: filters.minPrice || null,
      max_price: filters.maxPrice || null,
      filter_session_types: filters.sessionTypes || null,
      filter_accepting: filters.acceptingNewPatients !== false
    })

    if (error) {
      throw new Error(`Vector search failed: ${error.message}`)
    }

    return data.map(row => ({
      ...transformFromDB(row),
      similarity: row.similarity
    }))
  },

  /**
   * Hybrid search combining vector similarity and full-text search
   * @param {number[]} queryEmbedding
   * @param {string} searchText
   * @param {number} limit
   * @returns {Promise<Psychologist[]>}
   */
  async hybridSearch(queryEmbedding, searchText, limit = 20) {
    const { data, error } = await supabase.rpc('hybrid_search_psychologists', {
      query_embedding: queryEmbedding,
      query_text: searchText,
      match_count: limit
    })

    if (error) {
      throw new Error(`Hybrid search failed: ${error.message}`)
    }

    return data.map(row => ({
      ...transformFromDB(row),
      similarity: row.similarity,
      textRank: row.text_rank,
      combinedScore: row.combined_score
    }))
  },

  /**
   * Get a single psychologist by ID
   * @param {string} id
   * @param {boolean} includeAvailability - Whether to fetch availability
   * @returns {Promise<Psychologist>}
   */
  async getById(id, includeAvailability = true) {
    let query = supabase
      .from('psychologists')
      .select('*')
      .eq('id', id)
      .single()

    const { data, error } = await query

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Psychologist not found')
      }
      throw new Error(`Failed to fetch psychologist: ${error.message}`)
    }

    const psychologist = transformFromDB(data)

    // Fetch availability if requested
    if (includeAvailability) {
      const availability = await this.getAvailability(id)
      psychologist.availability = availability
    }

    return psychologist
  },

  /**
   * Get availability schedule for a psychologist
   * @param {string} psychologistId
   * @returns {Promise<Object>} - { monday: ['09:00', '10:00'], ... }
   */
  async getAvailability(psychologistId) {
    const { data, error } = await supabase
      .from('psychologist_availability')
      .select('*')
      .eq('psychologist_id', psychologistId)
      .order('day_of_week')

    if (error) {
      throw new Error(`Failed to fetch availability: ${error.message}`)
    }

    return transformAvailability(data)
  },

  /**
   * Get featured/top-rated psychologists
   * @param {number} limit
   * @returns {Promise<Psychologist[]>}
   */
  async getFeatured(limit = 4) {
    const { data, error } = await supabase
      .from('psychologists')
      .select('*')
      .eq('verified', true)
      .eq('accepting_new_patients', true)
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch featured psychologists: ${error.message}`)
    }

    return data.map(transformFromDB)
  },

  /**
   * Get all available specializations
   * @returns {Promise<string[]>}
   */
  async getSpecializations() {
    const { data, error } = await supabase
      .from('psychologists')
      .select('specializations')
      .eq('verified', true)

    if (error) {
      throw new Error(`Failed to fetch specializations: ${error.message}`)
    }

    // Extract unique specializations
    const allSpecializations = data.flatMap(p => p.specializations)
    return [...new Set(allSpecializations)].sort()
  },

  /**
   * Get statistics about psychologists
   * @returns {Promise<Object>}
   */
  async getStats() {
    const { data, error } = await supabase
      .from('psychologists')
      .select('*', { count: 'exact', head: true })
      .eq('verified', true)

    if (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`)
    }

    // Get price range
    const { data: priceData } = await supabase
      .from('psychologists')
      .select('session_price')
      .eq('verified', true)

    const prices = priceData?.map(p => p.session_price) || []
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

    return {
      totalCount: data?.length || 0,
      minPrice,
      maxPrice
    }
  }
}

// ============================================
// Transform Functions
// ============================================

/**
 * Transform database record to frontend format
 * @param {Object} dbRecord
 * @returns {Psychologist}
 */
function transformFromDB(dbRecord) {
  if (!dbRecord) return null

  return {
    id: dbRecord.id,
    email: dbRecord.email,
    firstName: dbRecord.first_name,
    lastName: dbRecord.last_name,
    fullName: `${dbRecord.first_name} ${dbRecord.last_name}`,
    avatar: dbRecord.avatar_url,
    title: dbRecord.title,
    license: dbRecord.license_number,
    education: dbRecord.education,
    bio: dbRecord.bio,
    approach: dbRecord.approach,
    specializations: dbRecord.specializations || [],
    languages: dbRecord.languages || [],
    sessionPrice: dbRecord.session_price,
    currency: dbRecord.currency,
    sessionTypes: dbRecord.session_types || [],
    acceptingNewPatients: dbRecord.accepting_new_patients,
    nextAvailable: dbRecord.next_available,
    experience: dbRecord.years_experience,
    rating: parseFloat(dbRecord.rating) || 0,
    reviewCount: dbRecord.review_count || 0,
    verified: dbRecord.verified,
    // Optional fields from vector search
    similarity: dbRecord.similarity,
    textRank: dbRecord.text_rank,
    combinedScore: dbRecord.combined_score
  }
}

/**
 * Transform availability records to object format
 * @param {Array} dbRecords
 * @returns {Object}
 */
function transformAvailability(dbRecords) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const availability = {}

  days.forEach((day, index) => {
    const record = dbRecords.find(r => r.day_of_week === index)
    availability[day] = record ? record.time_slots : []
  })

  return availability
}

export default psychologistRepository
