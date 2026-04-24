import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '../common/Button'

const footerLinks = {
  'Plataforma': [
    { label: 'Cómo funciona', href: '/#como-funciona', icon: '⚙️' },
    { label: 'Nuestros psicólogos', href: '/psicologos', icon: '👥' },
    { label: 'Precios', href: '/#precios', icon: '💰' },
    { label: 'Comunidad', href: '/comunidad', icon: '💬' },
  ],
  'Soporte': [
    { label: 'Centro de ayuda', href: '#', icon: '❓' },
    { label: 'Contacto', href: '#', icon: '📧' },
    { label: 'Reportar problema', href: '#', icon: '🐛' },
    { label: 'Estado del servicio', href: '#', icon: '✅' },
  ],
  'Legal': [
    { label: 'Términos y condiciones', href: '#', icon: '📄' },
    { label: 'Política de privacidad', href: '#', icon: '🔒' },
    { label: 'Política de cookies', href: '#', icon: '🍪' },
    { label: 'Cancelación', href: '#', icon: '✕' },
  ],
}

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#', gradient: 'from-surface-700 to-surface-800' },
  { name: 'Instagram', icon: '📸', href: '#', gradient: 'from-purple-500 via-pink-500 to-yellow-500' },
  { name: 'LinkedIn', icon: '💼', href: '#', gradient: 'from-blue-600 to-blue-700' },
  { name: 'YouTube', icon: '▶️', href: '#', gradient: 'from-red-600 to-red-700' },
]

// Aurora Lights Background - Efecto de aurora boreal
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Capas de aurora con diferentes animaciones */}
      <div
        className="aurora-layer absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(42,168,171,0.4) 0%, rgba(109,137,88,0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'aurora1 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="aurora-layer absolute -top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(214,142,45,0.4) 0%, rgba(199,107,168,0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'aurora2 15s ease-in-out infinite alternate',
        }}
      />
      <div
        className="aurora-layer absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(109,137,88,0.5) 0%, rgba(42,168,171,0.2) 50%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora3 18s ease-in-out infinite alternate',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// Multi-layer Wave Animation
