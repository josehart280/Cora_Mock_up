import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { mockAppointments, mockTherapists } from '../services/mockData'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { StatusBadge } from '../components/common/Badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function KPICard({ label, value, delta, icon, color }) {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-500',
    sage: 'bg-sage-50 dark:bg-sage-900/20 text-sage-500',
    warm: 'bg-warm-50 dark:bg-warm-900/20 text-warm-500',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
        {delta && (
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

const todayAppointments = mockAppointments.filter(a => a.status === 'scheduled').slice(0, 3)
const recentPatients = [
  { id: 'p1', firstName: 'María', lastName: 'González', lastSession: '2026-04-03', nextSession: '2026-04-10', status: 'active', messages: 1 },
  { id: 'p2', firstName: 'José', lastName: 'Pérez', lastSession: '2026-04-01', nextSession: '2026-04-10', status: 'active', messages: 2 },
  { id: 'p3', firstName: 'Laura', lastName: 'Soto', lastSession: '2026-03-28', nextSession: '2026-04-11', status: 'active', messages: 0 },
  { id: 'p4', firstName: 'Daniel', lastName: 'Castro', lastSession: '2026-03-25', nextSession: null, status: 'paused', messages: 3 },
]

export default function TherapistDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">
            Buenos días, {user?.firstName} 👩‍⚕️
          </h1>
          <p className="text-surface-500">Aquí está tu resumen de hoy.</p>
        </div>
        <Button size="sm" onClick={() => navigate('/citas')}>
          Ver agenda completa
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="👥" label="Pacientes activos" value="18" delta={5} color="teal" />
        <KPICard icon="📅" label="Sesiones este mes" value="36" delta={12} color="sage" />
        <KPICard icon="💰" label="Ganancias mes" value="$2,340" delta={8} color="warm" />
        <KPICard icon="⭐" label="Rating promedio" value="4.9" delta={null} color="blue" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's appointments + pending messages */}
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
              {todayAppointments.length > 0 ? (
                <div className="divide-y divide-surface-50 dark:divide-surface-800">
                  {todayAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-lg font-black text-surface-900 dark:text-white">
                          {format(new Date(apt.scheduledAt), 'HH:mm')}
                        </p>
                        <p className="text-xs text-surface-400">{apt.duration_minutes || apt.duration} min</p>
                      </div>
                      <div className="w-px h-10 bg-surface-100 dark:bg-surface-800" />
                      <Avatar firstName={apt.patient?.firstName} lastName={apt.patient?.lastName} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">
                          {apt.patient?.firstName} {apt.patient?.lastName}
                        </p>
                        <p className="text-xs text-surface-400">
                          {apt.type === 'video' ? '🎥 Video' : apt.type === 'audio' ? '📞 Audio' : '💬 Chat'}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                      <Button size="xs" onClick={() => navigate(`/sesion/${apt.roomId || 'room123'}`)}>
                        Iniciar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
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
                <h2 className="font-bold text-surface-900 dark:text-white">Mis pacientes</h2>
                <button onClick={() => navigate('/pacientes')} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">Ver todos</button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-surface-50 dark:divide-surface-800">
                {recentPatients.map(p => (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer" onClick={() => navigate('/mensajes')}>
                    <Avatar firstName={p.firstName} lastName={p.lastName} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-surface-400">
                        Próx: {p.nextSession ? format(new Date(p.nextSession), 'd MMM', { locale: es }) : 'Sin agendar'}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                    {p.messages > 0 && (
                      <span className="w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {p.messages}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* SLA messages indicator */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-surface-900 dark:text-white text-sm">Mensajes pendientes</h3>
              <span className="badge bg-warm-100 text-warm-700 dark:bg-warm-900/30 dark:text-warm-400">5 sin responder</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Daniel C.', time: '3h', urgent: true },
                { name: 'Sofía R.', time: '12h', urgent: false },
                { name: 'Luis M.', time: '18h', urgent: false },
              ].map(m => (
                <div key={m.name} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{m.name}</span>
                  <span className={`text-xs font-semibold ${m.urgent ? 'text-warm-600' : 'text-surface-400'}`}>
                    {m.urgent ? '⚠️ ' : ''}{m.time} sin respuesta
                  </span>
                </div>
              ))}
            </div>
            <Button fullWidth variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/mensajes')}>
              Ver todos los mensajes
            </Button>
            <p className="text-center text-xs text-surface-400 mt-2">SLA: responder en menos de 24hs</p>
          </Card>

          {/* This month earnings */}
          <Card className="p-5">
            <h3 className="font-bold text-surface-900 dark:text-white text-sm mb-4">Ganancias de abril</h3>
            <p className="text-4xl font-black text-surface-900 dark:text-white mb-1">$2,340</p>
            <p className="text-xs text-surface-400 mb-4">36 sesiones × $65 × 85% plataforma</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Total bruto</span>
                <span className="font-semibold">$2,754</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Comisión Cora (15%)</span>
                <span className="font-semibold text-red-500">-$413</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-surface-100 dark:border-surface-800 pt-2">
                <span>Tu pago</span>
                <span className="text-teal-600">$2,341</span>
              </div>
            </div>
            <Button fullWidth variant="ghost" size="sm" className="mt-4" onClick={() => navigate('/ganancias')}>
              Ver historial completo
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
