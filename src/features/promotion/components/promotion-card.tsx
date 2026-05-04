import { Calendar } from 'lucide-react'
import type { PromotionListItem } from '../types'
import { Skeleton } from '@/components/ui/skeleton'

interface PromotionCardProps {
  promotion?: PromotionListItem
  onViewDetail?: (promotionId: string) => void
  isLoading?: boolean
}

export function PromotionCard({ promotion, onViewDetail, isLoading }: PromotionCardProps) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!promotion) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const end = promotion.endDate ? new Date(promotion.endDate) : null
  const isExpired = end ? end.getTime() < Date.now() : false

  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-200 dark:bg-gray-800 ${
        isExpired ? 'opacity-60' : ''
      }`}
      onClick={() => onViewDetail?.(promotion.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetail?.(promotion.id)
        }
      }}
    >
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {promotion.imageUrl ? (
          <img
            src={promotion.imageUrl}
            alt={promotion.title}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {promotion.title}
        </h3>

        <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {promotion.descriptionPlain}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>
              {promotion.startDate || promotion.endDate ? (
                <>
                  {formatDate(promotion.startDate)} — {formatDate(promotion.endDate)}
                </>
              ) : (
                'ไม่ระบุระยะเวลา'
              )}
            </span>
          </div>
          {isExpired ? (
            <span className="font-medium text-red-500 dark:text-red-400">หมดอายุแล้ว</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
