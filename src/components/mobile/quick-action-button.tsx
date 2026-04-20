import {type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface QuickActionButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  className?: string
}

export function QuickActionButton({
  icon,
  label,
  onClick,
  className
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center space-y-2 p-4 bg-white rounded-2xl transition-all duration-200 hover:bg-gray-50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  )
}
