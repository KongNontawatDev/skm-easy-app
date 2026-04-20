import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface SpendingCardProps {
  title: string
  amount: string
  change?: {
    value: string
    isPositive: boolean
  }
  icon?: ReactNode
  className?: string
}

export function SpendingCard({
  title,
  amount,
  change,
  icon,
  className
}: SpendingCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl p-4',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-center space-x-2">
          {icon}
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{amount}</div>
        
        {change && (
          <div className={cn(
            'flex items-center space-x-1 text-sm',
            change.isPositive ? 'text-green-600' : 'text-blue-600'
          )}>
            {change.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{change.value}</span>
          </div>
        )}
      </div>
    </div>
  )
}
