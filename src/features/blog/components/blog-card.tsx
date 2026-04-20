import { Calendar } from 'lucide-react'
import type { BlogPost } from '../types'

interface BlogCardProps {
  post: BlogPost
  onViewDetail: (postId: string) => void
}

export function BlogCard({ post, onViewDetail }: BlogCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-200 dark:bg-gray-800"
      onClick={() => onViewDetail(post.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetail(post.id)
        }
      }}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {post.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <span className="font-medium text-[#EC1B2E]">อ่านต่อ</span>
        </div>
      </div>
    </div>
  )
}
