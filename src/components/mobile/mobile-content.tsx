import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileContentProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function MobileContent({ 
  children, 
  className,
  padding = true 
}: MobileContentProps) {
  return (
    <main
      className={cn(
        'flex-1',
        padding && 'p-4',
        className
      )}
    >
      {children}
    </main>
  )
}
