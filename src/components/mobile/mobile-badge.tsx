import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileBadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MobileBadge({
  children,
  variant = 'default',
  size = 'md',
  className
}: MobileBadgeProps) {
  const variantClasses = {
    default: 'bg-mobile-primary text-white',
    success: 'bg-mobile-success text-white',
    warning: 'bg-mobile-warning text-white',
    error: 'bg-mobile-error text-white',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
