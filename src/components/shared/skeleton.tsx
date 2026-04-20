import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ 
  className, 
  width, 
  height, 
  rounded = true 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        rounded && 'rounded',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton height="1.25rem" width="60%" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <Skeleton height="1.5rem" width="4rem" rounded />
      </div>
      <Skeleton height="8rem" width="100%" rounded />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton height="1rem" width="30%" />
          <Skeleton height="1rem" width="25%" />
        </div>
        <div className="flex justify-between">
          <Skeleton height="1rem" width="35%" />
          <Skeleton height="1rem" width="30%" />
        </div>
      </div>
      <Skeleton height="0.5rem" width="100%" rounded />
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
