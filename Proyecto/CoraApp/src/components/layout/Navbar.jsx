import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'

const publicNavLinks = [
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Nuestros psicólogos', href: '/psicologos' },
  { label: 'Precios', href: '/#precios' },
  { label: 'Comunidad', href: '/comunidad' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { profile, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useUiStore()
  const navigate = useNavigate()

  // Efecto para navegar al login cuando el usuario cierra sesión
  useEffect(() => {
    if (!isAuthenticated && isLoggingOut) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoggingOut, navigate])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setIsLoggingOut(true)
    await logout()
  }

  const dashboardPath = profile?.role === 'admin' ? '/admin' :
    profile?.role === 'psychologist' ? '/psicologo/dashboard' : '/paciente/dashboard'

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled ? 'glass shadow-glass' : 'bg-transparent'
    )}>
      <div className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-cora flex items-center justify-center shadow-cora group-hover:shadow-cora-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">Cora</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {publicNavLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                >
                  <Avatar firstName={profile?.first_name} lastName={profile?.last_name} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {profile?.first_name}
                  </span>
                  <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-100 dark:border-surface-800 z-20 animate-slide-down overflow-hidden">
                      <div className="p-3 border-b border-surface-100 dark:border-surface-800">
                        <p className="font-semibold text-surface-900 dark:text-white text-sm">{profile?.first_name} {profile?.last_name}</p>
                        <p className="text-xs text-surface-400 truncate">{profile?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to={dashboardPath} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          Dashboard
                        </Link>
                        <Link to="/perfil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Mi perfil
                        </Link>
                        <Link to="/citas" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Mis citas
                        </Link>
                      </div>
                      <div className="p-2 border-t border-surface-100 dark:border-surface-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button size="sm" onClick={() => navigate('/registro')}>
                  Empezá gratis
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {publicNavLinks.map(link => (
                <a key={link.href} href={link.href} className="px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
                  {link.label}
                </a>
              ))}
              {!isAuthenticated && (
                <>
                  <Button variant="ghost" size="sm" fullWidth onClick={() => { navigate('/login'); setMobileOpen(false) }} className="mt-2">
                    Iniciar sesión
                  </Button>
                  <Button size="sm" fullWidth onClick={() => { navigate('/registro'); setMobileOpen(false) }}>
                    Empezá gratis
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
