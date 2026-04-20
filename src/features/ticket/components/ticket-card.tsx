import { Link } from '@tanstack/react-router'
import { Calendar, ChevronRight, ImageIcon, MessageCircle } from 'lucide-react'
import { getTicketStatusUi, ticketImageList, type SupportTicket } from '../types'
import { stripHtml } from '@/lib/html-utils'

interface TicketCardProps {
  ticket: SupportTicket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const statusInfo = getTicketStatusUi(ticket.status)
  const hasReply = Boolean(ticket.adminReply && ticket.adminReply.trim().length > 0)
  const imgCount = ticketImageList(ticket).length

  return (
    <Link
      to="/ticket/$id"
      params={{ id: ticket.id }}
      className="block touch-manipulation rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-800/90 dark:active:bg-gray-800"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="mr-2 line-clamp-2 flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {ticket.title}
        </h3>
        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.name}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {stripHtml(ticket.description, 200)}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3 shrink-0" />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {imgCount > 0 ? (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <ImageIcon className="mr-1 h-3 w-3 shrink-0" />
              <span>{imgCount} รูป</span>
            </div>
          ) : null}
          <div className="flex items-center">
            <MessageCircle className="mr-1 h-3 w-3 shrink-0" />
            <span>{hasReply ? 'มีคำตอบจากเจ้าหน้าที่' : 'รอการตอบกลับ'}</span>
          </div>
        </div>
        <span className="inline-flex items-center justify-end gap-0.5 text-sm font-medium text-[#EC1B2E]">
          ดูรายละเอียด
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
