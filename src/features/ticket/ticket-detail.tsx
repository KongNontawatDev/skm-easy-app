import { useQuery } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  BottomNavigation,
} from '@/components/mobile'
import { Calendar } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { fetchMySupportTicketById } from '@/lib/support-tickets-api'
import { resolveMediaUrl } from '@/lib/media-url'
import { getTicketStatusUi, ticketImageList } from './types'

export function TicketDetail() {
  const { id } = useParams({ from: '/ticket/$id' })
  const hasToken = useCustomerToken()

  const { data: ticket, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['me-support-ticket', id],
    queryFn: () => fetchMySupportTicketById(id),
    enabled: Boolean(id) && hasToken,
  })

  if (!hasToken) {
    return (
      <MobileLayout>
        <MobileHeader title="แจ้งปัญหา" />
        <MobileContent className="pb-20">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
            กรุณาล็อกอินด้วย OTP จากหน้าโปรไฟล์ก่อน จึงจะดูรายละเอียดการแจ้งปัญหาได้
          </div>
        </MobileContent>
        <BottomNavigation currentPath="/ticket" />
      </MobileLayout>
    )
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <MobileHeader title="แจ้งปัญหา" />
        <MobileContent className="flex h-full items-center justify-center pb-20">
          <p className="text-sm text-gray-500">กำลังโหลด…</p>
        </MobileContent>
        <BottomNavigation currentPath="/ticket" />
      </MobileLayout>
    )
  }

  if (isError || ticket === null || ticket === undefined) {
    return (
      <MobileLayout>
        <MobileHeader title="ไม่พบเรื่อง" />
        <MobileContent className="flex h-full flex-col items-center justify-center gap-3 pb-20">
          <p className="text-gray-500">
            {isError
              ? error instanceof Error
                ? error.message
                : 'โหลดไม่สำเร็จ'
              : 'ไม่พบเรื่องที่แจ้ง หรือคุณไม่มีสิทธิ์ดู'}
          </p>
          {isError ? (
            <button type="button" className="text-sm text-[#EC1B2E] underline" onClick={() => void refetch()}>
              ลองอีกครั้ง
            </button>
          ) : null}
        </MobileContent>
        <BottomNavigation currentPath="/ticket" />
      </MobileLayout>
    )
  }

  const statusInfo = getTicketStatusUi(ticket.status)
  const hasReply = Boolean(ticket.adminReply && ticket.adminReply.trim().length > 0)
  const images = ticketImageList(ticket)

  return (
    <MobileLayout>
      <MobileHeader title="รายละเอียดการแจ้ง" />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{ticket.title}</h1>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.name}
              </span>
            </div>
            <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  แจ้งเมื่อ{' '}
                  {new Date(ticket.createdAt).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  อัปเดต{' '}
                  {new Date(ticket.updatedAt).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">รายละเอียดที่แจ้ง</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {ticket.description}
            </p>
            {images.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">รูปประกอบ</p>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((src) => (
                    <a
                      key={src}
                      href={resolveMediaUrl(src)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                    >
                      <img
                        src={resolveMediaUrl(src)}
                        alt=""
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {hasReply ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900 dark:bg-blue-950/30">
              <p className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100">คำตอบจากเจ้าหน้าที่</p>
              <div
                className="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: ticket.adminReply ?? '' }}
              />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">ยังไม่มีคำตอบจากเจ้าหน้าที่</p>
          )}

        </div>
      </MobileContent>
      <BottomNavigation currentPath="/ticket" />
    </MobileLayout>
  )
}
