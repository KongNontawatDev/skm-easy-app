import type { ContactInfo } from '../types'

/**
 * ข้อมูลติดต่อร้าน/บริษัทแบบคงที่ (แก้ค่าในไฟล์นี้ได้โดยตรง)
 * ลิงก์โซเชียล — ใส่ URL จริงใน externalUrl เมื่อพร้อม
 */
export const FIXED_STORE_CONTACT: ContactInfo[] = [
  {
    id: 'email',
    type: 'email',
    title: 'อีเมล',
    value: 'support@skm-easy.com',
    description: 'ตอบกลับภายใน 24 ชั่วโมง',
    isActive: true,
  },
  {
    id: 'address',
    type: 'address',
    title: 'ที่อยู่',
    value: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
    description: 'สำนักงานใหญ่ SKM Easy Payment',
    isActive: true,
  },
  {
    id: 'hours',
    type: 'hours',
    title: 'เวลาทำการ',
    value: 'จันทร์–ศุกร์ 08:00–17:00',
    description: 'เสาร์–อาทิตย์ ปิดทำการ',
    isActive: true,
  },
  {
    id: 'facebook',
    type: 'social',
    title: 'Facebook',
    value: 'SKM Easy Payment',
    description: 'ติดตามข่าวสารและโปรโมชัน',
    isActive: true,
    externalUrl: 'https://www.facebook.com/',
  },
  {
    id: 'line',
    type: 'social',
    title: 'Line',
    value: '@SKMEasy',
    description: 'แชทสอบถามข้อมูล',
    isActive: true,
    externalUrl: 'https://line.me/R/ti/p/@SKMEasy',
  },
]
