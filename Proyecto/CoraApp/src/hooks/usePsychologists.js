// ============================================
// usePsychologists Hooks
// Hooks for fetching and searching psychologists
// Supports traditional filtering, vector search, and infinite scroll
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react'
import { psychologistRepository } from '../repositories/psychologistRepository'
import { generateSearchEmbedding, generatePatientEmbedding, calculateSimilarity } from '../services/embeddingService'
import { useDebounce } from './useDebounce'

// ============================================
// usePsychologists - Browse/search with pagination
// ============================================

/**
 * Hook for browsing psychologists with filters and pagination
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Psychologists data, loading states, pagination controls
 * @example
 * const { psychologists, loading, error, filters, setFilters, pagination } = usePsychologists()
 */
export function usePsychologists(initialFilters = {}) {
  const [psychologists, setPsychologists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalCount: 0
  })
  const [hasMore, setHasMore] = useState(true)

  // Debounce filter changes to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300)

  // Fetch psychologists when filters or page changes
  const fetchPsychologists = useCallback(async (page = 1, append = false) => {
    setLoading(true)
    setError(null)

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase no configurado. No se pueden cargar psicólogos.')
      setLoading(false)
      setPsychologists([])
      return
    }

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout al conectar con Supabase')), 15000)
      )

      const dataPromise = psychologistRepository.getWithFilters(
        debouncedFilters,
        { page, limit: pagination.limit },
        debouncedFilters.orderBy || 'rating',
        debouncedFilters.sortOrder || 'desc'
      )

      const result = await Promise.race([dataPromise, timeoutPromise])

      if (append && page > 1) {
        setPsychologists(prev => [...prev, ...result.data])
      } else {
        setPsychologists(result.data)
      }

      setPagination({
        page: result.currentPage,
        limit: pagination.limit,
        totalPages: result.totalPages,
        totalCount: result.count
      })

      setHasMore(page < result.totalPages)
    } catch (err) {
      setError(err.message || 'Error al cargar psicólogos')
      console.error('Error fetching psychologists:', err)
      setPsychologists([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [debouncedFilters, pagination.limit])

  // Initial fetch and when filters change
  useEffect(() => {
    fetchPsychologists(1, false)
  }, [debouncedFilters])

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPsychologists(pagination.page + 1, true)
    }
  }, [loading, hasMore, pagination.page, fetchPsychologists])

  // Refetch function
  const refetch = useCallback(() => {
    fetchPsychologists(1, false)
  }, [fetchPsychologists])

  // Update single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [initialFilters])

  return {
    psychologists,
    loading,
    error,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    pagination,
    hasMore,
    loadMore,
    refetch
  }
}

// ============================================
// usePsychologistSearch - Vector-based search
// ============================================

/**
 * Hook for semantic search using vector embeddings
 * @param {Object} options - Search options
 * @returns {Object} - Search results and controls
 * @example
 * const { results, search, loading, error } = usePsychologistSearch()
 * search('ansiedad y depresión')
 */
