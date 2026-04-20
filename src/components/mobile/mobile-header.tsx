import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MobileButton } from './mobile-button'
import { MoreHorizontal, X } from 'lucide-react'
import { MobileHeaderMenu } from './mobile-header-menu'

interface MobileHeaderProps {
  title?: string
  rightContent?: ReactNode
  showCloseButton?: boolean
  onCloseClick?: () => void
  variant?: 'default' | 'gradient'
  className?: string
  showMoreMenu?: boolean
}

export function MobileHeader({
  title,
  rightContent,
  showCloseButton = false,
  onCloseClick,
  variant = 'default',
  className,
  showMoreMenu = false
}: MobileHeaderProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-r from-[#EC1B2E] to-[#C20010] text-white'
  }


  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex h-16 items-center justify-between px-4 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-800/95',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {title && (
          <h1 className={cn(
            'text-lg font-semibold',
            variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
          )}>
            {title}
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {rightContent || (
          showCloseButton ? (
            <MobileButton
              variant="ghost"
              size="sm"
              onClick={onCloseClick}
              className="h-10 w-10 p-0"
            >
              <X className="h-5 w-5" />
            </MobileButton>
          ) : showMoreMenu ? (
            <MobileHeaderMenu />
          ) : (
            <MobileButton
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0"
            >
              <MoreHorizontal className="h-5 w-5" />
            </MobileButton>
          )
        )}
      </div>
    </header>
  )
}
