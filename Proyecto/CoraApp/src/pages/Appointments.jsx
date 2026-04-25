import { useState, useEffect } from 'react'
import { format, addDays, startOfToday, setHours, setMinutes } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { appointmentRepository } from '../repositories/appointmentRepository'
import { patientRepository } from '../repositories/patientRepository'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'

export default function Appointments() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [bookingModal, setBookingModal] = useState(false)
  const [assignedTherapist, setAssignedTherapist] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Booking state
  const [selectedDate, setSelectedDate] = useState(null)
  const [sessionType, setSessionType] = useState('video')

  useEffect(() => {
    if (!profile?.id) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [appts, therapist] = await Promise.all([
          appointmentRepository.getPatientAppointments(profile.id),
          patientRepository.getAssignedTherapist(profile.id)
        ])
        setAppointments(appts)
        setAssignedTherapist(therapist)
      } catch (err) {
        console.error('Error loading appointments:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Real-time subscription
    const subscription = appointmentRepository.subscribeToChanges(
      profile.id,
      'patient',
      () => {
        // Refresh list on any change
        appointmentRepository.getPatientAppointments(profile.id).then(setAppointments)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [profile])

  const handleBooking = async () => {
    if (!selectedDate || !assignedTherapist) return
    
    setSubmitting(true)
    try {
      await appointmentRepository.createAppointment({
        patientId: profile.id,
        psychologistId: assignedTherapist.id,
        scheduledAt: selectedDate.toISOString(),
        type: sessionType
      })
      setBookingModal(false)
      setSelectedDate(null)
    } catch (err) {
      alert('Error al agendar la cita. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  // Generate some mock available slots for the therapist based on their profile or simple logic
  // In a real app, this would come from a "slots" table or calculating availability
  const generateSlots = () => {
    const slots = []
    const today = startOfToday()
    for (let i = 1; i < 5; i++) {
      const day = addDays(today, i)
      // Just 9:00 and 14:00 for demo
      slots.push(setMinutes(setHours(day, 9), 0))
      slots.push(setMinutes(setHours(day, 14), 0))
    }
    return slots
  }
  const availableSlots = generateSlots()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">Mis citas</h1>
          <p className="text-surface-500">Gestioná tus sesiones de terapia</p>
        </div>
        <Button onClick={() => setBookingModal(true)} disabled={!assignedTherapist}>
          + Agendar cita
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Todas', count: appointments.length },
          { value: 'scheduled', label: 'Próximas', count: appointments.filter(a => a.status === 'scheduled').length },
          { value: 'completed', label: 'Completadas', count: appointments.filter(a => a.status === 'completed').length },
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
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-surface-200 dark:bg-surface-800 rounded w-1/3" />
                  <div className="h-4 bg-surface-100 dark:bg-surface-900 rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-surface-900 rounded-3xl border-2 border-dashed border-surface-100 dark:border-surface-800">
            <p className="text-4xl mb-4">📅</p>
            <h3 className="text-lg font-bold text-surface-800 dark:text-surface-200 mb-2">No hay citas</h3>
            <p className="text-surface-400 mb-6">No tenés citas {filter !== 'all' ? 'en este estado' : 'aún'}</p>
            <Button onClick={() => assignedTherapist ? setBookingModal(true) : navigate('/psicologos')}>
              {assignedTherapist ? 'Agendar primera cita' : 'Buscar psicólogo'}
            </Button>
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
                  src={apt.psychologist.avatar}
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
                      {apt.duration} min · {apt.type === 'video' ? '🎥 Video' : apt.type === 'audio' ? '📞 Audio' : '💬 Chat'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'scheduled' && (
                    <>
                      <Button size="sm" onClick={() => navigate(`/sesion/${apt.roomId}`)}>
                        Unirse
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => appointmentRepository.cancelAppointment(apt.id)}>
                        Cancelar
                      </Button>
                    </>
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
          {assignedTherapist ? (
            <>
              {/* Therapist details */}
              <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-2xl">
                <Avatar src={assignedTherapist.avatar_url} firstName={assignedTherapist.first_name} lastName={assignedTherapist.last_name} size="md" verified />
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white">{assignedTherapist.full_name}</p>
                  <p className="text-sm text-surface-500">Tu terapeuta asignado</p>
                </div>
              </div>

              {/* Session type */}
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Tipo de sesión</p>
                <div className="grid grid-cols-3 gap-3">
                  {['video', 'audio', 'chat'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setSessionType(t)}
                      className={`p-3 rounded-2xl border-2 transition-all text-center ${
                        sessionType === t 
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' 
                          : 'border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-400'
                      }`}
                    >
                      <span className="block text-xl mb-1">
                        {t === 'video' ? '🎥' : t === 'audio' ? '📞' : '💬'}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available slots */}
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Horarios disponibles</p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                  {availableSlots.map(slot => (
                    <button 
                      key={slot.toISOString()} 
                      onClick={() => setSelectedDate(slot)}
                      className={`p-3 rounded-xl border transition-all text-sm font-medium text-left ${
                        selectedDate?.toISOString() === slot.toISOString()
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-teal-300'
                      }`}
                    >
                      {format(slot, "EEE d MMM — HH:mm", { locale: es })}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleBooking} 
                loading={submitting}
                disabled={!selectedDate || submitting}
              >
                Confirmar cita
              </Button>
              <p className="text-center text-xs text-surface-400">La sesión tiene una duración de 60 minutos.</p>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-surface-500 mb-4">Aún no tienes un terapeuta asignado.</p>
              <Button onClick={() => navigate('/psicologos')}>Buscar psicólogo</Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
