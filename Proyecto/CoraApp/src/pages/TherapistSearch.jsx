import { useState } from 'react'
import { mockTherapists } from '../services/mockData'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { Modal } from '../components/common/Modal'
import { Input } from '../components/common/Input'
import { useNavigate } from 'react-router-dom'

const specialties = ['Todos', 'Ansiedad', 'Depresión', 'Pareja', 'Adolescentes', 'Trauma', 'TDAH', 'Mindfulness', 'Burnout']
const sessionTypes = ['Todos', 'Video', 'Audio', 'Chat']
const priceRanges = ['Todos', 'Menos de $60', '$60-$75', 'Más de $75']

export default function TherapistSearch() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('Todos')
  const [sessionType, setSessionType] = useState('Todos')
  const [price, setPrice] = useState('Todos')
  const [selectedTherapist, setSelectedTherapist] = useState(null)

  const filtered = mockTherapists.filter(t => {
    const matchSearch = search === '' ||
      t.firstName.toLowerCase().includes(search.toLowerCase()) ||
      t.lastName.toLowerCase().includes(search.toLowerCase()) ||
      t.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchSpecialty = specialty === 'Todos' || t.specializations.includes(specialty)
    const matchType = sessionType === 'Todos' || t.sessionTypes.includes(sessionType.toLowerCase())
    const matchPrice = price === 'Todos' ||
      (price === 'Menos de $60' && t.sessionPrice < 60) ||
      (price === '$60-$75' && t.sessionPrice >= 60 && t.sessionPrice <= 75) ||
      (price === 'Más de $75' && t.sessionPrice > 75)
    return matchSearch && matchSpecialty && matchType && matchPrice
  })

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-50 to-sage-50 dark:from-teal-950 dark:to-sage-950 py-12">
        <div className="section-padding text-center">
          <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-3">
            Encontrá tu terapeuta ideal
          </h1>
          <p className="text-surface-500 mb-8 max-w-xl mx-auto">
            {mockTherapists.length} psicólogos verificados disponibles. Todos con licencia y experiencia comprobada.
          </p>
          <div className="max-w-xl mx-auto">
            <Input
              placeholder="Buscar por nombre, especialidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <div className="section-padding py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Especialidad</p>
            <div className="flex gap-2 flex-wrap">
              {specialties.slice(0, 6).map(s => (
                <button
                  key={s}
                  onClick={() => setSpecialty(s)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    specialty === s
                      ? 'bg-teal-500 text-white shadow-cora'
                      : 'bg-white dark:bg-surface-900 text-surface-500 border border-surface-200 dark:border-surface-700 hover:border-teal-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-surface-500 mb-6">
          {filtered.length} {filtered.length === 1 ? 'psicólogo encontrado' : 'psicólogos encontrados'}
        </p>

        {/* Therapist grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(t => (
            <Card key={t.id} hover className="p-5" onClick={() => setSelectedTherapist(t)}>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-cora flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 shadow-cora">
                  {t.firstName[0]}{t.lastName[0]}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-bold text-surface-900 dark:text-white text-sm">{t.firstName} {t.lastName}</h3>
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-surface-400 mb-2">{t.title}</p>
                <div className="flex items-center justify-center gap-1">
                  <StarRating rating={t.rating} size="xs" />
                  <span className="text-xs text-surface-500">{t.rating} ({t.reviewCount})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3 justify-center">
                {t.specializations.slice(0, 2).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-center mb-4">
                <span className="text-lg font-black text-surface-900 dark:text-white">${t.sessionPrice}</span>
                <span className="text-xs text-surface-400"> USD/sesión</span>
              </div>

              <div className="flex gap-1 justify-center mb-4">
                {t.sessionTypes.map(type => (
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
      </div>

      {/* Therapist detail modal */}
      <Modal isOpen={!!selectedTherapist} onClose={() => setSelectedTherapist(null)} title="Perfil del psicólogo" size="lg">
        {selectedTherapist && (
          <div className="p-6">
            <div className="flex gap-5 mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-cora flex items-center justify-center text-3xl font-black text-white flex-shrink-0 shadow-cora-lg">
                {selectedTherapist.firstName[0]}{selectedTherapist.lastName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black text-surface-900 dark:text-white">{selectedTherapist.firstName} {selectedTherapist.lastName}</h2>
                    <p className="text-surface-500 text-sm">{selectedTherapist.title}</p>
                    <p className="text-xs text-surface-400">{selectedTherapist.education}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-teal-600">${selectedTherapist.sessionPrice}</p>
                    <p className="text-xs text-surface-400">USD/sesión</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={selectedTherapist.rating} showValue />
                  <span className="text-sm text-surface-400">· {selectedTherapist.reviewCount} reseñas · {selectedTherapist.experience} años exp.</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTherapist.specializations.map(s => (
                    <Badge key={s} color="teal">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Modalidades</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedTherapist.sessionTypes.map(t => (
                    <span key={t} className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      {t === 'video' ? '🎥 Video' : t === 'audio' ? '📞 Audio' : '💬 Chat'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Sobre mí</p>
              <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                {selectedTherapist.bio}
              </p>
            </div>

            <div className="flex gap-3">
              <Button fullWidth variant="secondary" onClick={() => setSelectedTherapist(null)}>
                Volver a la búsqueda
              </Button>
              <Button fullWidth onClick={() => navigate('/quiz')}>
                Empezar con {selectedTherapist.firstName} →
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
