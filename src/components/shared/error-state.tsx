import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'เกิดข้อผิดพลาด',
  message = 'ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30',
        className
      )}
    >
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 border-red-200 hover:bg-red-100 text-red-700 dark:border-red-800 dark:hover:bg-red-900/40 dark:text-red-400"
        >
          <RefreshCcw className="w-4 h-4" />
          ลองใหม่อีกครั้ง
        </Button>
      )}
    </div>
  )
}
