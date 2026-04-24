// ============================================
// useDebounce Hook
// Delays the update of a value for a specified time
// Useful for search inputs and expensive operations
// ============================================

import { useState, useEffect, useRef } from 'react'

/**
 * Hook to debounce a value
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {*} - The debounced value
 * @example
 * const [searchQuery, setSearchQuery] = useState('')
 * const debouncedSearch = useDebounce(searchQuery, 300)
 * // use debouncedSearch for API calls
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Clear the previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook to debounce a callback function
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Function} - The debounced callback
 * @example
 * const debouncedSearch = useDebouncedCallback((query) => {
 *   fetchResults(query)
 * }, 300)
 * // debouncedSearch can be called frequently, but will only execute after delay
 */
export function useDebouncedCallback(callback, delay = 300) {
  const timeoutRef = useRef(null)
  const callbackRef = useRef(callback)

  // Keep callback reference up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return (...args) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }
}

/**
 * Hook for debounced search with cancel functionality
 * Useful for API calls that might race
 * @param {Function} searchFn - The search function to call
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Object} - { execute, cancel, isPending }
 * @example
 * const { execute, cancel, isPending } = useDebouncedSearch(async (query) => {
 *   const results = await searchAPI(query)
 *   setResults(results)
 * }, 300)
 */
export function useDebouncedSearch(searchFn, delay = 300) {
  const [isPending, setIsPending] = useState(false)
  const timeoutRef = useRef(null)
  const abortControllerRef = useRef(null)
  const searchFnRef = useRef(searchFn)

  useEffect(() => {
    searchFnRef.current = searchFn
  }, [searchFn])

  const execute = (...args) => {
    // Cancel any pending search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setIsPending(true)

    // Create new abort controller for this search
    abortControllerRef.current = new AbortController()

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await searchFnRef.current(...args, abortControllerRef.current.signal)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error)
        }
      } finally {
        setIsPending(false)
      }
    }, delay)
  }

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsPending(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => cancel()
  }, [])

  return { execute, cancel, isPending }
}

export default useDebounce
