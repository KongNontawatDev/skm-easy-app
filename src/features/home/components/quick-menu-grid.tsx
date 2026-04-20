/**
 * 📌 ไฟล์นี้ทำหน้าที่อะไร
 * - แสดงเมนูลัดหน้าแรก (grid) และนำทางด้วย TanStack Router
 * - ห่อด้วย `memo` เพื่อลด re-render เมื่อ parent อัปเดตแต่รายการเมนูไม่เปลี่ยน
 */
import { memo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { QuickMenuItem } from '../types'

interface QuickMenuGridProps {
  items: QuickMenuItem[]
  className?: string
}

export const QuickMenuGrid = memo(function QuickMenuGrid({ items, className }: QuickMenuGridProps) {
  const router = useRouter()

  const handleItemClick = (item: QuickMenuItem) => {
    if (item.disabled) {
      toast.info('ฟีเจอร์นี้ยังไม่เปิดให้บริการ เร็วๆ นี้')
      return
    }
    router.navigate({ to: item.path })
  }

  return (
    <div className={`grid grid-cols-3 gap-1 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`relative p-3 text-center transition-colors duration-200 rounded-full ${
            item.disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => handleItemClick(item)}
        >
          <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${item.color} flex items-center justify-center ${item.disabled ? 'grayscale' : ''}`}>
            <span className="text-2xl">{item.icon}</span>
          </div>
          <p className={`text-sm font-semibold ${item.disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {item.title}
          </p>
          {item.disabled && (
            <span className="mt-0.5 block text-[10px] text-gray-400 dark:text-gray-500">
              เร็วๆ นี้
            </span>
          )}
        </div>
      ))}
    </div>
  )
})
