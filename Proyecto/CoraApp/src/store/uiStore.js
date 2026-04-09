import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      activeModal: null,
      toasts: [],

      toggleTheme: () =>
        set(state => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
          return { theme: newTheme }
        }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      openModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),

      addToast: (toast) => {
        const id = Date.now()
        set(state => ({ toasts: [...state.toasts, { ...toast, id }] }))
        setTimeout(() => {
          set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
        }, 4000)
      },

      removeToast: (id) =>
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

      initTheme: () => {
        const stored = localStorage.getItem('cora-ui')
        const theme = stored ? JSON.parse(stored).state?.theme : 'light'
        if (theme === 'dark') document.documentElement.classList.add('dark')
      },
    }),
    {
      name: 'cora-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
