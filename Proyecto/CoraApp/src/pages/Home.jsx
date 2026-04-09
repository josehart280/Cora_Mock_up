import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { mockTherapists, mockPlans } from '../services/mockData'

const features = [
  {
    icon: '🎥',
    title: 'Sesiones por Video',
    description: 'Videollamadas de alta calidad directamente en tu navegador. Sin instalar nada.',
    color: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: '💬',
    title: 'Chat Ilimitado',
    description: 'Mensajes con tu terapeuta cuando lo necesités. Respuesta garantizada en 24hs.',
    color: 'bg-sage-50 dark:bg-sage-900/20',
  },
  {
    icon: '📅',
    title: 'Sesiones Flexibles',
    description: 'Agendá cuando tengas tiempo — mañanas, tardes, noches o fines de semana.',
    color: 'bg-warm-50 dark:bg-warm-900/20',
  },
  {
    icon: '🔒',
    title: 'Privacidad Total',
    description: 'Tus datos son tuyo. Nunca los usamos para publicidad. Cumplimos Ley 8968.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: '🔄',
    title: 'Cambio Gratis',
    description: 'Si no conectás con tu terapeuta, cambiás en un click. Sin preguntas.',
    color: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: '❌',
    title: 'Cancelación Fácil',
    description: 'Cancelás en cualquier momento. 3 clicks. Sin llamadas. Sin trampas.',
    color: 'bg-red-50 dark:bg-red-900/20',
  },
]

const testimonials = [
  {
    name: 'María G.',
    city: 'San José, CR',
    rating: 5,
    text: 'Nunca pensé que la terapia online fuera tan efectiva. Mi terapeuta es increíble y puedo hablar desde la comodidad de mi casa. Después de 2 meses me siento completamente diferente.',
  },
  {
    name: 'Carlos M.',
    city: 'Medellín, CO',
    rating: 5,
    text: 'La plataforma es muy fácil de usar y los precios son accesibles comparado con terapia presencial. Mi ansiedad ha mejorado muchísimo. Lo recomiendo totalmente.',
  },
  {
    name: 'Laura S.',
    city: 'Guadalajara, MX',
    rating: 5,
    text: 'Encontré a la Dra. Mora en Cora y fue lo mejor que me pudo pasar. El proceso de match fue perfecto, me asignaron exactamente lo que necesitaba.',
  },
]

const stats = [
  { value: '5,000+', label: 'Pacientes atendidos' },
  { value: '95%', label: 'Tasa de satisfacción' },
  { value: '67', label: 'Psicólogos certificados' },
  { value: '4.9/5', label: 'Rating promedio' },
]

