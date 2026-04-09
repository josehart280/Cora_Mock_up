import { useNavigate } from 'react-router-dom'
import { mockPlans } from '../services/mockData'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useAuthStore } from '../store/authStore'

export default function PlanSelection() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleSelect = (planId) => {
    // In real: go to Stripe checkout
    navigate('/registro')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950">
      <div className="flex items-center gap-2 px-6 py-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
        </div>
        <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
      </div>

      <div className="section-padding py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-3">Elegí tu plan</h1>
          <p className="text-surface-500 text-lg">Sin contratos. Cancelá cuando quieras. Precio claro.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mockPlans.map(plan => (
            <div key={plan.id} className={`relative rounded-3xl border-2 overflow-hidden ${plan.popular ? 'border-teal-500 shadow-cora-lg' : 'border-surface-200 dark:border-surface-700'} bg-white dark:bg-surface-900`}>
              {plan.popular && (
                <div className="bg-gradient-cora py-2 text-center text-white text-sm font-bold">
                  ⭐ Más popular
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-2">{plan.name}</h2>
                <p className="text-surface-400 text-sm mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-surface-900 dark:text-white">${plan.price}</span>
                  <span className="text-surface-400">/{plan.period}</span>
                </div>
                <Button fullWidth variant={plan.popular ? 'primary' : 'secondary'} size="lg" onClick={() => handleSelect(plan.id)}>
                  Empezar con {plan.name}
                </Button>
                <div className="mt-8 space-y-3">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-surface-600 dark:text-surface-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-surface-400 text-sm">🔒 Pago seguro con Stripe · 🔄 Cancelación inmediata · 📧 Confirmación por email</p>
          <p className="text-surface-400 text-sm">Precios en USD. Facturación semanal · Sin costos ocultos</p>
        </div>
      </div>
    </div>
  )
}
