import { clsx } from 'clsx'

const variants = {
  primary: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-cora hover:shadow-cora-lg hover:shadow-glow-teal',
  secondary: 'bg-white/90 hover:bg-white dark:bg-surface-800/90 dark:hover:bg-surface-800 text-teal-600 dark:text-teal-400 border-2 border-teal-200/50 dark:border-teal-700/50 hover:border-teal-300 dark:hover:border-teal-600 backdrop-blur-sm',
  ghost: 'bg-transparent hover:bg-teal-50/80 dark:hover:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-transparent hover:border-teal-200 dark:hover:border-teal-800',
  danger: 'bg-gradient-to-r from-coral-500 to-red-600 hover:from-coral-400 hover:to-red-500 text-white shadow-lg hover:shadow-coral-500/30',
  sage: 'bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-400 hover:to-sage-500 text-white shadow-lg hover:shadow-sage-500/30',
  warm: 'bg-gradient-to-r from-warm-500 to-warm-600 hover:from-warm-400 hover:to-warm-500 text-white shadow-lg hover:shadow-warm-500/30',
  dark: 'bg-gradient-to-r from-surface-800 to-surface-900 hover:from-surface-700 hover:to-surface-800 text-white shadow-lg dark:bg-white dark:from-white dark:to-surface-100 dark:hover:from-surface-100 dark:hover:to-white dark:text-surface-900',
  glass: 'glass-card hover:bg-white/95 dark:hover:bg-surface-900/95 text-surface-900 dark:text-white',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
  xl: 'px-10 py-5 text-lg rounded-2xl',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  shine = false,
  magnetic = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-surface-50 dark:focus:ring-offset-surface-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none',
        shine && 'btn-shine',
        magnetic && 'btn-magnetic',
        !disabled && !loading && 'hover:-translate-y-0.5 active:translate-y-0',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      <span className="relative z-10">{children}</span>
      {!loading && rightIcon}
    </button>
  )
}
