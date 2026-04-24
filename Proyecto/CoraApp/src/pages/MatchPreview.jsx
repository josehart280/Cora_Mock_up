import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { usePsychologistMatching } from '../hooks'

export default function MatchPreview() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [currentIdx, setCurrentIdx] = useState(0)

  // Get quiz answers from navigation state
  const quizAnswers = state?.quizAnswers

  // Use vector matching hook
  const {
    matches,
    findMatches,
    loading,
    error
  } = usePsychologistMatching()

  // Find matches when component mounts with quiz answers
  useEffect(() => {
    if (quizAnswers) {
      findMatches(quizAnswers, { limit: 5, minSimilarity: 0.2 })
    } else {
      // Fallback: get featured psychologists if no quiz data
      findMatches({}, { limit: 5 })
    }
  }, [quizAnswers, findMatches])

  const currentMatch = matches[currentIdx]
  const hasMoreMatches = matches.length > 1

  const changeTherapist = () => {
    setCurrentIdx(i => (i + 1) % matches.length)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎯 Analizando tu perfil...
            </div>
            <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-4">
              Buscando tu terapeuta ideal
            </h1>
            <p className="text-surface-500 mb-8">
              Usando IA para encontrar la mejor coincidencia según tus necesidades...
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-surface-900 dark:text-white mb-2">
              Algo salió mal
            </h1>
            <p className="text-surface-500 mb-6">{error}</p>
            <Button onClick={() => navigate('/quiz')}>Volver al cuestionario</Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
          </div>
          <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-black text-surface-900 dark:text-white mb-2">
              No encontramos coincidencias
            </h1>
            <p className="text-surface-500 mb-6">
              No pudimos encontrar terapeutas que coincidan con tus criterios.
              Probá con diferentes preferencias.
            </p>
            <Button onClick={() => navigate('/quiz')}>Modificar preferencias</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl animate-scale-in">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎯 Tu match personalizado
              {currentMatch.matchPercentage && (
                <span className="bg-teal-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {currentMatch.matchPercentage}% match
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">
              ¡Encontramos tu terapeuta!
            </h1>
            <p className="text-surface-500">
              Basado en {quizAnswers ? 'tus respuestas y análisis de IA' : 'nuestros mejores profesionales'}
            </p>
          </div>

          {/* Therapist card */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="w-28 h-28 rounded-3xl bg-gradient-cora flex items-center justify-center text-4xl font-black text-white mx-auto md:mx-0 shadow-cora-lg mb-3">
                  {currentMatch.firstName?.[0]}{currentMatch.lastName?.[0]}
                </div>
                <Badge color="teal" className="mx-auto md:mx-0">✓ Verificado</Badge>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-surface-900 dark:text-white">
                      {currentMatch.firstName} {currentMatch.lastName}
                    </h2>
                    <p className="text-surface-500">{currentMatch.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-600">${currentMatch.sessionPrice}</p>
                    <p className="text-xs text-surface-400">USD / sesión</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={currentMatch.rating} showValue />
                  <span className="text-sm text-surface-400">
                    · {currentMatch.reviewCount || 0} reseñas
                    {currentMatch.experience && ` · ${currentMatch.experience} años exp.`}
                  </span>
                </div>

                <p className="text-surface-600 dark:text-surface-400 text-sm mt-4 leading-relaxed line-clamp-3">
                  {currentMatch.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {currentMatch.specializations?.slice(0, 4).map(s => (
                    <span key={s} className="text-xs px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">
                      {currentMatch.rating?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-xs text-surface-400">Rating</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">
                      {currentMatch.experience || '-'}
                    </p>
                    <p className="text-xs text-surface-400">Años exp.</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">
                      {currentMatch.reviewCount || 0}
                    </p>
                    <p className="text-xs text-surface-400">Reseñas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session types */}
            <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
              <p className="text-sm font-medium text-surface-500 mb-3">Modalidades disponibles:</p>
              <div className="flex gap-2 flex-wrap">
                {currentMatch.sessionTypes?.map(t => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium">
                    {t === 'video' && '🎥 Video'}
                    {t === 'audio' && '📞 Audio'}
                    {t === 'chat' && '💬 Chat'}
                  </span>
                ))}
              </div>
            </div>

            {/* Why this match - show if we have similarity data */}
            {currentMatch.similarity && (
              <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
                <p className="text-sm font-medium text-surface-500 mb-2">¿Por qué este match?</p>
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span className="font-medium text-teal-700 dark:text-teal-300">
                      Similitud semántica: {Math.round(currentMatch.similarity * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    El enfoque terapéutico y especialidades de {currentMatch.firstName} se alinean con tus necesidades.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button fullWidth size="lg" onClick={() => navigate('/planes', { state: { therapist: currentMatch } })}>
              Elegir un plan con {currentMatch.firstName} →
            </Button>
            {hasMoreMatches && (
              <button
                onClick={changeTherapist}
                className="w-full py-3 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ver otro match ({matches.length - 1} más)
              </button>
            )}
          </div>

          <p className="text-center text-xs text-surface-400 mt-4">
            Podés cambiar de terapeuta en cualquier momento, gratis, sin límite de veces.
          </p>
        </div>
      </div>
    </div>
  )
}
