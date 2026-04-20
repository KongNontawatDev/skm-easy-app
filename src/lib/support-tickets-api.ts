import { isAxiosError } from 'axios'
import { skmApi, unwrapData } from '@/lib/skm-api'
import type { SupportTicket } from '@/features/ticket/types'

export async function fetchMySupportTickets(): Promise<SupportTicket[]> {
  const res = await skmApi.get('/me/support/tickets')
  return unwrapData<SupportTicket[]>(res)
}

export async function fetchMySupportTicketById(id: string): Promise<SupportTicket | null> {
  try {
    const res = await skmApi.get(`/me/support/tickets/${encodeURIComponent(id)}`)
    return unwrapData<SupportTicket>(res)
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
}

export async function createSupportTicket(body: {
  title: string
  description: string
}): Promise<SupportTicket> {
  const res = await skmApi.post('/me/support/tickets', body)
  return unwrapData<SupportTicket>(res)
}

export async function uploadSupportTicketImage(ticketId: string, file: File): Promise<SupportTicket> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await skmApi.post(`/me/support/tickets/${encodeURIComponent(ticketId)}/image`, fd)
  return unwrapData<SupportTicket>(res)
}
