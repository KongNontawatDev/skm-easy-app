import { ArrowRight, ListOrdered } from 'lucide-react'
import type { AppGuideItem } from '../types'

interface GuideCardProps {
  guide: AppGuideItem
  onViewDetail: (guideId: string) => void
}

export function GuideCard({ guide, onViewDetail }: GuideCardProps) {
  return (
    <div
      className="cursor-pointer rounded-2xl bg-white p-4 transition-all duration-200 dark:bg-gray-800"
      onClick={() => onViewDetail(guide.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetail(guide.id)
        }
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="mr-2 line-clamp-2 flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {guide.title}
        </h3>
        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          ลำดับ {guide.sortOrder}
        </span>
      </div>

      <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{guide.excerpt}</p>

      <div className="mb-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <ListOrdered className="mr-1 h-3 w-3" />
        <span>คู่มือจากระบบ</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#EC1B2E]">อ่านคู่มือ</span>
        <ArrowRight className="h-4 w-4 text-[#EC1B2E]" />
      </div>
    </div>
  )
}
