import { create } from 'zustand'
import { supabase } from '../services/supabaseClient'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: true, // true al inicio para verificar sesión existente
  error: null,

  // Inicializar: verificar sesión existente + escuchar cambios
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await get().fetchProfile(session.user.id)
        set({
          user: session.user,
          profile,
          isAuthenticated: true,
          loading: false,
        })
      } else {
        set({ loading: false })
      }
    } catch (err) {
      console.error('Error inicializando auth:', err)
      set({ loading: false })
    }

    // Listener para cambios de sesión (login, logout, token refresh)
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await get().fetchProfile(session.user.id)
        set({ user: session.user, profile, isAuthenticated: true, error: null })
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, profile: null, isAuthenticated: false })
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        set({ user: session.user })
      }
    })
  },

  // Obtener perfil de la tabla profiles
  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error obteniendo perfil:', error)
      return null
    }
    return data
  },

  // Login con email y contraseña
  login: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      set({ loading: false, error: error.message })
      throw error
    }

    const profile = await get().fetchProfile(data.user.id)
    set({
      user: data.user,
      profile,
      isAuthenticated: true,
      loading: false,
    })
    return profile
  },

  // Registro nuevo usuario
  register: async ({ email, password, firstName, lastName, role = 'patient' }) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          role,
        },
      },
    })

    if (error) {
      set({ loading: false, error: error.message })
      throw error
    }

    set({ loading: false })
    return data
  },

  // Logout
  logout: async () => {
    set({ loading: true })
    await supabase.auth.signOut()
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    })
  },

  // Actualizar perfil
  updateProfile: async (updates) => {
    const userId = get().user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando perfil:', error)
      throw error
    }
    set({ profile: data })
    return data
  },

  // Limpiar error
  clearError: () => set({ error: null }),

  // Helpers
  isPatient: () => get().profile?.role === 'patient',
  isTherapist: () => get().profile?.role === 'psychologist',
  isAdmin: () => get().profile?.role === 'admin',
}))
