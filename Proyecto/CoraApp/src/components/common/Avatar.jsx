import { clsx } from 'clsx'

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
}

function getInitials(firstName = '', lastName = '') {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

const colors = [
  'bg-teal-500', 'bg-sage-500', 'bg-warm-500',
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
]

function getColorFromName(name = '') {
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function Avatar({ src, firstName = '', lastName = '', size = 'md', className, verified = false, online = false }) {
  const initials = getInitials(firstName, lastName)
  const bgColor = getColorFromName(firstName)
  const name = firstName + ' ' + lastName

  return (
    <div className={clsx('relative flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name.trim()}
          className={clsx('rounded-full object-cover ring-2 ring-white dark:ring-surface-900', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-surface-900',
            bgColor,
            sizes[size]
          )}
        >
          {initials || '?'}
        </div>
      )}
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-teal-500 rounded-full p-0.5 ring-2 ring-white dark:ring-surface-900">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      {online && !verified && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-surface-900" />
      )}
    </div>
  )
}
