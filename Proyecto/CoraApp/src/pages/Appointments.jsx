import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { mockAppointments, mockTherapists } from '../services/mockData'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'

export default function Appointments() {
  const navigate = useNavigate()
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [filter, setFilter] = useState('all')
  const [bookingModal, setBookingModal] = useState(false)
  const [selectedTherapist, setSelectedTherapist] = useState(mockTherapists[0])

  const filtered = filter === 'all'
    ? mockAppointments
    : mockAppointments.filter(a => a.status === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">Mis citas</h1>
          <p className="text-surface-500">Gestioná tus sesiones de terapia</p>
        </div>
        <Button onClick={() => setBookingModal(true)}>
          + Agendar cita
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Todas', count: mockAppointments.length },
          { value: 'scheduled', label: 'Próximas', count: mockAppointments.filter(a => a.status === 'scheduled').length },
          { value: 'completed', label: 'Completadas', count: mockAppointments.filter(a => a.status === 'completed').length },
          { value: 'cancelled', label: 'Canceladas', count: 0 },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-teal-500 text-white shadow-cora'
                : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:border-teal-300'
            }`}
          >
            {f.label} {f.count > 0 && <span className="ml-1 opacity-70">({f.count})</span>}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">📅</p>
            <h3 className="text-lg font-bold text-surface-800 dark:text-surface-200 mb-2">No hay citas</h3>
            <p className="text-surface-400 mb-6">No tenés citas {filter !== 'all' ? 'en este estado' : 'aún'}</p>
            <Button onClick={() => setBookingModal(true)}>Agendar primera cita</Button>
          </div>
        ) : (
          filtered.map(apt => (
            <Card key={apt.id} className="p-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-2xl p-3 text-center min-w-[70px]">
                  <p className="text-xl font-black text-teal-600">{format(new Date(apt.scheduledAt), 'd')}</p>
                  <p className="text-xs font-medium text-teal-500">{format(new Date(apt.scheduledAt), 'MMM', { locale: es })}</p>
                  <p className="text-xs text-teal-400">{format(new Date(apt.scheduledAt), 'HH:mm')}</p>
                </div>
                <Avatar
                  firstName={apt.psychologist.firstName}
                  lastName={apt.psychologist.lastName}
                  size="md"
                  verified
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-surface-900 dark:text-white">
                      {apt.psychologist.firstName} {apt.psychologist.lastName}
                    </h3>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-sm text-surface-400">
                      {format(new Date(apt.scheduledAt), "EEEE d 'de' MMMM", { locale: es })}
                    </span>
                    <span className="text-sm text-surface-400">
                      {format(new Date(apt.scheduledAt), 'HH:mm')} · {apt.duration} min
                    </span>
                    <span className="text-sm text-surface-400">
                      {apt.type === 'video' ? '🎥 Video' : apt.type === 'audio' ? '📞 Audio' : '💬 Chat'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'scheduled' && (
                    <>
                      <Button size="sm" onClick={() => navigate(`/sesion/${apt.roomId || 'room123'}`)}>
                        Unirse
                      </Button>
                      <Button size="sm" variant="ghost">
                        Cancelar
                      </Button>
                    </>
                  )}
                  {apt.status === 'completed' && !apt.hasReview && (
                    <Button size="sm" variant="secondary">
                      Calificar sesión ⭐
                    </Button>
                  )}
                  {apt.status === 'completed' && apt.hasReview && (
                    <span className="text-sm text-surface-400 flex items-center gap-1">✓ Calificada</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModal} onClose={() => setBookingModal(false)} title="Agendar nueva cita" size="lg">
        <div className="p-6 space-y-6">
          {/* Therapist selector */}
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Tu terapeuta</p>
            <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl">
              <Avatar firstName={selectedTherapist.firstName} lastName={selectedTherapist.lastName} size="md" verified />
              <div>
                <p className="font-semibold text-surface-900 dark:text-white">{selectedTherapist.firstName} {selectedTherapist.lastName}</p>
                <p className="text-sm text-surface-500">{selectedTherapist.title}</p>
              </div>
            </div>
          </div>

          {/* Session type */}
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Tipo de sesión</p>
            <div className="grid grid-cols-3 gap-3">
              {['video', 'audio', 'chat'].map(t => (
                <button key={t} className="p-3 rounded-2xl border-2 border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-center">
                  <span className="block text-xl mb-1">
                    {t === 'video' ? '🎥' : t === 'audio' ? '📞' : '💬'}
                  </span>
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300 capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Available slots */}
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Horarios disponibles esta semana</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Jue 10 Abr — 09:00', 'Jue 10 Abr — 10:00',
                'Jue 10 Abr — 11:00', 'Vie 11 Abr — 09:00',
                'Vie 11 Abr — 14:00', 'Lun 14 Abr — 09:00',
              ].map(slot => (
                <button key={slot} className="p-3 rounded-xl border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-700 dark:text-surface-300 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all text-left">
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth size="lg" onClick={() => setBookingModal(false)}>
            Confirmar cita
          </Button>
          <p className="text-center text-xs text-surface-400">La sesión cuesta $65 USD · Se cobra al confirmar</p>
        </div>
      </Modal>
    </div>
  )
}
