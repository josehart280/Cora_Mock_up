import { clsx } from 'clsx'

const variants = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-cora hover:shadow-cora-lg',
  secondary: 'bg-white hover:bg-surface-50 dark:bg-surface-900 dark:hover:bg-surface-800 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800',
  ghost: 'bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  sage: 'bg-sage-500 hover:bg-sage-600 text-white',
  warm: 'bg-warm-500 hover:bg-warm-600 text-white',
  dark: 'bg-surface-900 hover:bg-surface-800 text-white dark:bg-white dark:hover:bg-surface-100 dark:text-surface-900',
  glass: 'glass hover:bg-white/90 dark:hover:bg-surface-900/90 text-surface-900 dark:text-white',
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
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-200 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100',
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
      {children}
      {!loading && rightIcon}
    </button>
  )
}
