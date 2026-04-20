import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface MobileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    const variantClasses = {
      default: 'bg-mobile-surface',
      filled: 'bg-mobile-surface-variant',
      outlined: 'bg-transparent'
    }

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-mobile-text-primary">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-mobile-text-tertiary">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl px-4 py-3 text-mobile-text-primary placeholder:text-mobile-text-tertiary focus:outline-none transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'ring-2 ring-mobile-error/20',
              variantClasses[variant],
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-mobile-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-mobile-error">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-mobile-text-tertiary">{helperText}</p>
        )}
      </div>
    )
  }
)

MobileInput.displayName = 'MobileInput'