export function usePsychologistSearch(options = {}) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const { threshold = 0.3, limit = 20 } = options

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 500)

  // Perform vector search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase no configurado. Búsqueda no disponible.')
        setLoading(false)
        setResults([])
        return
      }

      try {
        // Add timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout en búsqueda')), 15000)
        )

        // Generate embedding for the search query
        const embedding = await Promise.race([
          generateSearchEmbedding(debouncedQuery),
          timeoutPromise
        ])

        // Check if we got a valid embedding (not all zeros)
        const isValidEmbedding = embedding.some(v => v !== 0)

        if (!isValidEmbedding) {
          // Fall back to text search if embedding generation failed
          const fallbackPromise = psychologistRepository.getWithFilters(
            { searchQuery: debouncedQuery },
            { page: 1, limit },
            'rating',
            'desc'
          )
          const fallback = await Promise.race([fallbackPromise, timeoutPromise])
          setResults(fallback.data.map(p => ({ ...p, similarity: null })))
          return
        }

        // Perform vector search
        const searchPromise = psychologistRepository.searchByVector(
          embedding,
          {},
          { threshold, limit }
        )
        const searchResults = await Promise.race([searchPromise, timeoutPromise])

        setResults(searchResults)
      } catch (err) {
        setError(err.message || 'Error en la búsqueda')
        console.error('Search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, threshold, limit])

  const search = useCallback((searchQuery) => {
    setQuery(searchQuery)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
  }, [])

  return {
    results,
    query,
    setQuery,
    search,
    clearSearch,
    loading,
    error
  }
}

// ============================================
// usePsychologistMatching - AI matching with quiz
// ============================================

/**
 * Hook for AI-powered therapist matching based on patient quiz
 * @returns {Object} - Matching results and controls
 * @example
 * const { matches, findMatches, loading } = usePsychologistMatching()
 * findMatches(quizAnswers) // Returns top matches based on compatibility
 */
export function usePsychologistMatching() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState(null)

  // Find matches based on quiz answers
  const findMatches = useCallback(async (answers, options = {}) => {
    if (!answers) return

    setLoading(true)
    setError(null)
    setQuizAnswers(answers)

    const { limit = 10, minSimilarity = 0.25 } = options

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase no configurado. Matching no disponible.')
      setLoading(false)
      setMatches([])
      return
    }

    try {
      // Add timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout en matching')), 20000)
      )

      // Generate embedding from quiz answers
      const patientEmbedding = await Promise.race([
        generatePatientEmbedding(answers),
        timeoutPromise
      ])

      // Check if embedding is valid
      const isValidEmbedding = patientEmbedding.some(v => v !== 0)

      if (!isValidEmbedding) {
        // Fall back to traditional filtering
        const fallbackPromise = psychologistRepository.getWithFilters(
          {
            specializations: answers.concerns || [],
            sessionTypes: answers.sessionFormat || []
          },
          { page: 1, limit },
          'rating',
          'desc'
        )
        const fallback = await Promise.race([fallbackPromise, timeoutPromise])
        setMatches(fallback.data.map(p => ({ ...p, similarity: null })))
        return
      }

      // Build filters from quiz preferences
      const filters = {
        specializations: answers.concerns || null,
        sessionTypes: answers.sessionFormat || null,
        minPrice: answers.budget === 'economic' ? 0 :
                 answers.budget === 'standard' ? 50 :
                 answers.budget === 'premium' ? 80 : null,
        maxPrice: answers.budget === 'economic' ? 60 :
                 answers.budget === 'standard' ? 85 :
                 answers.budget === 'premium' ? 150 : null,
        acceptingNewPatients: true
      }

      // Perform vector search
      const searchPromise = psychologistRepository.searchByVector(
        patientEmbedding,
        filters,
        { threshold: minSimilarity, limit }
      )
      const searchResults = await Promise.race([searchPromise, timeoutPromise])

      // Calculate additional match score based on non-semantic factors
      const enhancedMatches = searchResults.map(therapist => {
        let bonusScore = 0

        // Language match
        if (answers.language && therapist.languages?.includes(answers.language)) {
          bonusScore += 0.05
        }

        // Gender preference match
        if (answers.therapistGender && answers.therapistGender !== 'no_preference') {
          // This would require gender field in DB
          // For now, we note it as a preference indicator
        }

        // Experience preference
        if (answers.experiencePreference) {
          const years = therapist.experience || 0
          if (answers.experiencePreference === 'senior' && years >= 10) {
            bonusScore += 0.03
          } else if (answers.experiencePreference === 'mid' && years >= 5 && years < 10) {
            bonusScore += 0.03
          } else if (answers.experiencePreference === 'junior' && years < 5) {
            bonusScore += 0.03
          }
        }

        // Combined score (70% vector similarity, 30% preference bonus)
        const combinedScore = (therapist.similarity * 0.7) + (bonusScore * 0.3)

        return {
          ...therapist,
          matchScore: combinedScore,
          matchPercentage: Math.round(combinedScore * 100)
        }
      })

      // Sort by combined score
      enhancedMatches.sort((a, b) => b.matchScore - a.matchScore)

      setMatches(enhancedMatches)
    } catch (err) {
      setError(err.message || 'Error al encontrar coincidencias')
      console.error('Matching error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMatches = useCallback(() => {
    setMatches([])
    setQuizAnswers(null)
    setError(null)
  }, [])

  return {
    matches,
    quizAnswers,
    findMatches,
    clearMatches,
    loading,
    error
  }
}

// ============================================
// usePsychologistDetails - Single psychologist
// ============================================

/**
 * Hook for fetching a single psychologist's details
 * @param {string} id - Psychologist ID
 * @returns {Object} - Psychologist data and loading state
 * @example
 * const { psychologist, loading, error } = usePsychologistDetails('123-abc')
 */
