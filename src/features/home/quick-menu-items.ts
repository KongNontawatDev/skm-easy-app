import type { QuickMenuItem } from './types'

/** เมนูลัดของแอป — ค่าคงที่ของ UI ไม่ใช่ข้อมูลธุรกิจจาก mock */
export const quickMenuItems: QuickMenuItem[] = [
  { id: '1', title: 'โปรโมชั่น', icon: '🎉', path: '/promotion', color: 'bg-red-50 text-red-600' },
  { id: '2', title: 'ติดต่อร้าน', icon: '📞', path: '/contact', color: 'bg-orange-50 text-orange-600' },
  { id: '3', title: 'ข่าวสาร', icon: '📋', path: '/blog', color: 'bg-indigo-50 text-indigo-600' },
  {
    id: '4',
    title: 'รีไฟแนน',
    icon: '💰',
    path: '/refinance-check',
    color: 'bg-green-50 text-green-600',
    disabled: true,
  },
  {
    id: '5',
    title: 'เช็คเครดิต',
    icon: '📊',
    path: '/credit-check',
    color: 'bg-blue-50 text-blue-600',
    disabled: true,
  },
  {
    id: '6',
    title: 'คูปอง',
    icon: '🎫',
    path: '/coupon',
    color: 'bg-yellow-50 text-yellow-600',
    disabled: true,
  },
]
