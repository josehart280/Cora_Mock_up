import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { mockPayments, mockPlans } from '../services/mockData'
import { Card, CardBody, CardHeader, CardFooter } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { ConfirmModal } from '../components/common/Modal'

export default function Payments() {
  const navigate = useNavigate()
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelStep, setCancelStep] = useState(1) // Anti-dark-pattern: 3 steps

  const handleCancelStep = () => {
    if (cancelStep < 3) setCancelStep(s => s + 1)
    else {
      setCancelModal(false)
      setCancelStep(1)
      // Would call API to cancel
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-white">Pagos y suscripción</h1>
        <p className="text-surface-500">Administrá tu plan y revisá tu historial de pagos</p>
      </div>

      {/* Subscription card */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-teal-500">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-surface-500 mb-1">Plan activo</p>
                <h2 className="text-3xl font-black text-surface-900 dark:text-white">Estándar</h2>
              </div>
              <Badge color="teal" dot>Activo</Badge>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-teal-600">$72</span>
              <span className="text-surface-400">/semana</span>
            </div>
            <div className="space-y-2 text-sm text-surface-500 mb-6">
              <div className="flex justify-between">
                <span>Próxima renovación</span>
                <span className="font-medium text-surface-800 dark:text-surface-200">14 Abr 2026</span>
              </div>
              <div className="flex justify-between">
                <span>Método de pago</span>
                <span className="font-medium text-surface-800 dark:text-surface-200">Visa **** 4242</span>
              </div>
              <div className="flex justify-between">
                <span>Ciclo de facturación</span>
                <span className="font-medium text-surface-800 dark:text-surface-200">Semanal</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="secondary" fullWidth size="sm">
                Cambiar método de pago
              </Button>
              <button
                onClick={() => setCancelModal(true)}
                className="w-full text-sm text-surface-400 hover:text-red-500 transition-colors py-2 font-medium"
              >
                Cancelar suscripción
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Upgrade to Premium */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-medium text-surface-500">Mejorá tu plan</p>
              <Badge color="warm">Popular</Badge>
            </div>
            <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Plan Premium</h3>
            <p className="text-surface-500 text-sm mb-4">
              2 sesiones por semana + workshops grupales mensuales + soporte prioritario
            </p>
            <div className="mb-6">
              <span className="text-3xl font-black text-surface-900 dark:text-white">$95</span>
              <span className="text-surface-400">/semana</span>
              <span className="ml-2 text-sm text-teal-600 font-medium">+$23 sobre tu plan actual</span>
            </div>
            <Button fullWidth variant="warm">
              Mejorar a Premium
            </Button>
            <p className="text-center text-xs text-surface-400 mt-3">El cambio aplica desde la próxima renovación</p>
          </CardBody>
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-surface-900 dark:text-white">Historial de pagos</h2>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-800">
                  <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider px-6 py-3">Fecha</th>
                  <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider px-6 py-3">Descripción</th>
                  <th className="text-left text-xs font-semibold text-surface-400 uppercase tracking-wider px-6 py-3">Método</th>
                  <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider px-6 py-3">Monto</th>
                  <th className="text-right text-xs font-semibold text-surface-400 uppercase tracking-wider px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
                {mockPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">
                      {format(new Date(pay.date), 'd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-800 dark:text-surface-200 font-medium">
                      {pay.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-500">
                      {pay.method}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-surface-900 dark:text-white text-right">
                      ${pay.amount} {pay.currency}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge color={pay.status === 'succeeded' ? 'teal' : 'red'}>
                        {pay.status === 'succeeded' ? '✓ Pagado' : 'Fallido'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
        <CardFooter>
          <p className="text-xs text-surface-400">
            Los comprobantes se envían automáticamente a tu email. Para facturas fiscales, contactá soporte.
          </p>
        </CardFooter>
      </Card>

      {/* Cancellation modal — anti dark pattern: 3 steps with clear info */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            {cancelStep === 1 && (
              <>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                  ¿Querés cancelar tu suscripción?
                </h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-6">
                  Tu plan Estándar incluye:
                </p>
                <ul className="space-y-2 mb-6">
                  {['Mensajería ilimitada con tu terapeuta', '1 sesión por semana', 'Acceso a worksheets (150+)', 'Cambio de terapeuta gratis'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                      <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-surface-500 bg-surface-50 dark:bg-surface-800 rounded-2xl p-4 mb-6">
                  Si cancelás, seguís teniendo acceso hasta el <strong>14 de Abril</strong>. No se hacen cargos adicionales.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => { setCancelModal(false); setCancelStep(1) }}>
                    Mantener plan
                  </Button>
                  <Button variant="ghost" fullWidth onClick={handleCancelStep} className="text-surface-500">
                    Continuar →
                  </Button>
                </div>
              </>
            )}
            {cancelStep === 2 && (
              <>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                  ¿Hay algo que podamos mejorar?
                </h3>
                <p className="text-surface-500 text-sm mb-4">Tu feedback nos ayuda a mejorar Cora</p>
                <div className="space-y-2 mb-6">
                  {['El precio es demasiado alto', 'No estoy usando el servicio', 'Encontré otra plataforma', 'Mi proceso terapéutico terminó', 'Outro motivo'].map(r => (
                    <label key={r} className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-700 cursor-pointer hover:border-teal-300 transition-colors">
                      <input type="radio" name="reason" className="text-teal-600" />
                      <span className="text-sm text-surface-700 dark:text-surface-300">{r}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => { setCancelModal(false); setCancelStep(1) }}>
                    Mantener plan
                  </Button>
                  <Button variant="ghost" fullWidth onClick={handleCancelStep} className="text-surface-500">
                    Continuar →
                  </Button>
                </div>
              </>
            )}
            {cancelStep === 3 && (
              <>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                  Confirmar cancelación
                </h3>
                <div className="bg-warm-50 dark:bg-warm-900/20 border border-warm-200 dark:border-warm-800 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-warm-700 dark:text-warm-300 font-medium mb-2">⚠️ Esto cancelará tu suscripción</p>
                  <p className="text-sm text-warm-600 dark:text-warm-400">Tu acceso termina el <strong>14 de Abril 2026</strong>. No habrá reembolso por el período actual. Podés reactivar en cualquier momento.</p>
                </div>
                <div className="flex gap-3">
                  <Button fullWidth onClick={() => { setCancelModal(false); setCancelStep(1) }}>
                    No, mantener plan
                  </Button>
                  <Button variant="danger" fullWidth onClick={handleCancelStep}>
                    Sí, cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
