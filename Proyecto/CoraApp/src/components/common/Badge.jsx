import { clsx } from 'clsx'

const colors = {
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  sage: 'bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400',
  warm: 'bg-warm-100 text-warm-700 dark:bg-warm-900/30 dark:text-warm-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  gray: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
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
