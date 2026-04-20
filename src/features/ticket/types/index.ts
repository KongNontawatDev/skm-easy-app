/** ตรงกับ `support_tickets` ผ่าน `/me/support/tickets` */
export interface SupportTicket {
  id: string
  title: string
  description: string
  status: string
  adminReply: string | null
  /** URL รูปจาก API (path ใต้ `/api/v1/public/files/...`) สูงสุด 1 รูป */
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export function ticketImageList(ticket: Pick<SupportTicket, 'imageUrl'>): string[] {
  const u = ticket.imageUrl?.trim()
  return u ? [u] : []
}

export const ticketStatusUi: Record<
  string,
  { name: string; color: string }
> = {
  open: { name: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200' },
  replied: { name: 'มีการตอบกลับ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' },
  closed: { name: 'ปิดเรื่อง', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200' },
}

export function getTicketStatusUi(status: string) {
  return ticketStatusUi[status] ?? {
    name: status,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  }
}
