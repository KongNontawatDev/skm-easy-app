import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const SUPPORT_CHANNELS = [
  {
    id: 'phone',
    icon: Phone,
    title: 'โทรศัพท์',
    value: '02-017-9009',
    subtitle: 'จ.–ส. เวลา 08:00–17:00 น.',
    href: 'tel:020179009',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
  },
  {
    id: 'line',
    icon: MessageCircle,
    title: 'LINE Official',
    value: '@skm1991',
    subtitle: 'แชทสอบถาม ส่งสลิป แจ้งชำระ',
    href: 'https://lin.ee/8rfP0qc',
    color: 'text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400',
  },
  {
    id: 'email',
    icon: Mail,
    title: 'อีเมล',
    value: 'skm1991.adm@gmail.com',
    subtitle: 'ตอบกลับภายใน 1 วันทำการ',
    href: 'mailto:skm1991.adm@gmail.com',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400',
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'ที่อยู่',
    value: '308 ถ.แจ้งสนิท ต.ในเมือง อ.เมือง จ.ยโสธร 35000',
    subtitle: 'บริษัท สหกิจ มอเตอร์ไบค์ จำกัด (สำนักงานใหญ่)',
    href: 'https://maps.app.goo.gl/h4sgzHkD2HwCTB1e6',
    color: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400',
  },
] as const

export function ContactSupport() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Phone className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">ติดต่อเจ้าหน้าที่</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          หากคุณมีปัญหาในการเข้าสู่ระบบหรือยืนยันตัวตน
          <br />
          สามารถติดต่อเจ้าหน้าที่ได้ผ่านช่องทางด้านล่าง
        </p>
      </div>

      <div className="space-y-3">
        {SUPPORT_CHANNELS.map((ch) => (
          <a
            key={ch.id}
            href={ch.href}
            target={ch.id === 'line' || ch.id === 'address' ? '_blank' : undefined}
            rel={ch.id === 'line' || ch.id === 'address' ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors active:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:active:bg-gray-700/60"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ch.color}`}
            >
              <ch.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {ch.title}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{ch.value}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                {ch.subtitle}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="pt-2 text-center">
        <Link
          to="/sign-in"
          className="text-sm font-medium text-[#EC1B2E] hover:text-[#C20010] transition-colors underline-offset-4 hover:underline"
        >
          กลับหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </div>
  )
}
