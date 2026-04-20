import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  icon: ReactNode
  title: string
  description?: string
  amount: string
  isPositive?: boolean
  className?: string
}

export function TransactionItem({
  icon,
  title,
  description,
  amount,
  isPositive = false,
  className
}: TransactionItemProps) {
  return (
    <div className={cn(
      'flex items-center space-x-3 py-3',
      className
    )}>
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{title}</div>
        {description && (
          <div className="text-xs text-gray-500 truncate">{description}</div>
        )}
      </div>
      
      <div className={cn(
        'text-sm font-semibold',
        isPositive ? 'text-green-600' : 'text-red-600'
      )}>
        {isPositive ? '+' : '-'}{amount}
      </div>
    </div>
  )
}
