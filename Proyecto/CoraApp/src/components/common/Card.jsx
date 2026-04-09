import { clsx } from 'clsx'

export function Card({ children, className, hover = false, glass = false, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border',
        glass
          ? 'glass shadow-glass'
          : 'bg-white dark:bg-surface-900 border-surface-100 dark:border-surface-800 shadow-sm',
        hover && 'card-hover cursor-pointer',
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
