import { clsx } from 'clsx'

const colors = {
  teal: 'bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 dark:from-teal-900/40 dark:to-teal-900/20 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/30',
  sage: 'bg-gradient-to-r from-sage-100 to-sage-50 text-sage-700 dark:from-sage-900/40 dark:to-sage-900/20 dark:text-sage-300 border border-sage-200/50 dark:border-sage-700/30',
  warm: 'bg-gradient-to-r from-warm-100 to-warm-50 text-warm-700 dark:from-warm-900/40 dark:to-warm-900/20 dark:text-warm-300 border border-warm-200/50 dark:border-warm-700/30',
  red: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 border border-red-200/50 dark:border-red-700/30',
  green: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-200/50 dark:border-green-700/30',
  yellow: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 dark:from-yellow-900/40 dark:to-yellow-900/20 dark:text-yellow-300 border border-yellow-200/50 dark:border-yellow-700/30',
  gray: 'bg-gradient-to-r from-surface-100 to-surface-50 text-surface-600 dark:from-surface-800 dark:to-surface-800/80 dark:text-surface-300 border border-surface-200/50 dark:border-surface-700/30',
  blue: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/40 dark:to-blue-900/20 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30',
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  in_progress: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

const statusLabels = {
  scheduled: 'Agendada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  in_progress: 'En curso',
  pending: 'Pendiente',
  active: 'Activo',
  inactive: 'Inactivo',
}

export function Badge({ children, color = 'teal', className, dot = false, ...props }) {
  return (
    <span
      className={clsx('badge', colors[color], className)}
      {...props}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', {
          'bg-teal-500': color === 'teal',
          'bg-green-500': color === 'green',
          'bg-red-500': color === 'red',
          'bg-yellow-500': color === 'yellow',
        })} />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }) {
  return (
    <span className={clsx('badge', statusColors[status], className)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-blue-500': status === 'scheduled',
        'bg-green-500': status === 'completed' || status === 'active',
        'bg-red-500': status === 'cancelled',
        'bg-teal-500': status === 'in_progress',
        'bg-yellow-500': status === 'pending',
        'bg-gray-500': status === 'inactive',
      })} />
      {statusLabels[status] || status}
    </span>
  )
}

export function RoleBadge({ role, className }) {
  const config = {
    patient: { label: 'Paciente', color: 'teal' },
    psychologist: { label: 'Psicólogo', color: 'sage' },
    admin: { label: 'Admin', color: 'warm' },
  }
  const { label, color } = config[role] || { label: role, color: 'gray' }
  return <Badge color={color} className={className}>{label}</Badge>
}
