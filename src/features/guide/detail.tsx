import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
} from '@/components/mobile'
import { useParams } from '@tanstack/react-router'
import { fetchPublicGuideById } from '@/lib/cms-public-api'
import { useMarkGuideViewed } from '@/features/home/hooks/useMutation'

export function GuideDetail() {
  const { id } = useParams({ from: '/guide/$id' })
  const markGuideViewed = useMarkGuideViewed()

  const { data: guide, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-guide', id],
    queryFn: () => fetchPublicGuideById(id),
    enabled: !!id,
  })

  // Track view when guide is loaded
  useEffect(() => {
    if (guide && id) {
      markGuideViewed.mutate(id)
    }
    // We only want to track view once per guide load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, !!guide])

  if (isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="คู่มือ" />
        <MobileContent className="flex h-full items-center justify-center pb-20">
          <p className="text-sm text-gray-500">กำลังโหลด…</p>
        </MobileContent>
        <BottomNavigation currentPath="/guide" />
      </MobileLayout>
    )
  }

  if (isError || guide === null || guide === undefined) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบคู่มือ" />
        <MobileContent className="flex h-full flex-col items-center justify-center gap-3 pb-20">
          <p className="text-gray-500">
            {isError
              ? error instanceof Error
                ? error.message
                : 'โหลดไม่สำเร็จ'
              : 'ไม่พบคู่มือที่คุณต้องการ'}
          </p>
          {isError ? (
            <button type="button" className="text-sm text-[#EC1B2E] underline" onClick={() => void refetch()}>
              ลองอีกครั้ง
            </button>
          ) : null}
        </MobileContent>
        <BottomNavigation currentPath="/guide" />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader title="รายละเอียดคู่มือ" />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{guide.title}</h1>
            <p className="mb-4 text-sm text-gray-500">ลำดับการแสดง: {guide.sortOrder}</p>
            <div
              className="cms-rich-content prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </div>

          <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <div className="flex justify-between">
              <span>สร้างเมื่อ</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(guide.createdAt).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>อัปเดตล่าสุด</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(guide.updatedAt).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

        </div>
      </MobileContent>
      <BottomNavigation currentPath="/guide" />
    </MobileLayout>
  )
}
