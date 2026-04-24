import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import {
  usePsychologists,
  usePsychologistSearch,
  usePsychologistFilters
} from '../hooks'

const specialties = ['Todos', 'Ansiedad', 'Depresión', 'Pareja', 'Adolescentes', 'Trauma', 'TDAH', 'Mindfulness', 'Burnout']
const sessionTypes = ['Todos', 'Video', 'Audio', 'Chat']
const priceRanges = [
  { label: 'Todos', min: null, max: null },
  { label: 'Menos de $60', min: 0, max: 60 },
  { label: '$60-$75', min: 60, max: 75 },
  { label: 'Más de $75', min: 75, max: null }
]

export default function TherapistSearch() {
  const navigate = useNavigate()
  const [selectedTherapist, setSelectedTherapist] = useState(null)
  const [searchMode, setSearchMode] = useState('traditional') // 'traditional' | 'vector'
  const [searchInput, setSearchInput] = useState('')

  // Filters hook
  const { filters, updateFilter, activeFilterCount } = usePsychologistFilters({
    orderBy: 'rating',
    sortOrder: 'desc'
  })

  // Traditional search with filters
  const {
    psychologists,
    loading,
    error,
    hasMore,
    loadMore
  } = usePsychologists(filters)

  // Vector semantic search
  const {
    results: vectorResults,
    search: performVectorSearch,
    loading: vectorLoading,
    clearSearch
  } = usePsychologistSearch({ threshold: 0.25, limit: 20 })

  // Handle search input change
  const handleSearchChange = useCallback((value) => {
    setSearchInput(value)

    if (value.trim().length > 2) {
      setSearchMode('vector')
      performVectorSearch(value)
    } else if (value.trim() === '') {
      setSearchMode('traditional')
      clearSearch()
    }
  }, [performVectorSearch, clearSearch])

  // Get current results based on search mode
  const displayResults = searchMode === 'vector' && searchInput.trim().length > 2
    ? vectorResults
    : psychologists

  const isLoading = searchMode === 'vector' ? vectorLoading : loading

  // Price filter handler
  const handlePriceChange = (priceLabel) => {
    const priceRange = priceRanges.find(p => p.label === priceLabel)
    if (priceRange) {
      updateFilter('minPrice', priceRange.min)
      updateFilter('maxPrice', priceRange.max)
    }
  }

  // Specialty filter handler
  const handleSpecialtyChange = (specialty) => {
    if (specialty === 'Todos') {
      updateFilter('specializations', [])
    } else {
      updateFilter('specializations', [specialty])
    }
  }

  // Session type filter handler
  const handleSessionTypeChange = (type) => {
    if (type === 'Todos') {
      updateFilter('sessionTypes', [])
    } else {
      updateFilter('sessionTypes', [type.toLowerCase()])
    }
  }

  // Get current price label
  const getCurrentPriceLabel = () => {
    if (filters.minPrice === null && filters.maxPrice === null) return 'Todos'
    if (filters.maxPrice === 60) return 'Menos de $60'
    if (filters.minPrice === 60 && filters.maxPrice === 75) return '$60-$75'
    if (filters.minPrice === 75) return 'Más de $75'
    return 'Todos'
  }

  // Get current specialty
  const getCurrentSpecialty = () => {
    if (!filters.specializations?.length) return 'Todos'
    return filters.specializations[0]
  }

  // Get current session type
  const getCurrentSessionType = () => {
    if (!filters.sessionTypes?.length) return 'Todos'
    return filters.sessionTypes[0].charAt(0).toUpperCase() + filters.sessionTypes[0].slice(1)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-50 to-sage-50 dark:from-teal-950 dark:to-sage-950 py-12">
        <div className="section-padding text-center">
          <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-3">
            Encontrá tu terapeuta ideal
          </h1>
          <p className="text-surface-500 mb-6 max-w-xl mx-auto">
            Psicólogos verificados disponibles con búsqueda inteligente.
            {searchMode === 'vector' && (
              <span className="text-teal-600 font-medium block mt-1">
                Usando búsqueda semántica con IA
              </span>
            )}
          </p>
          <div className="max-w-xl mx-auto">
            <Input
              placeholder="Buscar por especialidad, enfoque, o describí lo que necesitás..."
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            {searchInput.trim().length > 0 && searchInput.trim().length <= 2 && (
              <p className="text-xs text-surface-400 mt-2">
                Escribí al menos 3 caracteres para activar la búsqueda inteligente
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="section-padding py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Especialidad</p>
            <div className="flex gap-2 flex-wrap">
              {specialties.slice(0, 6).map(s => (
                <button
                  key={s}
                  onClick={() => handleSpecialtyChange(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    getCurrentSpecialty() === s
                      ? 'bg-teal-500 text-white shadow-cora'
                      : 'bg-white dark:bg-surface-900 text-surface-500 border border-surface-200 dark:border-surface-700 hover:border-teal-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="md:ml-auto flex gap-4">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Modalidad</p>
              <select
                value={getCurrentSessionType()}
                onChange={(e) => handleSessionTypeChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900"
              >
                {sessionTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Precio</p>
              <select
                value={getCurrentPriceLabel()}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900"
              >
                {priceRanges.map(p => (
                  <option key={p.label} value={p.label}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-surface-500">
            {isLoading ? 'Cargando...' : (
              <>
                {displayResults.length} {displayResults.length === 1 ? 'psicólogo encontrado' : 'psicólogos encontrados'}
                {searchMode === 'vector' && vectorResults.length > 0 && (
                  <span className="text-teal-600"> (por similitud semántica)</span>
                )}
              </>
            )}
          </p>

          {activeFilterCount > 0 && searchMode === 'traditional' && (
            <button
              onClick={() => {
                updateFilter('specializations', [])
                updateFilter('sessionTypes', [])
                updateFilter('minPrice', null)
                updateFilter('maxPrice', null)
              }}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Limpiar filtros ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && displayResults.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-5 animate-pulse">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-surface-200 dark:bg-surface-700 mx-auto mb-3"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-24 mx-auto"></div>
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-16"></div>
                  <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-16"></div>
                </div>
                <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Therapist grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayResults.map((therapist, index) => (
            <Card
              key={therapist.id || index}
              hover
              className="p-5 relative"
              onClick={() => setSelectedTherapist(therapist)}
            >
              {/* Similarity badge for vector search */}
              {searchMode === 'vector' && therapist.similarity && (
                <div className="absolute top-3 right-3 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-medium px-2 py-1 rounded-lg">
                  {Math.round(therapist.similarity * 100)}% match
                </div>
              )}

              <div className="text-center mb-4">
                {therapist.avatar ? (
                  <Avatar
                    src={therapist.avatar}
                    alt={`${therapist.firstName} ${therapist.lastName}`}
                    size="xl"
                    className="mx-auto mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-cora flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 shadow-cora">
                    {therapist.firstName?.[0]}{therapist.lastName?.[0]}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-bold text-surface-900 dark:text-white text-sm">
                    {therapist.firstName} {therapist.lastName}
                  </h3>
                  {therapist.verified && (
                    <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-surface-400 mb-2">{therapist.title}</p>
                <div className="flex items-center justify-center gap-1">
                  <StarRating rating={therapist.rating} size="xs" />
                  <span className="text-xs text-surface-500">
                    {therapist.rating?.toFixed(1)} ({therapist.reviewCount || 0})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3 justify-center">
                {therapist.specializations?.slice(0, 2).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-center mb-4">
                <span className="text-lg font-black text-surface-900 dark:text-white">
                  ${therapist.sessionPrice}
                </span>
                <span className="text-xs text-surface-400"> USD/sesión</span>
              </div>

              <div className="flex gap-1 justify-center mb-4">
                {therapist.sessionTypes?.map(type => (
                  <span key={type} className="text-xs px-2 py-1 bg-surface-50 dark:bg-surface-800 rounded-lg">
                    {type === 'video' ? '🎥' : type === 'audio' ? '📞' : '💬'}
                  </span>
                ))}
              </div>

              <Button fullWidth size="sm" variant="secondary">
                Ver perfil
              </Button>
            </Card>
          ))}
        </div>

        {/* Load more for traditional search */}
        {searchMode === 'traditional' && hasMore && (
          <div className="text-center mt-8">
            <Button
              variant="secondary"
              onClick={loadMore}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Cargando...' : 'Cargar más psicólogos'}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayResults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
              No se encontraron psicólogos
            </h3>
            <p className="text-surface-500 mb-4">
              Probá ajustando tus filtros o usando términos de búsqueda diferentes.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchInput('')
                updateFilter('specializations', [])
                updateFilter('sessionTypes', [])
                updateFilter('minPrice', null)
                updateFilter('maxPrice', null)
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Therapist detail modal */}
      <Modal
        isOpen={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        title="Perfil del psicólogo"
        size="lg"
      >
        {selectedTherapist && (
          <div className="p-6">
            <div className="flex gap-5 mb-6">
              {selectedTherapist.avatar ? (
                <Avatar
                  src={selectedTherapist.avatar}
                  alt={`${selectedTherapist.firstName} ${selectedTherapist.lastName}`}
                  size="2xl"
                  className="flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-cora flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-cora-lg">
                  {selectedTherapist.firstName?.[0]}{selectedTherapist.lastName?.[0]}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black text-surface-900 dark:text-white">
                      {selectedTherapist.firstName} {selectedTherapist.lastName}
                    </h2>
                    <p className="text-surface-500 text-sm">{selectedTherapist.title}</p>
                    <p className="text-xs text-surface-400">{selectedTherapist.education}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-600">
                      ${selectedTherapist.sessionPrice}
                    </p>
                    <p className="text-xs text-surface-400">USD/sesión</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={selectedTherapist.rating} showValue />
                  <span className="text-sm text-surface-400">
                    · {selectedTherapist.reviewCount || 0} reseñas
                    {selectedTherapist.experience && ` · ${selectedTherapist.experience} años exp.`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Especialidades
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.specializations?.map(s => (
                    <Badge key={s} color="teal">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Modalidades
                </p>
                <div className="flex gap-2 flex-wrap">
                  {selectedTherapist.sessionTypes?.map(t => (
                    <span key={t} className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      {t === 'video' ? '🎥 Video' : t === 'audio' ? '📞 Audio' : '💬 Chat'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                Sobre mí
              </p>
              <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                {selectedTherapist.bio}
              </p>
            </div>

            {selectedTherapist.approach && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                  Enfoque terapéutico
                </p>
                <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                  {selectedTherapist.approach}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setSelectedTherapist(null)}
              >
                Volver a la búsqueda
              </Button>
              <Button
                fullWidth
                onClick={() => navigate('/quiz')}
              >
                Empezar con {selectedTherapist.firstName} →
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
