// import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Bell } from 'lucide-react'

interface BalanceCardProps {
  balance: string
  label?: string
  showBalance?: boolean
  onToggleVisibility?: () => void
  notifications?: number
  className?: string
}

export function BalanceCard({
  balance,
  label = "Available Balance",
  showBalance = true,
  onToggleVisibility,
  notifications = 0,
  className
}: BalanceCardProps) {
  return (
    <div className={cn(
      'mobile-gradient-primary rounded-2xl p-6 text-white relative',
      className
    )}>
      {/* Notifications */}
      {notifications > 0 && (
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-white/80" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{notifications}</span>
            </div>
          </div>
        </div>
      )}

      {/* Balance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white/80 text-sm font-medium">{label}</h3>
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showBalance ? (
                <Eye className="h-4 w-4 text-white/80" />
              ) : (
                <EyeOff className="h-4 w-4 text-white/80" />
              )}
            </button>
          )}
        </div>
        
        <div className="text-3xl font-bold text-white">
          {showBalance ? balance : "••••••"}
        </div>
      </div>
    </div>
  )
}
