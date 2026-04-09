import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { mockAppointments, mockMessages, mockTherapists } from '../services/mockData'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { format, formatDistanceToNow, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

function StatCard({ label, value, sub, color = 'teal', icon }) {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400',
    warm: 'bg-warm-50 dark:bg-warm-900/20 text-warm-600 dark:text-warm-400',
  }
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-surface-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-surface-500">{label}</p>
        {sub && <p className="text-xs text-surface-400">{sub}</p>}
      </div>
    </Card>
  )
}

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const nextAppt = mockAppointments.find(a => a.status === 'scheduled')
  const therapist = mockTherapists[0]
  const recentMessages = mockMessages

  const nextDate = nextAppt ? new Date(nextAppt.scheduledAt) : null
  const hoursUntil = nextDate ? differenceInHours(nextDate, new Date()) : null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">
            ¡Hola, {user?.firstName}! 👋
          </h1>
          <p className="text-surface-500 mt-1">Aquí está tu resumen de hoy.</p>
        </div>
        <Button onClick={() => navigate('/citas')} size="sm">
          + Nueva cita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Citas este mes" value="4" sub="2 completadas" color="teal" />
        <StatCard icon="💬" label="Mensajes sin leer" value="2" sub="Dr. Rodríguez" color="warm" />
        <StatCard icon="⭐" label="Tu plan" value="Estándar" sub="$72/semana" color="sage" />
        <StatCard icon="🌟" label="Semanas activo" value="12" sub="¡Sigue así!" color="teal" />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next appointment */}
        <div className="lg:col-span-2 space-y-6">
          {nextAppt && (
            <Card>
              <CardHeader>
                <h2 className="font-bold text-surface-900 dark:text-white flex items-center gap-2">
                  <span>📅</span> Próxima sesión
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-4 flex-wrap">
                  <Avatar firstName={therapist.firstName} lastName={therapist.lastName} size="lg" verified />
                  <div className="flex-1">
                    <h3 className="font-bold text-surface-900 dark:text-white">{therapist.firstName} {therapist.lastName}</h3>
                    <p className="text-sm text-surface-500">{therapist.title}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
                        🗓 {nextDate ? format(nextDate, "EEEE d 'de' MMMM", { locale: es }) : ''}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
                        🕐 {nextDate ? format(nextDate, 'HH:mm') : ''} ({nextAppt.duration} min)
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-surface-600 dark:text-surface-400">
                        {nextAppt.type === 'video' ? '🎥 Video' : nextAppt.type === 'audio' ? '📞 Audio' : '💬 Chat'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-center bg-teal-50 dark:bg-teal-900/30 rounded-2xl p-3 min-w-[80px]">
                      <p className="text-2xl font-black text-teal-600">{hoursUntil}</p>
                      <p className="text-xs text-teal-500 font-medium">horas</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <Button fullWidth onClick={() => navigate(`/sesion/${nextAppt.roomId}`)}>
                    Unirse a la sesión 🎥
                  </Button>
                  <Button variant="secondary" size="md" onClick={() => navigate('/citas')}>
                    Ver todas
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Recent appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-surface-900 dark:text-white">Historial de citas</h2>
                <button onClick={() => navigate('/citas')} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Ver todo</button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-surface-50 dark:divide-surface-800">
                {mockAppointments.filter(a => a.status === 'completed').slice(0,3).map(apt => (
                  <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                    <Avatar firstName={apt.psychologist.firstName} lastName={apt.psychologist.lastName} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                        {apt.psychologist.firstName} {apt.psychologist.lastName}
                      </p>
                      <p className="text-xs text-surface-400">
                        {format(new Date(apt.scheduledAt), "d MMM yyyy 'a las' HH:mm", { locale: es })} · {apt.type}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                    {!apt.hasReview && (
                      <button
                        onClick={() => navigate('/citas')}
                        className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline"
                      >
                        Calificar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* My therapist */}
          <Card className="p-5">
            <h3 className="font-bold text-surface-900 dark:text-white mb-4">Mi terapeuta</h3>
            <div className="flex items-center gap-3 mb-4">
              <Avatar firstName={therapist.firstName} lastName={therapist.lastName} size="md" verified online />
              <div>
                <p className="font-semibold text-surface-900 dark:text-white text-sm">{therapist.firstName} {therapist.lastName}</p>
                <p className="text-xs text-surface-400">{therapist.approach}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-4">
              <StarRating rating={therapist.rating} showValue />
              <span className="text-xs text-surface-400">({therapist.reviewCount})</span>
            </div>
            <div className="space-y-2">
              <Button fullWidth variant="secondary" size="sm" onClick={() => navigate('/mensajes')}>
                Enviar mensaje
              </Button>
              <Button fullWidth variant="ghost" size="sm" onClick={() => navigate('/citas')}>
                Cambiar terapeuta
              </Button>
            </div>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-surface-900 dark:text-white text-sm">Mensajes recientes</h3>
                <button onClick={() => navigate('/mensajes')} className="text-xs text-teal-600 dark:text-teal-400 hover:underline">Ver todo</button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {recentMessages.map(msg => (
                <div key={msg.id} className={`px-5 py-3 flex gap-3 items-start border-b border-surface-50 dark:border-surface-800 last:border-0 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors ${msg.unread ? 'bg-teal-50/50 dark:bg-teal-900/10' : ''}`} onClick={() => navigate('/mensajes')}>
                  <Avatar firstName="Carlos" lastName="Rodríguez" size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">{msg.from}</p>
                      {msg.unread && <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-surface-400 truncate mt-0.5">{msg.preview}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Subscription status */}
          <Card className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-surface-900 dark:text-white text-sm">Mi plan</h3>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">Activo</span>
            </div>
            <p className="text-2xl font-black text-surface-900 dark:text-white">Estándar</p>
            <p className="text-sm text-surface-400 mb-4">$72 / semana · Renovación 14 Abr</p>
            <Button fullWidth variant="ghost" size="sm" onClick={() => navigate('/pagos')}>
              Administrar suscripción
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
