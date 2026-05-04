import type { ContactInfo } from '../types'

/**
 * ข้อมูลติดต่อ บริษัท สหกิจ มอเตอร์ไบค์ จำกัด (สำนักงานใหญ่)
 */
export const FIXED_STORE_CONTACT: ContactInfo[] = [
  {
    id: 'phone',
    type: 'phone',
    title: 'โทรศัพท์',
    value: '02-017-9009',
    description: 'จ.–ส. เวลา 08:00–17:00 น.',
    isActive: true,
  },
  {
    id: 'email',
    type: 'email',
    title: 'อีเมล',
    value: 'skm1991.adm@gmail.com',
    description: 'ตอบกลับภายใน 1 วันทำการ',
    isActive: true,
  },
  {
    id: 'address',
    type: 'address',
    title: 'ที่อยู่',
    value: '308 ถนนแจ้งสนิท ตำบลในเมือง อำเภอเมือง จังหวัดยโสธร 35000',
    description: 'บริษัท สหกิจ มอเตอร์ไบค์ จำกัด (สำนักงานใหญ่)',
    isActive: true,
    externalUrl: 'https://maps.app.goo.gl/h4sgzHkD2HwCTB1e6',
  },
  {
    id: 'hours',
    type: 'hours',
    title: 'เวลาทำการ',
    value: 'จันทร์–เสาร์ 08:00–17:00 น.',
    description: 'วันอาทิตย์และวันหยุดนักขัตฤกษ์ ปิดทำการ',
    isActive: true,
  },
  {
    id: 'line',
    type: 'social',
    title: 'LINE Official',
    value: '@skm1991',
    description: 'แชทสอบถาม ส่งสลิป แจ้งชำระ',
    isActive: true,
    externalUrl: 'https://lin.ee/8rfP0qc',
  },
  {
    id: 'facebook',
    type: 'social',
    title: 'Facebook',
    value: 'สหกิจ มอเตอร์ไบค์',
    description: 'ติดตามข่าวสารและโปรโมชัน',
    isActive: true,
    externalUrl: 'https://www.facebook.com/1991skm',
  },
]
