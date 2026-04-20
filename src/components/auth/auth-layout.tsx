import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-[#EC1B2E] to-[#C20010]', className)}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
