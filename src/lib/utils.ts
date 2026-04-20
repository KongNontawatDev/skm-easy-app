import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('th-TH').format(amount)
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }
  return date.toLocaleDateString('th-TH', defaultOptions)
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('th-TH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'วันนี้'
  } else if (diffDays === 1) {
    return 'เมื่อวาน'
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`
  } else {
    return formatDate(dateString)
  }
}

export function getStatusColor(status: string, type: 'status' | 'priority' | 'category' = 'status'): string {
  const colorMap = {
    status: {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
      defaulted: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
    },
    priority: {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700',
    },
    category: {
      payment: 'bg-blue-100 text-blue-700',
      promotion: 'bg-purple-100 text-purple-700',
      system: 'bg-gray-100 text-gray-700',
      reminder: 'bg-yellow-100 text-yellow-700',
      alert: 'bg-red-100 text-red-700',
      news: 'bg-blue-100 text-blue-700',
      tips: 'bg-green-100 text-green-700',
      announcement: 'bg-purple-100 text-purple-700',
      discount: 'bg-red-100 text-red-700',
      free_fee: 'bg-green-100 text-green-700',
      cashback: 'bg-blue-100 text-blue-700',
      special: 'bg-purple-100 text-purple-700',
    },
  }
  
  return colorMap[type][status as keyof typeof colorMap[typeof type]] || 'bg-gray-100 text-gray-700'
}

export function getStatusText(status: string, type: 'status' | 'priority' | 'category' = 'status'): string {
  const textMap = {
    status: {
      active: 'ใช้งานอยู่',
      completed: 'ชำระครบแล้ว',
      paid: 'ชำระแล้ว',
      pending: 'รอชำระ',
      overdue: 'เกินกำหนด',
      defaulted: 'ค้างชำระ',
      cancelled: 'ยกเลิกแล้ว',
      draft: 'ร่าง',
      sent: 'ส่งแล้ว',
      failed: 'ชำระไม่สำเร็จ',
      refunded: 'คืนเงิน',
    },
    priority: {
      urgent: 'ด่วนมาก',
      high: 'สูง',
      medium: 'ปานกลาง',
      low: 'ต่ำ',
    },
    category: {
      payment: 'การชำระเงิน',
      promotion: 'โปรโมชั่น',
      system: 'ระบบ',
      reminder: 'แจ้งเตือน',
      alert: 'แจ้งเตือน',
      news: 'ข่าวสาร',
      tips: 'เคล็ดลับ',
      announcement: 'ประกาศ',
      discount: 'ส่วนลด',
      free_fee: 'ฟรีค่าธรรมเนียม',
      cashback: 'คืนเงิน',
      special: 'พิเศษ',
    },
  }
  
  return textMap[type][status as keyof typeof textMap[typeof type]] || 'ไม่ทราบสถานะ'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}