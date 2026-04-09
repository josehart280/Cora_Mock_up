import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { useUiStore } from '../../store/uiStore'
import { ToastContainer } from '../common/index'

export function PublicLayout() {
  const { toasts, removeToast } = useUiStore()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export function DashboardLayout() {
  const { sidebarOpen, toggleSidebar, toasts, removeToast } = useUiStore()
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-16'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 glass border-b border-surface-100 dark:border-surface-800 flex items-center px-6 gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          {/* Notifications bell */}
          <button className="relative p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>
        <main className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
