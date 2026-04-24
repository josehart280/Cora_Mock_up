import { forwardRef } from 'react'
import { clsx } from 'clsx'

export const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className, floating = false, ...props },
  ref
) {
  return (
    <div className={clsx('w-full', floating && 'input-floating')}>
      {label && !floating && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label}
          {props.required && <span className="text-coral-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-teal-500 transition-colors duration-200">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'input-base',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-coral-400 dark:border-coral-500 focus:ring-coral-400/20 focus:border-coral-400',
            floating && 'placeholder-transparent',
            className
          )}
          {...props}
        />
        {floating && label && (
          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm transition-all duration-200 pointer-events-none origin-left group-focus-within:-translate-y-[2.2rem] group-focus-within:scale-75 group-focus-within:text-teal-600">
            {label}
            {props.required && <span className="text-coral-500">*</span>}
          </label>
        )}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-coral-500 flex items-center gap-1.5 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-surface-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {hint}
        </p>
      )}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, rows = 4, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'input-base resize-none',
          error && 'border-red-400 dark:border-red-500 focus:ring-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-surface-400">{hint}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx('input-base', error && 'border-red-400', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-surface-400">{hint}</p>}
    </div>
  )
})
