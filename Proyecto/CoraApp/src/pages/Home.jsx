import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { StarRating } from '../components/common/index'
import { mockPlans, mockTherapists } from '../services/mockData'
import { useFeaturedPsychologists } from '../hooks'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    const startValue = 0
    const endValue = parseInt(end.replace(/[^0-9]/g, ''))

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(easeOutQuart * (endValue - startValue) + startValue)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    })

    const init = () => {
      resize()
      particles = Array.from({ length: 50 }, createParticle)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(42, 168, 171, ${p.opacity})`
        ctx.fill()

        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(42, 168, 171, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// Scroll Reveal Hook
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Feature Card with 3D Effect
function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
  }

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.3s ease-out',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <Card
        glass
        className="p-6 h-full relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-sage-500/0 group-hover:from-teal-500/20 group-hover:via-teal-500/10 group-hover:to-sage-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-4 relative group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2 relative">{feature.title}</h3>
        <p className="text-surface-500 text-sm leading-relaxed relative">{feature.description}</p>
      </Card>
    </div>
  )
}

// Testimonial Card with Glass Effect
function TestimonialCard({ testimonial, index }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <Card glass glow className="p-6 h-full relative">
        <div className="absolute top-4 right-4 text-6xl text-teal-500/10 font-serif">"</div>
        <div className="flex items-center gap-1 mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
        <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed mb-6 relative">
          "{testimonial.text}"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-sage-500 flex items-center justify-center text-white font-bold text-lg shadow-glow-teal">
            {testimonial.name[0]}
          </div>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white text-sm">{testimonial.name}</p>
            <p className="text-xs text-surface-400">{testimonial.city}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Pricing Card with Popular Badge
function PricingCard({ plan, navigate }) {
  return (
    <div
      className={clsx(
        'relative rounded-3xl transition-all duration-500 hover:-translate-y-3',
        plan.popular
          ? 'border-2 border-teal-500 bg-white dark:bg-surface-900 shadow-cora-lg hover:shadow-glow-teal'
          : 'border-2 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-soft-lg'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            <Badge color="teal" className="px-4 py-1.5 text-sm shadow-cora relative z-10">
              ⭐ Más popular
            </Badge>
            <div className="absolute inset-0 bg-teal-500 rounded-full blur-lg opacity-50 animate-pulse-soft" />
          </div>
        </div>
      )}
      <div className="p-8">
        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{plan.name}</h3>
        <p className="text-sm text-surface-400 mb-6">{plan.description}</p>
        <div className="mb-8">
          <span className="text-5xl font-black gradient-text">${plan.price}</span>
          <span className="text-surface-400">/{plan.period}</span>
        </div>
        <Button
          fullWidth
          variant={plan.popular ? 'primary' : 'secondary'}
          shine={plan.popular}
          onClick={() => navigate('/quiz')}
          className={plan.popular ? 'animate-glow' : ''}
        >
          Empezar con {plan.name}
        </Button>
        <div className="mt-8 space-y-3">
          {plan.features.map(f => (
            <div key={f} className="flex items-start gap-2.5 group">
              <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  )
}

const features = [
  { icon: '🎥', title: 'Sesiones por Video', description: 'Videollamadas HD con calidad profesional. Sin descargas, directo en tu navegador.', color: 'bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10' },
  { icon: '💬', title: 'Chat Ilimitado', description: 'Mensajería segura con tu terapeuta. Respuesta garantizada en menos de 24 horas.', color: 'bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900/30 dark:to-sage-900/10' },
  { icon: '📅', title: 'Agendá Flexible', description: 'Horarios que se adaptan a tu vida. Mañanas, tardes, noches y fines de semana.', color: 'bg-gradient-to-br from-warm-100 to-warm-50 dark:from-warm-900/30 dark:to-warm-900/10' },
  { icon: '🔒', title: 'Privacidad Total', description: 'Encriptación end-to-end. Tus datos nunca se venden. Cumplimos Ley 8968.', color: 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10' },
  { icon: '🔄', title: 'Cambio Gratis', description: '¿No conectás con tu terapeuta? Cambiás sin preguntas, sin límites, sin costo.', color: 'bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10' },
  { icon: '❌', title: 'Cancelación Fácil', description: 'Tres clicks para cancelar. Sin llamadas, sin explicaciones, sin trampas.', color: 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10' },
]

const testimonials = [
  { name: 'María G.', city: 'San José, CR', rating: 5, text: 'Nunca pensé que la terapia online fuera tan efectiva. Mi terapeuta es increíble y puedo hablar desde la comodidad de mi casa. Después de 2 meses me siento completamente diferente.' },
  { name: 'Carlos M.', city: 'Medellín, CO', rating: 5, text: 'La plataforma es muy fácil de usar y los precios son accesibles comparado con terapia presencial. Mi ansiedad ha mejorado muchísimo. Lo recomiendo totalmente.' },
  { name: 'Laura S.', city: 'Guadalajara, MX', rating: 5, text: 'Encontré a la Dra. Mora en Cora y fue lo mejor que me pudo pasar. El proceso de match fue perfecto, me asignaron exactamente lo que necesitaba.' },
]

const stats = [
  { value: '5000', suffix: '+', label: 'Pacientes atendidos' },
  { value: '95', suffix: '%', label: 'Tasa de satisfacción' },
  { value: '67', suffix: '', label: 'Psicólogos certificados' },
  { value: '4.9', suffix: '/5', label: 'Rating promedio' },
]

const faqs = [
  { q: '¿La terapia online es tan efectiva como la presencial?', a: 'Sí. Múltiples estudios demuestran que la terapia online tiene la misma efectividad que la presencial para la mayoría de las condiciones. La comodidad del hogar incluso ayuda a algunos pacientes a abrirse más.' },
  { q: '¿Cómo se seleccionan los psicólogos?', a: 'Todos nuestros psicólogos tienen licencia del Colegio Profesional de Psicólogos de Costa Rica (o equivalente), mínimo 3 años de experiencia, 1,000+ horas clínicas y pasan un riguroso proceso de verificación.' },
  { q: '¿Qué pasa si no me gusta mi terapeuta?', a: 'Podés cambiar de terapeuta en cualquier momento, de forma gratuita y sin límite de veces. Solo clickeás "Cambiar terapeuta" en tu perfil.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. Tu suscripción se puede cancelar en cualquier momento con 3 clicks. No requerimos llamadas telefónicas ni explicaciones. Recibís confirmación de cancelación inmediata por email.' },
  { q: '¿Mis datos están seguros?', a: 'Absolutamente. Cumplimos con la Ley 8968 de Costa Rica. Nunca compartimos tus datos con anunciantes. Nuestras sesiones están encriptadas end-to-end.' },
]

// Timeline Progress Line with Scroll Animation
function TimelineProgress() {
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Calculate progress based on scroll
          const updateProgress = () => {
            const rect = entry.target.parentElement.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const elementTop = rect.top
            const elementHeight = rect.height

            // Start when element enters viewport, end when bottom leaves
            const scrollProgress = Math.max(0, Math.min(1,
              (windowHeight - elementTop) / (windowHeight + elementHeight)
            ))
            setProgress(scrollProgress * 100)
          }

          updateProgress()
          window.addEventListener('scroll', updateProgress)
          return () => window.removeEventListener('scroll', updateProgress)
        }
      },
      { threshold: 0 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 right-0 bg-gradient-to-b from-teal-500 via-sage-500 to-warm-500 rounded-full transition-all duration-100"
      style={{ height: `${progress}%` }}
    />
  )
}

// Individual Timeline Step Component
function TimelineStep({ step, index, navigate }) {
  const { ref, isVisible } = useScrollReveal(0.2)
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className={clsx(
        'relative flex items-start md:items-center gap-8 md:gap-16 transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step Number / Icon - Mobile: Left, Desktop: Alternating */}
      <div className={clsx(
        'relative z-10 flex-shrink-0',
        'md:absolute md:left-1/2 md:-translate-x-1/2'
      )}>
        <StepIcon step={step} index={index} />
      </div>

      {/* Content Card */}
      <div className={clsx(
        'flex-1 ml-16 md:ml-0',
        isEven ? 'md:pr-[calc(50%+2rem)] md:text-right' : 'md:pl-[calc(50%+2rem)] md:text-left'
      )}>
        <StepCard step={step} index={index} navigate={navigate} />
      </div>
    </div>
  )
}

// Animated Step Icon
function StepIcon({ step, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const stepNumber = index + 1

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer glow ring */}
      <div className={clsx(
        'absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-sage-500 blur-lg transition-all duration-500',
        isHovered ? 'opacity-60 scale-110' : 'opacity-0 scale-100'
      )} />

      {/* Animated ring */}
      <div className={clsx(
        'absolute -inset-2 rounded-full border-2 border-dashed border-teal-300/50 transition-all duration-700',
        isHovered ? 'rotate-180 scale-110' : 'rotate-0'
      )} />

      {/* Main circle */}
      <div className={clsx(
        'relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
        'bg-gradient-to-br from-teal-400 to-teal-600',
        'shadow-lg shadow-teal-500/30',
        'group-hover:scale-110 group-hover:shadow-glow-teal'
      )}>
        {/* Step number with gradient */}
        <span className="text-2xl font-black text-white">
          {step.icon}
        </span>
      </div>

      {/* Step number indicator */}
      <div className={clsx(
        'absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white',
        'bg-gradient-to-br from-sage-500 to-warm-500',
        'shadow-lg transition-transform duration-300',
        isHovered ? 'scale-110' : 'scale-100'
      )}>
        {stepNumber}
      </div>
    </div>
  )
}

// Glassmorphism Step Card
function StepCard({ step, index, navigate }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.3s ease-out' }}
    >
      {/* Gradient border effect */}
      <div className={clsx(
        'absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500 via-sage-500 to-warm-500 opacity-0 blur transition-opacity duration-500',
        isHovered ? 'opacity-50' : 'opacity-0'
      )} />

      {/* Card content */}
      <div className="relative glass-card rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Background number */}
        <div className="absolute -right-4 -top-4 text-8xl font-black text-surface-200/50 dark:text-surface-800/50 select-none pointer-events-none">
          {step.num}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-teal-500 tracking-widest uppercase">
              Paso {index + 1}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent" />
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
            {step.desc}
          </p>

          {/* Action hint for first step */}
          {index === 0 && (
            <button
              onClick={() => navigate('/quiz')}
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              Comenzar ahora
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>

        {/* Hover glow effect */}
        <div className={clsx(
          'absolute inset-0 bg-gradient-to-br from-teal-500/0 via-sage-500/0 to-warm-500/0 opacity-0 transition-opacity duration-500',
          isHovered ? 'opacity-10' : 'opacity-0'
        )} />
      </div>
    </div>
  )
}

const steps = [
  { num: '01', title: 'Completá el quiz', desc: '5-8 preguntas sobre tus objetivos y preferencias. No creás cuenta hasta terminar.', icon: '📝' },
  { num: '02', title: 'Recibí tu match', desc: 'Te asignamos el psicólogo ideal. Podés cambiar gratis si querés.', icon: '🎯' },
  { num: '03', title: 'Elegí tu plan', desc: 'Desde $52/semana. Precios claros, sin sorpresas. Cancelá cuando quieras.', icon: '💳' },
  { num: '04', title: 'Primera sesión', desc: 'Tu terapeuta te escribe en las primeras 24hs. Agendás tu primera sesión.', icon: '🎉' },
]

export default function Home() {
  const navigate = useNavigate()
  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal()
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal()
  const { ref: pricingRef, isVisible: pricingVisible } = useScrollReveal()
  const { psychologists: featuredPsychologists, loading: featuredLoading } = useFeaturedPsychologists(4)

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Full Screen with Particles */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950/50 dark:via-surface-950 dark:to-sage-950/50" />
        <ParticleBackground />

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-400/20 dark:bg-sage-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-warm-400/10 dark:bg-warm-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div ref={heroRef} className="relative section-padding w-full py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 dark:bg-teal-900/30 backdrop-blur-sm border border-teal-200 dark:border-teal-800 mb-8 transition-all duration-1000',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <span className="text-lg">🇨🇷</span>
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Hecho para Costa Rica y Latinoamérica</span>
            </div>

            {/* Main Heading */}
            <h1 className={clsx(
              'text-5xl md:text-7xl lg:text-8xl font-black text-surface-900 dark:text-white leading-[1.1] mb-8 transition-all duration-1000 delay-100',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              Terapia profesional{' '}
              <span className="gradient-text">desde tu casa</span>
            </h1>

            {/* Subheading */}
            <p className={clsx(
              'text-xl md:text-2xl text-surface-600 dark:text-surface-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              Conectamos personas con psicólogos certificados en minutos.
              <span className="text-teal-600 dark:text-teal-400 font-medium"> Sesiones por video, audio o chat.</span>
            </p>

            {/* CTA Buttons */}
            <div className={clsx(
              'flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 transition-all duration-1000 delay-300',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <Button
                size="xl"
                shine
                onClick={() => navigate('/quiz')}
                rightIcon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
              >
                Encontrá tu terapeuta
              </Button>
              <Button size="xl" variant="secondary" onClick={() => navigate('/psicologos')}>
                Ver psicólogos
              </Button>
            </div>

            {/* Trust Badges */}
            <div className={clsx(
              'flex flex-wrap items-center justify-center gap-6 text-sm text-surface-500 transition-all duration-1000 delay-400',
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Gratis empezar
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Sin compromiso
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Cancelá cuando quieras
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={clsx(
                    'glass rounded-2xl p-6 text-center transition-all duration-700',
                    heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  <p className="text-3xl md:text-4xl font-black gradient-text mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How it works - Modern Timeline with Glassmorphism */}
      <section id="como-funciona" className="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sage-400/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-warm-400/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '4s' }} />

        <div className="section-padding relative">
          {/* Header */}
          <div className="text-center mb-20">
            <Badge color="sage" className="mb-4">Proceso simple</Badge>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-surface-900 dark:text-white mb-6">
              <span className="gradient-text">Empezar</span> es muy fácil
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              De cero a primera sesión en menos de 10 minutos. Así funciona Cora.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative max-w-5xl mx-auto">
            {/* Central Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2">
              {/* Background line */}
              <div className="absolute inset-0 bg-surface-200 dark:bg-surface-800 rounded-full" />
              {/* Animated progress line */}
              <TimelineProgress />
            </div>

            {/* Steps */}
            <div className="space-y-16 md:space-y-24">
              {steps.map((step, index) => (
                <TimelineStep key={index} step={step} index={index} navigate={navigate} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20">
            <div className="glass-card inline-flex flex-col sm:flex-row items-center gap-4 p-2 rounded-2xl">
              <Button size="xl" shine onClick={() => navigate('/quiz')} className="w-full sm:w-auto">
                Empezá el quiz gratis →
              </Button>
              <p className="text-sm text-surface-500 px-4">
                <span className="text-teal-500 font-medium">2 minutos</span> • Sin compromiso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-surface-50 dark:bg-surface-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage-400/5 rounded-full blur-3xl" />

        <div className="section-padding relative">
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
              <FeatureCard key={i} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet Therapists */}
      <section className="py-24 bg-white dark:bg-surface-950">
        <div className="section-padding">
          <div className="text-center mb-16">
            <Badge color="sage" className="mb-4">Nuestros profesionales</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-surface-900 dark:text-white mb-4">
              Psicólogos certificados
            </h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">
              Todos verificados, licenciados y con experiencia real.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              // Loading skeletons
              [...Array(4)].map((_, i) => (
                <Card key={i} className="p-6 text-center animate-pulse">
                  <div className="w-20 h-20 rounded-2xl bg-surface-200 dark:bg-surface-700 mx-auto mb-4" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-32 mx-auto mb-2" />
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-24 mx-auto mb-3" />
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-20 mx-auto" />
                </Card>
              ))
            ) : featuredPsychologists.length > 0 ? (
              featuredPsychologists.map((t) => (
                <Card key={t.id} glass hover className="p-6 text-center group" onClick={() => navigate('/psicologos')}>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-sage-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-cora group-hover:shadow-glow-teal group-hover:scale-105 transition-all duration-300">
                    {t.firstName?.[0]}{t.lastName?.[0]}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-bold text-surface-900 dark:text-white text-sm">{t.firstName} {t.lastName}</h3>
                    {t.verified && (
                      <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-surface-400 mb-3">{t.title}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <StarRating rating={t.rating} size="xs" />
                    <span className="text-xs text-surface-500">({t.reviewCount || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {t.specializations?.slice(0, 2).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-teal-600">${t.sessionPrice} USD/sesión</p>
                </Card>
              ))
            ) : (
              // Fallback to mock data if no real data from Supabase
              mockTherapists.slice(0, 4).map((t) => (
                <Card key={t.id} glass hover className="p-6 text-center group" onClick={() => navigate('/psicologos')}>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-sage-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-cora group-hover:shadow-glow-teal group-hover:scale-105 transition-all duration-300">
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
                    <span className="text-xs text-surface-500">({t.reviewCount})</span>
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
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Button variant="secondary" size="lg" onClick={() => navigate('/psicologos')}>
              Ver todos los psicólogos
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="precios" className="py-24 bg-surface-50 dark:bg-surface-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="section-padding relative">
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
              <PricingCard key={plan.id} plan={plan} navigate={navigate} />
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
              <TestimonialCard key={i} testimonial={t} index={i} />
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
                <details key={i} className="group bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-surface-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors list-none">
                    {faq.q}
                    <svg className="w-5 h-5 flex-shrink-0 text-surface-400 group-open:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-surface-500 dark:text-surface-400 text-sm leading-relaxed border-t border-surface-100 dark:border-surface-800 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-sage-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

        {/* Floating Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 text-balance">
            Tu bienestar mental importa
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Dar el primer paso es lo más difícil. Cora te acompaña desde ahí.
          </p>
          <Button
            size="xl"
            className="!bg-white !text-teal-600 hover:!bg-teal-50 shadow-elegant hover:shadow-glow-teal transition-all"
            shine
            onClick={() => navigate('/quiz')}
          >
            Encontrá tu terapeuta ahora →
          </Button>
          <p className="text-teal-200 text-sm mt-4">Gratis empezar • Resultado en 2 minutos • Sin tarjeta</p>
        </div>
      </section>
    </div>
  )
}
