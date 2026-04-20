import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { GuideCard } from './components/guide-card'
import { useRouter } from '@tanstack/react-router'
import { fetchPublicGuides } from '@/lib/cms-public-api'

export function Guide() {
  const router = useRouter()
  const { data: guides = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['public-guides'],
    queryFn: fetchPublicGuides,
  })

  const handleViewDetail = (guideId: string) => {
    router.navigate({ to: '/guide/$id', params: { id: guideId } })
  }

  return (
    <MobileLayout>
      <MobileHeader title="วิธีใช้งาน" showMoreMenu={true} />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">กำลังโหลดคู่มือ…</p>
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
          ) : guides.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} onViewDetail={handleViewDetail} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl" aria-hidden>
                  📖
                </span>
              </div>
              <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">ยังไม่มีคู่มือ</p>
              <p className="text-sm">เมื่อมีคู่มือในระบบ จะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/guide" />
    </MobileLayout>
  )
}
