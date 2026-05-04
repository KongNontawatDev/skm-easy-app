import { useNavigate } from '@tanstack/react-router'
import { Shield, ChevronLeft, Phone, Mail, MessageCircle } from 'lucide-react'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
} from '@/components/mobile'
import {
  PRIVACY_SECTIONS,
  PRIVACY_COMPANY_BLOCK,
  PRIVACY_EFFECTIVE_DATE,
} from '@/features/legal/privacy-policy'

export function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <MobileLayout>
      <MobileHeader
        title="นโยบายความเป็นส่วนตัว"
        onBack={() => void navigate({ to: '/settings' })}
      />
      <MobileContent className="pb-8">
        {/* Header Card */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900/40 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-gray-100">นโยบายความเป็นส่วนตัว</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">มีผลบังคับใช้ตั้งแต่ {PRIVACY_EFFECTIVE_DATE}</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/70 dark:bg-gray-800/50 p-3">
            {PRIVACY_COMPANY_BLOCK.split('\n').map((line, i) => (
              <p key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {PRIVACY_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
            >
              <h2 className="mb-3 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.paragraphs.map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact shortcuts */}
        <div className="mt-6 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100 text-sm">ติดต่อฝ่ายคุ้มครองข้อมูล</h3>
          <div className="space-y-2">
            <a
              href="tel:020179009"
              className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">02-017-9009</span>
            </a>
            <a
              href="mailto:skm1991.adm@gmail.com"
              className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">skm1991.adm@gmail.com</span>
            </a>
            <a
              href="https://lin.ee/8rfP0qc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">LINE: @skm1991</span>
            </a>
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => void navigate({ to: '/settings' })}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80"
        >
          <ChevronLeft className="h-4 w-4" />
          กลับหน้าตั้งค่า
        </button>
      </MobileContent>
    </MobileLayout>
  )
}
