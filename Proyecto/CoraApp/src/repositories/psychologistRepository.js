// ============================================
// Psychologist Repository
// Data Access Layer for Supabase
// Updated to match 001_initial_schema.sql
// ============================================

import { supabase } from '../services/supabaseClient'

/**
 * @typedef {Object} PsychologistFilters
 * @property {string[]} specialties - Array of specialization names
 * @property {number} minPrice - Minimum session price
 * @property {number} maxPrice - Maximum session price
 * @property {string[]} sessionTypes - ['video', 'audio', 'chat']
 * @property {number} minRating - Minimum rating (0-5)
 * @property {string} searchQuery - Search text
 */

export const psychologistRepository = {
  /**
   * Get verified psychologists with filters
   * Uses public.verified_psychologists view
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

    let query = supabase
      .from('verified_psychologists')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.specialties?.length > 0) {
      query = query.overlaps('specialties', filters.specialties)
    }

    if (filters.sessionTypes?.length > 0) {
      query = query.overlaps('session_types', filters.sessionTypes)
    }

    if (filters.minPrice) {
      query = query.gte('hourly_rate_usd', filters.minPrice)
    }

    if (filters.maxPrice) {
      query = query.lte('hourly_rate_usd', filters.maxPrice)
    }

    if (filters.minRating) {
      query = query.gte('average_rating', filters.minRating)
    }

    // Text search on full_name or bio (using ilike since it's a view)
    if (filters.searchQuery?.trim()) {
      query = query.or(`full_name.ilike.%${filters.searchQuery}%,bio.ilike.%${filters.searchQuery}%`)
    }

    // Ordering
    const orderFields = {
      rating: 'average_rating',
      price: 'hourly_rate_usd',
      experience: 'years_experience',
      name: 'last_name'
    }
    const orderField = orderFields[orderBy] || 'average_rating'
    query = query.order(orderField, { ascending: sortOrder === 'asc' })

    const { data, error, count } = await query.range(start, end)

    if (error) throw error

    return {
      data: data.map(transformFromDB),
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }
  },

  /**
   * Get featured psychologists (top rated)
   */
  async getFeatured(limit = 4) {
    const { data, error } = await supabase
      .from('verified_psychologists')
      .select('*')
      .order('average_rating', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data.map(transformFromDB)
  },

  /**
   * Get single psychologist by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('verified_psychologists')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return transformFromDB(data)
  }
}

/**
 * Transform database record to frontend format
 */
function transformFromDB(dbRecord) {
  if (!dbRecord) return null

  return {
    id: dbRecord.id,
    firstName: dbRecord.first_name,
    lastName: dbRecord.last_name,
    fullName: dbRecord.full_name,
    avatar: dbRecord.avatar_url,
    title: dbRecord.title,
    license: dbRecord.license_number,
    licenseType: dbRecord.license_type,
    specializations: dbRecord.specialties || [],
    languages: dbRecord.languages || [],
    approach: dbRecord.approach,
    bio: dbRecord.bio,
    education: dbRecord.education,
    experience: dbRecord.years_experience,
    sessionPrice: dbRecord.hourly_rate_usd,
    currency: 'USD',
    sessionTypes: dbRecord.session_types || [],
    rating: parseFloat(dbRecord.average_rating) || 0,
    reviewCount: dbRecord.total_reviews || 0,
    totalSessions: dbRecord.total_sessions || 0,
    isAcceptingPatients: dbRecord.is_accepting_patients,
    availableHours: dbRecord.available_hours || {}
  }
}

export default psychologistRepository
