import { useQuery } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
} from '@/components/mobile'
import { Calendar } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { fetchPublicPromotionById } from '@/lib/cms-public-api'

export function PromotionDetail() {
  const { id } = useParams({ from: '/promotion/$id' })

  const { data: promotion, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-promotion', id],
    queryFn: () => fetchPublicPromotionById(id),
    enabled: Boolean(id),
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="โปรโมชั่น" />
        <MobileContent className="flex h-full items-center justify-center pb-20">
          <p className="text-sm text-gray-500">กำลังโหลด…</p>
        </MobileContent>
        <BottomNavigation currentPath="/promotion" />
      </MobileLayout>
    )
  }

  if (isError || promotion === null || promotion === undefined) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบโปรโมชั่น" />
        <MobileContent className="flex h-full flex-col items-center justify-center gap-3 pb-20">
          <p className="text-gray-500">
            {isError
              ? error instanceof Error
                ? error.message
                : 'โหลดไม่สำเร็จ'
              : 'ไม่พบโปรโมชั่นที่คุณต้องการ'}
          </p>
          {isError ? (
            <button type="button" className="text-sm text-[#EC1B2E] underline" onClick={() => void refetch()}>
              ลองอีกครั้ง
            </button>
          ) : null}
        </MobileContent>
        <BottomNavigation currentPath="/promotion" />
      </MobileLayout>
    )
  }

  const end = promotion.endDate ? new Date(promotion.endDate) : null
  const isExpired = end ? end.getTime() < Date.now() : false

  return (
    <MobileLayout>
      <MobileHeader title="รายละเอียดโปรโมชั่น" />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700">
            {promotion.imageUrl ? (
              <img src={promotion.imageUrl} alt={promotion.title} className="w-full h-auto" />
            ) : null}
            {isExpired ? (
              <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                หมดอายุแล้ว
              </span>
            ) : null}
          </div>

          <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
            <h1 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">{promotion.title}</h1>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 shrink-0" />
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
            <div
              className="cms-rich-content prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: promotion.descriptionHtml }}
            />
          </div>

        </div>
      </MobileContent>
      <BottomNavigation currentPath="/promotion" />
    </MobileLayout>
  )
}
