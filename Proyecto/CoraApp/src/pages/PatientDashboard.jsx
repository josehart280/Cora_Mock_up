import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { appointmentRepository } from '../repositories/appointmentRepository'
import { dashboardRepository } from '../repositories/dashboardRepository'
import { psychologistRepository } from '../repositories/psychologistRepository'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { format, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

function StatCard({ label, value, sub, color = 'teal', icon, loading }) {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400',
    warm: 'bg-warm-50 dark:bg-warm-900/20 text-warm-600 dark:text-warm-400',
  }

  if (loading) {
    return (
      <Card className="p-5 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-surface-200 dark:bg-surface-800 shrink-0" />
        <div className="space-y-2 w-full">
          <div className="h-6 bg-surface-200 dark:bg-surface-800 rounded w-1/2" />
          <div className="h-4 bg-surface-100 dark:bg-surface-900 rounded w-3/4" />
        </div>
      </Card>
    )
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
  const { profile } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [nextAppt, setNextAppt] = useState(null)
  const [history, setHistory] = useState([])
  const [assignedTherapist, setAssignedTherapist] = useState(null)

  useEffect(() => {
    async function loadDashboardData() {
      if (!profile?.id) return
      
      setLoading(true)
      try {
        const [statsData, nextData, historyData] = await Promise.all([
          dashboardRepository.getPatientStats(profile.id),
          appointmentRepository.getNextUpcoming(profile.id, 'patient'),
          appointmentRepository.getPatientAppointments(profile.id, 'completed')
        ])

        setStats(statsData)
        setNextAppt(nextData)
        setHistory(historyData)

        // If patient has a therapist assigned in their profile, fetch their info
        // Wait, patient_profiles table has therapist_id. I should fetch it.
        // For now, let's look for the therapist in the next appointment if available
        if (nextData) {
          setAssignedTherapist(nextData.psychologist)
        } else if (historyData.length > 0) {
          setAssignedTherapist(historyData[0].psychologist)
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [profile])

  const nextDate = nextAppt ? new Date(nextAppt.scheduledAt) : null
  const hoursUntil = nextDate ? differenceInHours(nextDate, new Date()) : null

  // Plan mapping for display
  const planNames = {
    'per_session': 'Por sesión',
    'basic': 'Básico',
    'standard': 'Estándar',
    'premium': 'Premium'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">
            ¡Hola, {profile?.first_name || 'paciente'}! 👋
          </h1>
          <p className="text-surface-500 mt-1">Aquí está tu resumen de hoy.</p>
        </div>
        <Button onClick={() => navigate('/psicologos')} size="sm">
          + Nueva cita
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          loading={loading}
          icon="📅" 
          label="Citas este mes" 
          value={stats?.sessionsThisMonth || '0'} 
          sub="Sesiones completadas" 
          color="teal" 
        />
        <StatCard 
          loading={loading}
          icon="💬" 
          label="Mensajes" 
          value="0" 
          sub="Próximamente" 
          color="warm" 
        />
        <StatCard 
          loading={loading}
          icon="⭐" 
          label="Tu plan" 
          value={planNames[stats?.activePlan] || 'Por sesión'} 
          sub={stats?.planPrice ? `$${stats.planPrice}/sem` : 'Sin suscripción'} 
          color="sage" 
        />
        <StatCard 
          loading={loading}
          icon="🌟" 
          label="Semanas activo" 
          value={stats?.weeksActive || '1'} 
          sub="¡Buen progreso!" 
          color="teal" 
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next appointment */}
        <div className="lg:col-span-2 space-y-6">
          {nextAppt ? (
            <Card>
              <CardHeader>
                <h2 className="font-bold text-surface-900 dark:text-white flex items-center gap-2">
                  <span>📅</span> Próxima sesión
                </h2>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-4 flex-wrap">
                  <Avatar 
                    src={nextAppt.psychologist.avatar}
                    firstName={nextAppt.psychologist.firstName} 
                    lastName={nextAppt.psychologist.lastName} 
                    size="lg" 
                    verified 
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-surface-900 dark:text-white">
                      {nextAppt.psychologist.firstName} {nextAppt.psychologist.lastName}
                    </h3>
                    <p className="text-sm text-surface-500">Psicólogo especializado</p>
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
                      <p className="text-2xl font-black text-teal-600">{hoursUntil || '0'}</p>
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
          ) : !loading && (
            <Card className="p-8 text-center bg-teal-50/30 dark:bg-teal-900/10 border-dashed border-2 border-teal-200 dark:border-teal-800">
              <p className="text-4xl mb-4">🗓️</p>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">No tenés sesiones programadas</h3>
              <p className="text-surface-500 mb-6">Tu camino hacia el bienestar continúa. Agendá tu próxima sesión hoy.</p>
              <Button size="md" onClick={() => navigate('/psicologos')}>Explorar psicólogos</Button>
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
              {history.length > 0 ? (
                <div className="divide-y divide-surface-50 dark:divide-surface-800">
                  {history.slice(0,3).map(apt => (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                      <Avatar 
                        src={apt.psychologist.avatar}
                        firstName={apt.psychologist.firstName} 
                        lastName={apt.psychologist.lastName} 
                        size="sm" 
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                          {apt.psychologist.firstName} {apt.psychologist.lastName}
                        </p>
                        <p className="text-xs text-surface-400">
                          {format(new Date(apt.scheduledAt), "d MMM yyyy 'a las' HH:mm", { locale: es })} · {apt.type}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              ) : !loading && (
                <div className="p-10 text-center text-surface-400">
                  Aún no has tenido sesiones completadas.
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* My therapist */}
          {assignedTherapist && (
            <Card className="p-5">
              <h3 className="font-bold text-surface-900 dark:text-white mb-4">Mi terapeuta</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar 
                  src={assignedTherapist.avatar}
                  firstName={assignedTherapist.firstName} 
                  lastName={assignedTherapist.lastName} 
                  size="md" 
                  verified 
                />
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">
                    {assignedTherapist.firstName} {assignedTherapist.lastName}
                  </p>
                  <p className="text-xs text-surface-400">Psicólogo clínico</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button fullWidth variant="secondary" size="sm" onClick={() => navigate('/mensajes')}>
                  Enviar mensaje
                </Button>
                <Button fullWidth variant="ghost" size="sm" onClick={() => navigate('/psicologos')}>
                  Cambiar terapeuta
                </Button>
              </div>
            </Card>
          )}

          {/* Subscription status */}
          <Card className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-surface-900 dark:text-white text-sm">Mi plan</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${stats?.planStatus === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-surface-100 text-surface-500'}`}>
                {stats?.planStatus === 'active' ? 'Activo' : 'Sin suscripción'}
              </span>
            </div>
            <p className="text-2xl font-black text-surface-900 dark:text-white">
              {planNames[stats?.activePlan] || 'Por sesión'}
            </p>
            {stats?.renewalDate && (
              <p className="text-sm text-surface-400 mb-4">
                ${stats.planPrice} / semana · Renovación {format(new Date(stats.renewalDate), 'd MMM', { locale: es })}
              </p>
            )}
            {!stats?.renewalDate && (
              <p className="text-sm text-surface-400 mb-4">Pagás solo por lo que usás.</p>
            )}
            <Button fullWidth variant="ghost" size="sm" onClick={() => navigate('/pagos')}>
              Administrar suscripción
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