export function usePsychologistDetails(id) {
  const [psychologist, setPsychologist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchPsychologist = async () => {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase no configurado. No se puede cargar el psicólogo.')
        setLoading(false)
        return
      }

      try {
        // Add timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout al cargar psicólogo')), 10000)
        )

        const dataPromise = psychologistRepository.getById(id, true)
        const data = await Promise.race([dataPromise, timeoutPromise])

        setPsychologist(data)
      } catch (err) {
        setError(err.message || 'Error al cargar psicólogo')
        console.error('Error fetching psychologist:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPsychologist()
  }, [id])

  const refetch = useCallback(async () => {
    if (!id) return

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase no configurado.')
      return
    }

    setLoading(true)
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      )
      const dataPromise = psychologistRepository.getById(id, true)
      const data = await Promise.race([dataPromise, timeoutPromise])
      setPsychologist(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  return {
    psychologist,
    loading,
    error,
    refetch
  }
}

// ============================================
// useFeaturedPsychologists - Homepage featured
// ============================================

/**
 * Hook for fetching featured/top-rated psychologists
 * @param {number} limit - Number of psychologists to fetch
 * @returns {Object} - Featured psychologists data
 * @example
 * const { psychologists, loading } = useFeaturedPsychologists(4)
 */
export function useFeaturedPsychologists(limit = 4) {
  const [psychologists, setPsychologists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.warn('⚠️ Supabase no configurado. Usando datos de fallback.')
        setLoading(false)
        setPsychologists([])
        return
      }

      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout al conectar con Supabase')), 10000)
        )

        const dataPromise = psychologistRepository.getFeatured(limit)
        const data = await Promise.race([dataPromise, timeoutPromise])

        setPsychologists(data || [])
      } catch (err) {
        console.error('Error fetching featured:', err)
        setError(err.message || 'Error al cargar psicólogos destacados')
        setPsychologists([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [limit])

  return {
    psychologists,
    loading,
    error
  }
}

// ============================================
// useInfinitePsychologists - Infinite scroll
// ============================================

/**
 * Hook for infinite scroll loading of psychologists
 * Uses Intersection Observer for efficient scroll detection
 * @param {Object} filters - Filter options
 * @returns {Object} - Psychologists list with infinite scroll controls
 * @example
 * const { psychologists, loading, hasMore, observerRef } = useInfinitePsychologists()
 * // Attach observerRef to a sentinel element at bottom of list
 */
export function useInfinitePsychologists(filters = {}) {
  const [psychologists, setPsychologists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const observerRef = useRef(null)
  const intersectionObserver = useRef(null)

  const limit = 12

  // Fetch psychologists
  const fetchPsychologists = useCallback(async (pageNum, append = false) => {
    if (pageNum === 1) {
      setLoading(true)
    } else {
      setIsLoadingMore(true)
    }
    setError(null)

    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase no configurado. Infinite scroll no disponible.')
      setLoading(false)
      setIsLoadingMore(false)
      setHasMore(false)
      return
    }

    try {
      // Add timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout al cargar psicólogos')), 15000)
      )

      const dataPromise = psychologistRepository.getWithFilters(
        filters,
        { page: pageNum, limit },
        filters.orderBy || 'rating',
        filters.sortOrder || 'desc'
      )

      const result = await Promise.race([dataPromise, timeoutPromise])

      if (append) {
        setPsychologists(prev => [...prev, ...result.data])
      } else {
        setPsychologists(result.data)
      }

      setHasMore(pageNum < result.totalPages)
      setPage(pageNum)
    } catch (err) {
      setError(err.message || 'Error al cargar psicólogos')
      setHasMore(false)
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [filters, limit])

  // Initial fetch
  useEffect(() => {
    fetchPsychologists(1, false)
  }, [filters])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect()
    }

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchPsychologists(page + 1, true)
        }
      },
      {
        rootMargin: '100px', // Load slightly before reaching the end
        threshold: 0.1
      }
    )

    if (observerRef.current) {
      intersectionObserver.current.observe(observerRef.current)
    }

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, page, fetchPsychologists])

  return {
    psychologists,
    loading,
    isLoadingMore,
    error,
    hasMore,
    observerRef,
    refetch: () => fetchPsychologists(1, false)
  }
}

// ============================================
// usePsychologistFilters - Filter state management
// ============================================

/**
 * Hook for managing psychologist filter state
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Filter state and controls
 * @example
 * const { filters, updateFilter, clearFilters, activeFilterCount } = usePsychologistFilters()
 */
export function usePsychologistFilters(initialFilters = {}) {
  const defaultFilters = {
    specializations: [],
    sessionTypes: [],
    languages: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    searchQuery: '',
    acceptingNewPatients: true,
    orderBy: 'rating',
    sortOrder: 'desc',
    ...initialFilters
  }

  const [filters, setFilters] = useState(defaultFilters)

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [defaultFilters])

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'orderBy' || key === 'sortOrder') return count
    if (Array.isArray(value) && value.length > 0) return count + 1
    if (value !== null && value !== '' && value !== true && value !== defaultFilters[key]) {
      return count + 1
    }
    return count
  }, 0)

  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    setFilters,
    updateFilter,
    updateFilters,
    clearFilters,
    activeFilterCount,
    hasActiveFilters
  }
}

export default {
  usePsychologists,
  usePsychologistSearch,
  usePsychologistMatching,
  usePsychologistDetails,
  useFeaturedPsychologists,
  useInfinitePsychologists,
  usePsychologistFilters
}
