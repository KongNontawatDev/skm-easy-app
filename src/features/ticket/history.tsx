import { useQuery } from '@tanstack/react-query'
import { MobileLayout, MobileHeader, MobileContent, BottomNavigation } from '@/components/mobile'
import { TicketCard } from './components/ticket-card'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { fetchMySupportTickets } from '@/lib/support-tickets-api'

export function TicketHistory() {
  const hasToken = useCustomerToken()
  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['me-support-tickets'],
    queryFn: fetchMySupportTickets,
    enabled: hasToken,
  })

  return (
    <MobileLayout>
      <MobileHeader title="ประวัติการแจ้ง" />
      <MobileContent className="pb-20">
        <div className="space-y-4">
          {!hasToken ? (
            <p className="py-8 text-center text-sm text-gray-500">กรุณาล็อกอินเพื่อดูประวัติการแจ้งปัญหา</p>
          ) : isLoading ? (
            <p className="py-8 text-center text-sm text-gray-500">กำลังโหลด…</p>
          ) : isError ? (
            <div className="py-8 text-center text-sm text-red-600">
              <p>โหลดไม่สำเร็จ</p>
              <button type="button" className="mt-2 text-[#EC1B2E] underline" onClick={() => void refetch()}>
                ลองอีกครั้ง
              </button>
            </div>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <div className="py-10 text-center text-gray-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <span className="text-2xl" aria-hidden>
                  📋
                </span>
              </div>
              <p className="mb-2 text-lg font-medium">ไม่มีประวัติการแจ้ง</p>
              <p className="text-sm">คุณยังไม่เคยแจ้งปัญหามาก่อน</p>
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/ticket" />
    </MobileLayout>
  )
}
