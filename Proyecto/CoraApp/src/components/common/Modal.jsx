import { useEffect } from 'react'
import { clsx } from 'clsx'
import { Button } from './Button'

export function Modal({ isOpen, onClose, title, children, size = 'md', className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={clsx(
          'relative w-full bg-white dark:bg-surface-900 rounded-3xl shadow-2xl animate-scale-in overflow-hidden',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        <p className="text-surface-600 dark:text-surface-400">{message}</p>
        <div className="flex gap-3 mt-6">
          <Button variant="ghost" fullWidth onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant} fullWidth onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
