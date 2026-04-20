import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PromotionAd } from '../types'

interface PromotionBannerProps {
  promotions: PromotionAd[]
  className?: string
}

export function PromotionBanner({ promotions, className }: PromotionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissedPromotions, setDismissedPromotions] = useState<Set<string>>(new Set())

  const activePromotions = promotions.filter(p => p.isActive && !dismissedPromotions.has(p.id))

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromotions.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromotions.length) % activePromotions.length)
  }

  const dismissPromotion = (promotionId: string) => {
    setDismissedPromotions(prev => new Set([...prev, promotionId]))
    if (currentIndex >= activePromotions.length - 1) {
      setCurrentIndex(0)
    }
  }

  if (activePromotions.length === 0) {
    return null
  }

  const currentPromotion = activePromotions[currentIndex]

  return (
    <div className={`relative ${className}`}>
      <div className="p-4 bg-gradient-to-r from-[#EC1B2E] to-[#C20010] text-white rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">โปรโมชั่น</h3>
          <button
            onClick={() => dismissPromotion(currentPromotion.id)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-lg">{currentPromotion.title}</h4>
          <p className="text-white/90 text-sm">{currentPromotion.description}</p>
          
          {activePromotions.length > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={prevSlide}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex space-x-1">
                {activePromotions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextSlide}
                className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
