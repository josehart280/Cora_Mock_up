import { mockAdminStats } from '../../services/mockData'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'

function KPI({ label, value, delta, prefix = '', suffix = '', color = 'teal' }) {
  const pos = delta > 0
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">{label}</p>
      <p className="text-3xl font-black text-surface-900 dark:text-white mb-2">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
      {delta !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pos ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {pos ? '▲' : '▼'} {Math.abs(delta)}{typeof delta === 'number' && delta < 100 ? '%' : ''} este mes
        </span>
      )}
    </Card>
  )
}

const recentActivity = [
  { type: 'new_user', text: 'María González se registró como paciente', time: 'hace 2 min', icon: '👤' },
  { type: 'verification', text: 'Dr. Herrera subió documentos para verificación', time: 'hace 15 min', icon: '📋' },
  { type: 'payment', text: 'Pago de $72 procesado exitosamente', time: 'hace 23 min', icon: '💳' },
  { type: 'session', text: 'Sesión completada — Dr. Rodríguez con paciente', time: 'hace 1h', icon: '📅' },
  { type: 'report', text: 'Contenido reportado en la comunidad', time: 'hace 2h', icon: '⚠️', urgent: true },
  { type: 'new_user', text: 'Carlos Alvarado se registró como paciente', time: 'hace 3h', icon: '👤' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-white">Panel de Administración</h1>
          <p className="text-surface-500">Resumen de la plataforma Cora</p>
        </div>
        <Badge color="teal" dot>Sistema operativo</Badge>
      </div>

      {/* KPIs grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Usuarios totales" value={mockAdminStats.totalUsers} delta={mockAdminStats.newUsersThisMonth} />
        <KPI label="Pacientes activos" value={mockAdminStats.activePatients} delta={12} />
        <KPI label="Ingresos mes" value={mockAdminStats.monthlyRevenue} prefix="$" delta={mockAdminStats.revenueGrowth} />
        <KPI label="Sesiones mes" value={mockAdminStats.totalSessions} delta={8} />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <KPI label="Psicólogos verificados" value={mockAdminStats.verifiedTherapists} />
        <KPI label="En espera verificación" value={mockAdminStats.pendingVerifications} delta={-2} />
        <KPI label="Rating promedio" value={mockAdminStats.avgRating} suffix="/5" />
        <KPI label="NPS" value={mockAdminStats.nps} />
      </div>

      {/* Metrics detail */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <p className="text-4xl font-black text-teal-600 mb-1">{mockAdminStats.sessionCompletionRate}%</p>
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Tasa de completación de sesiones</p>
          <p className="text-xs text-surface-400 mt-1">Meta: 90%+</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-4xl font-black text-red-500 mb-1">{mockAdminStats.churnRate}%</p>
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Churn mensual</p>
          <p className="text-xs text-surface-400 mt-1">Meta: &lt; 5%</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-4xl font-black text-sage-600 mb-1">85%</p>
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Payout a psicólogos</p>
          <p className="text-xs text-surface-400 mt-1">Cora retiene 15%</p>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-bold text-surface-900 dark:text-white">Actividad reciente</h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-surface-50 dark:divide-surface-800">
                {recentActivity.map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 px-6 py-4 ${item.urgent ? 'bg-warm-50 dark:bg-warm-900/10' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${item.urgent ? 'bg-warm-100 dark:bg-warm-900/30' : 'bg-surface-100 dark:bg-surface-800'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-surface-800 dark:text-surface-200">{item.text}</p>
                      <p className="text-xs text-surface-400 mt-0.5">{item.time}</p>
                    </div>
                    {item.urgent && <Badge color="warm">Revisar</Badge>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-surface-900 dark:text-white mb-4 text-sm">Acciones rápidas</h3>
            <div className="space-y-2">
              <Button fullWidth variant="secondary" size="sm" onClick={() => navigate('/admin/verificaciones')}>
                📋 Verificar psicólogos ({mockAdminStats.pendingVerifications} pendientes)
              </Button>
              <Button fullWidth variant="secondary" size="sm" onClick={() => navigate('/admin/usuarios')}>
                👥 Gestión de usuarios
              </Button>
              <Button fullWidth variant="secondary" size="sm">
                ⚠️ Contenido reportado (1)
              </Button>
              <Button fullWidth variant="secondary" size="sm">
                📊 Exportar reportes
              </Button>
              <Button fullWidth variant="ghost" size="sm">
                ⚙️ Configuración del sistema
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-surface-900 dark:text-white mb-3 text-sm">Estado del sistema</h3>
            <div className="space-y-3">
              {[
                { name: 'API Backend', status: 'ok', latency: '45ms' },
                { name: 'Supabase DB', status: 'ok', latency: '12ms' },
                { name: 'Supabase Auth', status: 'ok', latency: '28ms' },
                { name: 'Stripe Webhooks', status: 'ok', latency: '89ms' },
                { name: 'WebRTC Signaling', status: 'ok', latency: '67ms' },
              ].map(svc => (
                <div key={svc.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">{svc.name}</span>
                  </div>
                  <span className="text-xs text-surface-400">{svc.latency}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
