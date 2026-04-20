import { cn, getStatusColor, getStatusText } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'priority' | 'category'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatusBadge({
  status,
  type = 'status',
  size = 'md',
  className,
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        getStatusColor(status, type),
        sizeClasses[size],
        className
      )}
    >
      {getStatusText(status, type)}
    </span>
  )
}
