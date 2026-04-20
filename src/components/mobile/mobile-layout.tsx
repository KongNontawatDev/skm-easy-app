import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  showSafeArea?: boolean
}

export function MobileLayout({ 
  children, 
  className,
  showSafeArea = true 
}: MobileLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-white dark:bg-gray-900',
        className,
      )}
    >
      <div className="mx-auto max-w-lg min-h-screen">
        <div 
          className={cn(
            'min-h-screen bg-white dark:bg-gray-900',
            showSafeArea && 'mobile-safe-area'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
