import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileAvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'rounded' | 'square'
  children?: ReactNode
  className?: string
}

export function MobileAvatar({
  src,
  alt,
  fallback,
  size = 'md',
  variant = 'default',
  children,
  className
}: MobileAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  }

  const variantClasses = {
    default: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center bg-mobile-primary text-white font-semibold overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{fallback || children}</span>
      )}
    </div>
  )
}