function WaveBackground() {
  return (
    <div className="absolute top-0 left-0 right-0 overflow-hidden -translate-y-[99%]">
      {/* Wave 1 - Back layer */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute w-full h-24 md:h-32 opacity-30"
        style={{ animation: 'waveFloat 6s ease-in-out infinite' }}
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
          className="fill-surface-900 dark:fill-surface-950"
        />
      </svg>

      {/* Wave 2 - Middle layer */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute w-full h-20 md:h-28 opacity-60"
        style={{ animation: 'waveFloat 4s ease-in-out infinite reverse' }}
      >
        <path
          d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1200,60 1200,60 V120 H0 Z"
          className="fill-surface-900 dark:fill-surface-950"
        />
      </svg>

      {/* Wave 3 - Front layer with glow */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative w-full h-16 md:h-24"
        style={{
          filter: 'drop-shadow(0 -10px 30px rgba(42,168,171,0.3))',
        }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1C4648" />
            <stop offset="50%" stopColor="#1B5557" />
            <stop offset="100%" stopColor="#1C4648" />
          </linearGradient>
        </defs>
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  )
}

// Floating Particles con conexiones
function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []
    let animationId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    })

    const init = () => {
      resize()
      particles = Array.from({ length: 30 }, createParticle)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Pulsing opacity
        const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(42, 168, 171, ${pulseOpacity})`
        ctx.fill()

        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(42, 168, 171, ${0.15 * (1 - distance / 80)})`
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
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

// Newsletter Component con efecto glow
function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <div className="relative group">
      {/* Glow effect background */}
      <div
        className={clsx(
          'absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500 via-sage-500 to-warm-500 opacity-0 blur-xl transition-opacity duration-700',
          (isFocused || subscribed) && 'opacity-30'
        )}
      />

      <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, rgba(42,168,171,0.3), rgba(109,137,88,0.3), rgba(214,142,45,0.3), rgba(42,168,171,0.3))',
            backgroundSize: '300% 100%',
            animation: 'gradientShift 3s ease infinite',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-2xl animate-bounce-soft">📬</span>
            Newsletter
          </h3>
          <p className="text-surface-400 text-sm mb-4">
            Tips de salud mental, recursos gratuitos y novedades de Cora.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 text-teal-400">
              <svg className="w-5 h-5 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">¡Gracias por suscribirte!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  required
                />
              </div>
              <Button type="submit" size="sm" className="whitespace-nowrap">
                Suscribirse
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// Social Icon con efecto magnético
function SocialIcon({ social }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={social.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'relative w-11 h-11 rounded-xl flex items-center justify-center text-lg overflow-hidden transition-all duration-300',
        'bg-surface-800/80 text-surface-400',
        'hover:text-white hover:scale-110 hover:-translate-y-1',
        'hover:shadow-lg hover:shadow-teal-500/30'
      )}
      aria-label={social.name}
    >
      {/* Animated gradient background */}
      <div
        className={clsx(
          'absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
          social.gradient,
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Glow effect */}
      <div
        className={clsx(
          'absolute inset-0 rounded-xl transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          boxShadow: '0 0 20px rgba(42,168,171,0.5)',
        }}
      />

      <span className="relative z-10">{social.icon}</span>
    </a>
  )
}

// Footer Link con efecto underline animado
function FooterLink({ link }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={link.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-center gap-2 text-sm text-surface-400 hover:text-teal-400 transition-colors duration-200 py-1.5"
    >
      <span className={clsx(
        'transition-all duration-300',
        isHovered ? 'opacity-100 scale-110' : 'opacity-50'
      )}>
        {link.icon}
      </span>
      <span className="relative">
        {link.label}
        {/* Animated underline */}
        <span
          className={clsx(
            'absolute left-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-teal-400 to-sage-400 transition-all duration-300 ease-out',
            isHovered ? 'w-full' : 'w-0'
          )}
        />
      </span>
    </a>
  )
}

// Trust Badge con glassmorphism
function TrustBadge({ icon, label, sublabel }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/0 to-sage-500/0 group-hover:from-teal-500/30 group-hover:to-sage-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/50 border border-surface-700/50 hover:border-teal-500/30 transition-colors">
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <div>
          <span className="text-xs text-surface-300 block">{label}</span>
          <span className="text-[10px] text-surface-500">{sublabel}</span>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-surface-900 dark:bg-surface-950 text-white pt-0 pb-8 mt-32 overflow-hidden">
      {/* CSS Keyframes */}
      <style>{`
        @keyframes aurora1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.1); }
          100% { transform: translate(-30px, 50px) scale(0.95); }
        }
        @keyframes aurora2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.15); }
          100% { transform: translate(60px, -20px) scale(0.9); }
        }
        @keyframes aurora3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 30px) scale(1.05); }
          66% { transform: translate(-20px, -40px) scale(1.1); }
          100% { transform: translate(40px, 20px) scale(0.95); }
        }
        @keyframes waveFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }
      `}</style>

      {/* Wave Animation */}
      <WaveBackground />

      {/* Aurora Background */}
      <AuroraBackground />

      {/* Particle Field */}
      <ParticleField />

      <div className="section-padding relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 py-16">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo con glow */}
            <div className="flex items-center gap-3 group">
              <div
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                  boxShadow: '0 0 30px rgba(42,168,171,0.4)',
                }}
              >
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black gradient-text">Cora</span>
                <span className="block text-xs text-surface-500">Terapia Profesional</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
              Conectamos personas con psicólogos certificados en Costa Rica y Latinoamérica.
              Tu bienestar mental, nuestra prioridad.
            </p>

            {/* Privacy Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(42,168,171,0.1), rgba(109,137,88,0.1))',
                borderColor: 'rgba(42,168,171,0.3)',
              }}
            >
              <span className="text-lg">🔒</span>
              <span className="text-xs font-medium text-teal-400">Ley 8968 Compliant</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <SocialIcon key={social.name} social={social} />
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="lg:col-span-2">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #2AA8AB, #6D8958)',
                  }}
                />
                {section}
              </h3>
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <NewsletterSignup />

            {/* Trust Badges Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <TrustBadge icon="🇨🇷" label="Costa Rica" sublabel="Sede principal" />
              <TrustBadge icon="🌎" label="Latinoamérica" sublabel="Expansión 2025" />
              <TrustBadge icon="🔐" label="SSL Seguro" sublabel="256-bit encryption" />
              <TrustBadge icon="⚡" label="99.9% Uptime" sublabel="Siempre disponible" />
            </div>
          </div>
        </div>

        {/* Divider con gradiente animado */}
        <div
          className="h-px my-8"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(42,168,171,0.5), rgba(109,137,88,0.5), rgba(214,142,45,0.5), transparent)',
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite',
          }}
        />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-surface-500 text-sm">
              © 2026 <span className="text-teal-400 font-semibold">Cora</span>. Todos los derechos reservados.
            </p>
            <span className="hidden md:inline text-surface-700">•</span>
            <p className="text-surface-500 text-sm flex items-center gap-1">
              Hecho con <span className="text-red-500 animate-pulse">❤️</span> para Latinoamérica
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-surface-500">
            <span className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              San José, Costa Rica
            </span>
            <span className="flex items-center gap-1.5 hover:text-teal-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              soporte@tucora.com
            </span>
          </div>
        </div>

        {/* Back to top button con efecto magnético */}
        <button
          onClick={scrollToTop}
          className={clsx(
            'fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white',
            'flex items-center justify-center transition-all duration-500 z-50',
            'hover:scale-110 hover:-translate-y-1',
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          )}
          style={{
            boxShadow: '0 0 30px rgba(42,168,171,0.4)',
          }}
          aria-label="Volver arriba"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
