import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { mockTherapists } from '../services/mockData'

export default function MatchPreview() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [therapistIdx, setTherapistIdx] = useState(0)

  const therapist = mockTherapists[therapistIdx]

  const changeTherapist = () => {
    setTherapistIdx(i => (i + 1) % mockTherapists.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
        </div>
        <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl animate-scale-in">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎯 Tu match personalizado
            </div>
            <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">
              ¡Encontramos tu terapeuta!
            </h1>
            <p className="text-surface-500">Basado en tus respuestas, te recomendamos:</p>
          </div>

          {/* Therapist card */}
          <Card className="p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="w-28 h-28 rounded-3xl bg-gradient-cora flex items-center justify-center text-4xl font-black text-white mx-auto md:mx-0 shadow-cora-lg mb-3">
                  {therapist.firstName[0]}{therapist.lastName[0]}
                </div>
                <Badge color="teal" className="mx-auto md:mx-0">✓ Verificado</Badge>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-surface-900 dark:text-white">
                      {therapist.firstName} {therapist.lastName}
                    </h2>
                    <p className="text-surface-500">{therapist.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-600">${therapist.sessionPrice}</p>
                    <p className="text-xs text-surface-400">USD / sesión</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={therapist.rating} showValue />
                  <span className="text-sm text-surface-400">· {therapist.reviewCount} reseñas</span>
                  <span className="text-sm text-surface-400">· {therapist.experience} años exp.</span>
                </div>

                <p className="text-surface-600 dark:text-surface-400 text-sm mt-4 leading-relaxed line-clamp-3">
                  {therapist.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {therapist.specializations.map(s => (
                    <span key={s} className="text-xs px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">{therapist.rating}</p>
                    <p className="text-xs text-surface-400">Rating</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">{therapist.experience}</p>
                    <p className="text-xs text-surface-400">Años exp.</p>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-3 text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">{therapist.reviewCount}</p>
                    <p className="text-xs text-surface-400">Reseñas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session types */}
            <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
              <p className="text-sm font-medium text-surface-500 mb-3">Modalidades disponibles:</p>
              <div className="flex gap-2 flex-wrap">
                {therapist.sessionTypes.map(t => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium">
                    {t === 'video' && '🎥 Video'}
                    {t === 'audio' && '📞 Audio'}
                    {t === 'chat' && '💬 Chat'}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button fullWidth size="lg" onClick={() => navigate('/planes')}>
              Elegir un plan con {therapist.firstName} →
            </Button>
            <button
              onClick={changeTherapist}
              className="w-full py-3 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Ver otro terapeuta (gratis)
            </button>
          </div>

          <p className="text-center text-xs text-surface-400 mt-4">
            Podés cambiar de terapeuta en cualquier momento, gratis, sin límite de veces.
          </p>
        </div>
      </div>
    </div>
  )
}
