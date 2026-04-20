import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { PromotionCard } from './components/promotion-card'
import { fetchPublicPromotions } from '@/lib/cms-public-api'
import { useRouter } from '@tanstack/react-router'

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
            <p className="py-10 text-center text-sm text-gray-500">กำลังโหลดโปรโมชั่น…</p>
          ) : isError ? (
            <div className="py-10 text-center text-sm text-red-600">
              <p>โหลดข้อมูลไม่สำเร็จ</p>
              <button
                type="button"
                className="mt-2 text-[#EC1B2E] underline"
                onClick={() => void refetch()}
              >
                ลองอีกครั้ง
              </button>
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
