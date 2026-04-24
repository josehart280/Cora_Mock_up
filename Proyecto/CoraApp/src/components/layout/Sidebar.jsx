import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useUiStore } from '../../store/uiStore'
import { Avatar } from '../common/Avatar'

const patientNav = [
  {
    label: 'Dashboard', href: '/paciente/dashboard',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    label: 'Mis citas', href: '/citas',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  {
    label: 'Mensajes', href: '/mensajes',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    badge: 1,
  },
  {
    label: 'Pagos', href: '/pagos',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
  },
  {
    label: 'Comunidad', href: '/comunidad',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  },
  {
    label: 'Psicólogos', href: '/psicologos',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  },
]

const therapistNav = [
  {
    label: 'Dashboard', href: '/psicologo/dashboard',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    label: 'Mis pacientes', href: '/pacientes',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    badge: 5,
  },
  {
    label: 'Agenda', href: '/citas',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  {
    label: 'Ganancias', href: '/ganancias',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    label: 'Comunidad', href: '/comunidad',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  },
]

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { label: 'Usuarios', href: '/admin/usuarios', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, badge: 12 },
  { label: 'Verificaciones', href: '/admin/verificaciones', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
]

export default function Sidebar() {
  const { profile, logout } = useAuthStore()
  const { sidebarOpen } = useUiStore()
  const navigate = useNavigate()

  const navItems = profile?.role === 'admin' ? adminNav :
    profile?.role === 'psychologist' ? therapistNav : patientNav

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className={clsx(
      'fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-100 dark:border-surface-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-cora flex-shrink-0 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        {sidebarOpen && <span className="text-lg font-bold gradient-text">Cora</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/admin' || item.href.endsWith('dashboard')}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative group',
                isActive
                  ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
              {item.badge && (
                <span className={clsx(
                  'absolute bg-teal-500 text-white text-xs font-bold rounded-full flex items-center justify-center',
                  sidebarOpen ? 'right-3 top-2 min-w-5 h-5 px-1' : 'right-1 top-1 w-4 h-4'
                )}>
                  {item.badge}
                </span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-surface-100 dark:border-surface-800">
        <NavLink to="/perfil" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors mb-1">
          <Avatar firstName={profile?.first_name} lastName={profile?.last_name} size="sm" />
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-800 dark:text-white truncate">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-xs text-surface-400 truncate">{profile?.email}</p>
            </div>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
            !sidebarOpen && 'justify-center'
          )}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {sidebarOpen && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
