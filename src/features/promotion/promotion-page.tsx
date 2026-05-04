import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { PromotionCard } from './components/promotion-card'
import { fetchPublicPromotions } from '@/lib/cms-public-api'
import { useRouter } from '@tanstack/react-router'
import { ErrorState } from '@/components/shared/error-state'

export function Promotion() {
  const router = useRouter()
  const { data: promotions = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['public-promotions'],
    queryFn: fetchPublicPromotions,
  })

  const handleViewDetail = (promotionId: string) => {
    void router.navigate({ to: '/promotion/$id', params: { id: promotionId } })
  }

  return (
    <MobileLayout>
      <MobileHeader title="โปรโมชั่น" showMoreMenu={true} />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <PromotionCard key={i} isLoading={true} />
              ))}
            </div>
          ) : isError ? (
            <div className="py-10">
              <ErrorState
                title="โหลดโปรโมชั่นไม่สำเร็จ"
                onRetry={() => void refetch()}
              />
            </div>
          ) : promotions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {promotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl" aria-hidden>
                  🎉
                </span>
              </div>
              <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                ยังไม่มีโปรโมชั่น
              </p>
              <p className="text-sm">เมื่อมีโปรโมชั่นในระบบ จะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/promotion" />
    </MobileLayout>
  )
}
