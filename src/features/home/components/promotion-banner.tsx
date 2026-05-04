import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/shared/error-state'
import type { PromotionAd } from '../types'

interface PromotionBannerProps {
  promotions: PromotionAd[]
  className?: string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function PromotionBanner({
  promotions,
  className,
  isLoading,
  isError,
  onRetry,
}: PromotionBannerProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissedPromotions, setDismissedPromotions] = useState<Set<string>>(
    new Set()
  )

  const activePromotions = promotions.filter(
    (p) => p.isActive && !dismissedPromotions.has(p.id)
  )

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromotions.length)
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + activePromotions.length) % activePromotions.length
    )
  }

  const dismissPromotion = (promotionId: string) => {
    setDismissedPromotions((prev) => new Set([...prev, promotionId]))
    if (currentIndex >= activePromotions.length - 1) {
      setCurrentIndex(0)
    }
  }

  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className='h-40 w-full rounded-2xl' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={className}>
        <ErrorState title='โหลดโปรโมชั่นไม่สำเร็จ' onRetry={onRetry} />
      </div>
    )
  }

  if (activePromotions.length === 0) {
    return null
  }

  const currentPromotion = activePromotions[currentIndex]

  return (
    <div className={`relative ${className}`}>
      <div className='rounded-2xl bg-gradient-to-r from-[#EC1B2E] to-[#C20010] p-4 text-white'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>ประกาศ</h3>
          <button
            onClick={() => dismissPromotion(currentPromotion.id)}
            className='rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='space-y-3'>
          <div
            className='cursor-pointer space-y-3'
            onClick={() =>
              router.navigate({
                to: '/promotion/$id',
                params: { id: currentPromotion.id },
              })
            }
          >
            <h4 className='text-lg font-semibold'>{currentPromotion.title}</h4>
            <p className='line-clamp-2 text-sm text-white/90'>
              {currentPromotion.description}
            </p>
          </div>

          {activePromotions.length > 1 && (
            <div className='flex items-center justify-between'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevSlide()
                }}
                className='rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30'
              >
                <ChevronLeft className='h-4 w-4' />
              </button>

              <div className='flex space-x-1'>
                {activePromotions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextSlide()
                }}
                className='rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30'
              >
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
