import { clsx } from 'clsx'

export function Card({ children, className, hover = false, glass = false, glow = false, is3d = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-500 ease-out',
        glass
          ? 'glass-card shadow-soft-lg'
          : 'bg-white dark:bg-surface-900 border-surface-100 dark:border-surface-800 shadow-soft',
        hover && 'card-hover cursor-pointer',
        glow && 'card-glow',
        is3d && 'card-3d',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-5 border-b border-surface-100 dark:border-surface-800', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={clsx('px-6 py-4 border-t border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/50 rounded-b-2xl', className)} {...props}>
      {children}
    </div>
  )
}