const faqs = [
  {
    q: '¿La terapia online es tan efectiva como la presencial?',
    a: 'Sí. Múltiples estudios demuestran que la terapia online tiene la misma efectividad que la presencial para la mayoría de las condiciones. La comodidad del hogar incluso ayuda a algunos pacientes a abrirse más.',
  },
  {
    q: '¿Cómo se seleccionan los psicólogos?',
    a: 'Todos nuestros psicólogos tienen licencia del Colegio Profesional de Psicólogos de Costa Rica (o equivalente), mínimo 3 años de experiencia, 1,000+ horas clínicas y pasan un riguroso proceso de verificación de antecedentes.',
  },
  {
    q: '¿Qué pasa si no me gusta mi terapeuta?',
    a: 'Podés cambiar de terapeuta en cualquier momento, de forma gratuita y sin límite de veces. Solo clickeás "Cambiar terapeuta" en tu perfil.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Tu suscripción se puede cancelar en cualquier momento con 3 clicks. No requerimos llamadas telefónicas ni explicaciones. Recibís confirmación de cancelación inmediata por email.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Absolutamente. Cumplimos con la Ley 8968 de Costa Rica. Nunca compartimos tus datos con anunciantes. Nuestras sesiones están encriptadas end-to-end. Podés solicitar la eliminación de tus datos en cualquier momento.',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sage-200/30 dark:bg-sage-800/20 rounded-full blur-3xl" />

        <div className="relative section-padding w-full py-24">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge color="teal" className="mb-6">
              🇨🇷 Hecho para Costa Rica y Latinoamérica
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-surface-900 dark:text-white leading-tight mb-6 text-balance">
              Terapia profesional{' '}
              <span className="gradient-text">desde tu casa</span>
            </h1>
            <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
              Conectamos personas con psicólogos certificados en minutos. Sesiones por video, audio o chat. Cancelación sin dramas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="xl" onClick={() => navigate('/quiz')} rightIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              }>
                Encontrá tu terapeuta
              </Button>
              <Button size="xl" variant="secondary" onClick={() => navigate('/psicologos')}>
                Ver psicólogos
              </Button>
            </div>
            <p className="text-sm text-surface-400">
              ✓ Gratis empezar &nbsp;|&nbsp; ✓ Sin compromiso &nbsp;|&nbsp; ✓ Cancelá cuando quieras
            </p>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map(stat => (
                <div key={stat.label} className="glass rounded-2xl p-4">
                  <p className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</p>
                  <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-white dark:bg-surface-950">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="sage" className="mb-4">Proceso simple</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Empezar es muy fácil
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              De cero a primera sesión en menos de 10 minutos.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-teal-200 via-sage-200 to-warm-200" />

            {[
              { num: '01', title: 'Completá el quiz', desc: '5-8 preguntas sobre tus objetivos y preferencias. No creás cuenta hasta terminar.', icon: '📝' },
              { num: '02', title: 'Recibí tu match', desc: 'Te asignamos el psicólogo ideal. Podés cambiar gratis si querés.', icon: '🎯' },
              { num: '03', title: 'Elegí tu plan', desc: 'Desde $52/semana. Precios claros, sin sorpresas. Cancelá cuando quieras.', icon: '💳' },
              { num: '04', title: 'Primera sesión', desc: 'Tu terapeuta te escribe en las primeras 24hs. Agendás tu primera sesión.', icon: '🎉' },
            ].map((step, i) => (
              <div key={i} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-cora flex items-center justify-center text-2xl mx-auto mb-4 relative z-10 shadow-cora">
                  {step.icon}
                </div>
                <p className="text-xs font-bold text-teal-500 mb-2 tracking-widest">{step.num}</p>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/quiz')}>
              Empezá el quiz gratis →
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="teal" className="mb-4">¿Por qué Cora?</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Diseñado para vos
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              Todo lo que necesitás para empezar y mantener tu proceso terapéutico.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} hover className="p-6">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet therapists */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="sage" className="mb-4">Nuestros profesionales</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Psicólogos certificados
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              Todos verificados, licenciados y con experiencia real. No hay atajos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTherapists.map((t) => (
              <Card key={t.id} hover className="p-6 text-center" onClick={() => navigate('/psicologos')}>
                <div className="w-20 h-20 rounded-2xl bg-gradient-cora flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-cora">
                  {t.firstName[0]}{t.lastName[0]}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="font-bold text-surface-900 dark:text-white text-sm">{t.firstName} {t.lastName}</h3>
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-surface-400 mb-3">{t.title}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <StarRating rating={t.rating} size="xs" />
                  <span className="text-xs text-surface-500">{t.rating} ({t.reviewCount})</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {t.specializations.slice(0, 2).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-bold text-teal-600">${t.sessionPrice} USD/sesión</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="secondary" size="lg" onClick={() => navigate('/psicologos')}>
              Ver todos los psicólogos
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="warm" className="mb-4">Transparencia total</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Precios que podés ver
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              Sin sorpresas, sin letra chica. Sabés exactamente qué pagás.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? 'border-teal-500 bg-white dark:bg-surface-900 shadow-cora-lg'
                    : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge color="teal" className="px-4 py-1.5 text-sm shadow-cora">
                      ⭐ Más popular
                    </Badge>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-surface-400 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-black text-surface-900 dark:text-white">${plan.price}</span>
                    <span className="text-surface-400">/{plan.period}</span>
                  </div>
                  <Button
                    fullWidth
                    variant={plan.popular ? 'primary' : 'secondary'}
                    onClick={() => navigate('/quiz')}
                  >
                    Empezar con {plan.name}
                  </Button>
                  <div className="mt-8 space-y-3">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5">
                        <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-surface-600 dark:text-surface-400">{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map(f => (
                      <div key={f} className="flex items-start gap-2.5 opacity-40">
                        <svg className="w-5 h-5 text-surface-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-surface-500">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-surface-400 mt-8">
            💳 Stripe seguro • 🔒 Datos encriptados • 🔄 Cancelación inmediata garantizada
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="teal" className="mb-4">Lo que dicen</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Historias reales
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  <StarRating rating={t.rating} />
                </div>
                <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-cora flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-surface-400">{t.city}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <Badge color="sage" className="mb-4">FAQ</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
                Preguntas frecuentes
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-surface-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors list-none">
                    {faq.q}
                    <svg className="w-5 h-5 flex-shrink-0 text-surface-400 group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-surface-500 dark:text-surface-400 text-sm leading-relaxed border-t border-surface-50 dark:border-surface-800 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-gradient-cora relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        <div className="relative section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 text-balance">
            Tu bienestar mental importa
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Dar el primer paso es lo más difícil. Cora te acompaña desde ahí.
          </p>
          <Button
            size="xl"
            variant="glass"
            className="!text-teal-700 !bg-white/90 hover:!bg-white"
            onClick={() => navigate('/quiz')}
          >
            Encontrá tu terapeuta ahora →
          </Button>
          <p className="text-teal-200 text-sm mt-4">Gratis empezar • Resultado en 2 minutos • Sin tarjeta requerida</p>
        </div>
      </section>
    </div>
  )
}
