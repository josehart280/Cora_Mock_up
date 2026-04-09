import { clsx } from 'clsx'

export function StarRating({ rating, max = 5, size = 'sm', showValue = false }) {
  const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={clsx(
            sizes[size],
            i < Math.floor(rating) ? 'text-yellow-400' : 'text-surface-200 dark:text-surface-700'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-surface-700 dark:text-surface-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <svg className={clsx('animate-spin text-teal-500', sizes[size], className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-2xl flex items-center justify-center mb-4 text-teal-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-2">{title}</h3>
      {description && <p className="text-surface-500 dark:text-surface-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}

export function Divider({ label, className }) {
  if (!label) return <hr className={clsx('border-surface-100 dark:border-surface-800', className)} />
  return (
    <div className={clsx('relative', className)}>
      <hr className="border-surface-100 dark:border-surface-800" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-surface-900 px-3 text-xs text-surface-400">
        {label}
      </span>
    </div>
  )
}

export function ProgressBar({ value, max = 100, color = 'teal', className }) {
  const pct = Math.min((value / max) * 100, 100)
  const colors = {
    teal: 'bg-teal-500',
    sage: 'bg-sage-500',
    warm: 'bg-warm-500',
    red: 'bg-red-500',
  }
  return (
    <div className={clsx('w-full h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500', colors[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={clsx('shimmer rounded-xl', className)} />
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-start gap-3 p-4 rounded-2xl shadow-lg animate-slide-up',
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'success' ? 'bg-teal-500 text-white' :
            toast.type === 'warning' ? 'bg-warm-500 text-white' :
            'bg-surface-900 dark:bg-white text-white dark:text-surface-900'
          )}
        >
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="opacity-70 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
