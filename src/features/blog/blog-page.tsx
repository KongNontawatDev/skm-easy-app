import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { BlogCard } from './components/blog-card'
import { useRouter } from '@tanstack/react-router'
import { fetchPublicArticles } from '@/lib/cms-public-api'

export function Blog() {
  const router = useRouter()
  const { data: posts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['public-articles'],
    queryFn: fetchPublicArticles,
  })

  const handleViewDetail = (postId: string) => {
    router.navigate({ to: '/blog/$id', params: { id: postId } })
  }

  return (
    <MobileLayout>
      <MobileHeader title="ข่าวสาร/บทความ" showMoreMenu={true} />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">กำลังโหลดบทความ…</p>
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
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} onViewDetail={handleViewDetail} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl" aria-hidden>
                  📰
                </span>
              </div>
              <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">ยังไม่มีบทความ</p>
              <p className="text-sm">เมื่อมีการเผยแพร่บทความ จะแสดงที่นี่</p>
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/blog" />
    </MobileLayout>
  )
}
