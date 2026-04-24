import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { appointmentRepository } from '../repositories/appointmentRepository'
import { dashboardRepository } from '../repositories/dashboardRepository'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function KPICard({ label, value, delta, icon, color, loading }) {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-500',
    sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-500',
    warm: 'bg-warm-50 dark:bg-warm-900/20 text-warm-500',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
  }

  if (loading) {
    return (
      <Card className="p-5 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-800 mb-3" />
        <div className="h-8 bg-surface-200 dark:bg-surface-800 rounded w-1/2 mb-2" />
        <div className="h-4 bg-surface-100 dark:bg-surface-900 rounded w-3/4" />
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
        {delta !== undefined && delta !== null && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${delta > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {delta > 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-surface-900 dark:text-white">{value}</p>
      <p className="text-sm text-surface-500 mt-1">{label}</p>
    </Card>
  )
}

export default function TherapistDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [todayAppts, setTodayAppts] = useState([])
  const [recentPatients, setRecentPatients] = useState([])

  useEffect(() => {
    async function loadDashboardData() {
      if (!profile?.id) return
      
      setLoading(true)
      try {
        const [statsData, apptsData] = await Promise.all([
          dashboardRepository.getTherapistStats(profile.id),
          appointmentRepository.getTherapistAppointments(profile.id, 'scheduled')
        ])

        setStats(statsData)
        
        // Filter appts that are actually today
        const todayStr = new Date().toISOString().split('T')[0]
        const todayOnly = apptsData.filter(a => a.scheduledAt.startsWith(todayStr))
        setTodayAppts(todayOnly)

        // Derive recent patients from appointments (just a simple way for the dashboard)
        const patientMap = new Map()
        apptsData.forEach(a => {
          if (!patientMap.has(a.patient.id)) {
            patientMap.set(a.patient.id, {
              ...a.patient,
              nextSession: a.scheduledAt,
              status: 'active'
            })
          }
        })
        setRecentPatients(Array.from(patientMap.values()).slice(0, 4))

      } catch (err) {
        console.error('Error loading therapist dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [profile])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">
            Buenos días, {profile?.first_name || 'terapeuta'} 👩‍⚕️
          </h1>
          <p className="text-surface-500">Aquí está tu resumen de hoy.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/citas')}>
          Ver agenda completa
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          loading={loading}
          icon="👥" 
          label="Pacientes activos" 
          value={stats?.activePatients || '0'} 
          color="teal" 
        />
        <KPICard 
          loading={loading}
          icon="📅" 
          label="Sesiones este mes" 
          value={stats?.sessionsThisMonth || '0'} 
          color="sage" 
        />
        <KPICard 
          loading={loading}
          icon="💰" 
          label="Ganancias mes" 
          value={`$${Math.round(stats?.monthlyEarnings || 0).toLocaleString()}`} 
          color="warm" 
        />
        <KPICard 
          loading={loading}
          icon="⭐" 
          label="Rating promedio" 
          value={stats?.averageRating?.toFixed(1) || '0.0'} 
          color="blue" 
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's appointments + patients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-surface-900 dark:text-white">📅 Citas de hoy</h2>
                <button onClick={() => navigate('/citas')} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Ver agenda</button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {todayAppts.length > 0 ? (
                <div className="divide-y divide-surface-50 dark:divide-surface-800">
                  {todayAppts.map(apt => (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-black text-surface-900 dark:text-white">
                          {format(new Date(apt.scheduledAt), 'HH:mm')}
                        </p>
                        <p className="text-xs text-surface-400">{apt.duration} min</p>
                      </div>
                      <div className="w-px h-10 bg-surface-100 dark:bg-surface-800" />
                      <Avatar 
                        src={apt.patient.avatar}
                        firstName={apt.patient.firstName} 
                        lastName={apt.patient.lastName} 
                        size="sm" 
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">
                          {apt.patient.firstName} {apt.patient.lastName}
                        </p>
                        <p className="text-xs text-surface-400">
                          {apt.type === 'video' ? '🎥 Video' : apt.type === 'audio' ? '📞 Audio' : '💬 Chat'}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                      <Button size="xs" onClick={() => navigate(`/sesion/${apt.roomId}`)}>
                        Iniciar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : !loading && (
                <div className="text-center py-10 text-surface-400">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="font-medium">No tenés citas hoy</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Patients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-surface-900 dark:text-white">Mis pacientes recientes</h2>
                <button onClick={() => navigate('/pacientes')} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Ver todos</button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {recentPatients.length > 0 ? (
                <div className="divide-y divide-surface-50 dark:divide-surface-800">
                  {recentPatients.map(p => (
                    <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer" onClick={() => navigate('/mensajes')}>
                      <Avatar 
                        src={p.avatar}
                        firstName={p.firstName} 
                        lastName={p.lastName} 
                        size="sm" 
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-surface-400">
                          Próx: {p.nextSession ? format(new Date(p.nextSession), 'd MMM', { locale: es }) : 'Sin agendar'}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              ) : !loading && (
                <div className="p-10 text-center text-surface-400">
                  Aún no tienes pacientes asignados.
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Earnings card */}
          <Card className="p-5">
            <h3 className="font-bold text-surface-900 dark:text-white text-sm mb-4">Ganancias estimadas</h3>
            <p className="text-4xl font-black text-surface-900 dark:text-white mb-1">
              ${Math.round(stats?.monthlyEarnings || 0).toLocaleString()}
            </p>
            <p className="text-xs text-surface-400 mb-4">Basado en sesiones completadas este mes (neto 85%)</p>
            <div className="space-y-2 border-t border-surface-100 dark:border-surface-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Sesiones mes</span>
                <span className="font-semibold">{stats?.sessionsThisMonth || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Rating</span>
                <span className="font-semibold text-teal-600">{stats?.averageRating?.toFixed(1) || '0.0'} ⭐</span>
              </div>
            </div>
            <Button fullWidth variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/ganancias')}>
              Ver historial completo
            </Button>
          </Card>
          
          {/* Messages indicator */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-surface-900 dark:text-white text-sm">Mensajería</h3>
              <span className="text-xs text-surface-400 italic">Módulo próximamente</span>
            </div>
            <p className="text-sm text-surface-500 text-center py-4 bg-surface-50 dark:bg-surface-800 rounded-xl border border-dashed border-surface-200 dark:border-surface-700">
              Pronto podrás chatear con tus pacientes directamente desde aquí.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
