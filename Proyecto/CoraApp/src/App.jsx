import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUiStore } from './store/uiStore'
import { useAuthStore } from './store/authStore'

// Layouts
import { PublicLayout, DashboardLayout } from './components/layout/index'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Quiz from './pages/Quiz'
import MatchPreview from './pages/MatchPreview'
import PlanSelection from './pages/PlanSelection'
import TherapistSearch from './pages/TherapistSearch'
import Community from './pages/Community'

// Patient pages (dashboard layout)
import PatientDashboard from './pages/PatientDashboard'
import Appointments from './pages/Appointments'
import Payments from './pages/Payments'
import SessionRoom from './pages/SessionRoom'

// Therapist pages (dashboard layout)
import TherapistDashboard from './pages/TherapistDashboard'

// Admin pages (dashboard layout)
import AdminDashboard from './pages/admin/AdminDashboard'

// Protected route wrapper — uses profile.role from DB
function RequireAuth({ children, roles }) {
  const { isAuthenticated, profile, loading } = useAuthStore()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-cora flex items-center justify-center shadow-cora animate-pulse-soft">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
        </div>
        <p className="text-surface-400 text-sm font-medium">Cargando...</p>
      </div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/" replace />
  return children
}

// 404
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 text-center p-8">
      <div className="w-24 h-24 rounded-3xl bg-gradient-cora flex items-center justify-center text-4xl mb-6 shadow-cora-lg">
        😕
      </div>
      <h1 className="text-4xl font-black text-surface-900 dark:text-white mb-3">404 — Página no encontrada</h1>
      <p className="text-surface-500 mb-8 max-w-sm">Esta página no existe o fue movida. Verificá la URL.</p>
      <a href="/" className="px-6 py-3 bg-teal-500 text-white rounded-2xl font-semibold hover:bg-teal-600 transition-colors shadow-cora">
        Volver al inicio
      </a>
    </div>
  )
}

export default function App() {
  const { initTheme } = useUiStore()
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initTheme()
    initialize()  // Verifica sesión existente en Supabase
  }, [])

  return (
    <Routes>
      {/* Public routes (with Navbar + Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/psicologos" element={<TherapistSearch />} />
        <Route path="/comunidad" element={<Community />} />
      </Route>

      {/* Auth routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar-password" element={<div className="min-h-screen flex items-center justify-center"><p className="text-surface-400">Página en construcción</p></div>} />

      {/* Onboarding routes (no layout) */}
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/match" element={<MatchPreview />} />
      <Route path="/planes" element={<PlanSelection />} />

      {/* Session room (no layout — full screen) */}
      <Route path="/sesion/:roomId" element={
        <RequireAuth>
          <SessionRoom />
        </RequireAuth>
      } />

      {/* Patient routes (dashboard layout) */}
      <Route element={
        <RequireAuth roles={['patient']}>
          <DashboardLayout />
        </RequireAuth>
      }>
        <Route path="/paciente/dashboard" element={<PatientDashboard />} />
        <Route path="/citas" element={<Appointments />} />
        <Route path="/pagos" element={<Payments />} />
        <Route path="/mensajes" element={<div className="p-8 text-surface-400 text-center">Módulo de mensajes — próximamente</div>} />
        <Route path="/perfil" element={<div className="p-8 text-surface-400 text-center">Perfil — próximamente</div>} />
      </Route>

      {/* Psychologist routes (dashboard layout) */}
      <Route element={
        <RequireAuth roles={['psychologist']}>
          <DashboardLayout />
        </RequireAuth>
      }>
        <Route path="/psicologo/dashboard" element={<TherapistDashboard />} />
        <Route path="/pacientes" element={<div className="p-8 text-surface-400 text-center">Mis pacientes — próximamente</div>} />
        <Route path="/ganancias" element={<Payments />} />
      </Route>

      {/* Admin routes (dashboard layout) */}
      <Route element={
        <RequireAuth roles={['admin']}>
          <DashboardLayout />
        </RequireAuth>
      }>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<div className="p-8 text-surface-400 text-center">Gestión de usuarios — próximamente</div>} />
        <Route path="/admin/verificaciones" element={<div className="p-8 text-surface-400 text-center">Verificaciones — próximamente</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
