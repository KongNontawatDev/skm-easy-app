import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
} from '@/components/mobile'
import { Calendar } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { fetchPublicArticleById } from '@/lib/cms-public-api'
import { useMarkArticleViewed } from '@/features/home/hooks/useMutation'

export function BlogDetail() {
  const { id } = useParams({ from: '/blog/$id' })
  const markArticleViewed = useMarkArticleViewed()

  const { data: post, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-article', id],
    queryFn: () => fetchPublicArticleById(id),
    enabled: !!id,
  })

  // Track view when article is loaded
  useEffect(() => {
    if (post && id) {
      markArticleViewed.mutate(id)
    }
    // We only want to track view once per article load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, !!post])

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
        <MobileHeader title="บทความ" />
        <MobileContent className="flex h-full items-center justify-center pb-20">
          <p className="text-sm text-gray-500">กำลังโหลด…</p>
        </MobileContent>
        <BottomNavigation currentPath="/blog" />
      </MobileLayout>
    )
  }

  if (isError || post === null || post === undefined) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบบทความ" />
        <MobileContent className="flex h-full flex-col items-center justify-center gap-3 pb-20">
          <p className="text-gray-500">
            {isError
              ? error instanceof Error
                ? error.message
                : 'โหลดไม่สำเร็จ'
              : 'ไม่พบบทความที่คุณต้องการ'}
          </p>
          {isError ? (
            <button type="button" className="text-sm text-[#EC1B2E] underline" onClick={() => void refetch()}>
              ลองอีกครั้ง
            </button>
          ) : null}
        </MobileContent>
        <BottomNavigation currentPath="/blog" />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <MobileHeader title="รายละเอียดบทความ" />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          <div className="relative aspect-[1200/630] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700">
            {post.coverImageUrl ? (
              <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">{post.title}</h1>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span>เผยแพร่ {formatDate(post.publishedAt)}</span>
            </div>

            <div
              className="cms-rich-content prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

        </div>
      </MobileContent>
      <BottomNavigation currentPath="/blog" />
    </MobileLayout>
  )
}
