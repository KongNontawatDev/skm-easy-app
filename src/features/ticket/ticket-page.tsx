import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MobileLayout,
  MobileHeader,
  MobileContent,
  MobileButton,
  BottomNavigation,
} from '@/components/mobile'
import { TicketForm } from './components/ticket-form'
import { TicketCard } from './components/ticket-card'
import { Plus, History } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useCustomerToken } from '@/hooks/use-customer-contracts'
import { createSupportTicket, fetchMySupportTickets, uploadSupportTicketImage } from '@/lib/support-tickets-api'
import { getSkmApiErrorMessage } from '@/lib/skm-api'
import { toast } from 'sonner'

export function Ticket() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasToken = useCustomerToken()
  const [showForm, setShowForm] = useState(false)

  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['me-support-tickets'],
    queryFn: fetchMySupportTickets,
    enabled: hasToken,
  })

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; files: File[] }) => {
      const ticket = await createSupportTicket({ title: data.title, description: data.description })
      const file = data.files[0]
      if (file) {
        await uploadSupportTicketImage(ticket.id, file)
      }
      return ticket
    },
    onSuccess: () => {
      toast.success('ส่งเรื่องถึงเจ้าหน้าที่แล้ว')
      void queryClient.invalidateQueries({ queryKey: ['me-support-tickets'] })
      setShowForm(false)
    },
    onError: (err: unknown) => {
      toast.error(getSkmApiErrorMessage(err))
    },
  })

  const handleSubmitTicket = (data: { title: string; description: string; files: File[] }) => {
    createMutation.mutate(data)
  }

  return (
    <MobileLayout>
      <MobileHeader title="แจ้งปัญหา" showMoreMenu={true} />
      <MobileContent className="pb-20">
        <div className="space-y-6">
          {!hasToken ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              กรุณาล็อกอินด้วย OTP จากหน้าโปรไฟล์ก่อน จึงจะแจ้งปัญหาและดูประวัติได้
            </div>
          ) : null}

          <div className="flex space-x-3">
            <MobileButton
              onClick={() => setShowForm(true)}
              className="flex flex-1 items-center justify-center"
              disabled={!hasToken}
            >
              <Plus className="mr-2 h-4 w-4" />
              แจ้งปัญหาใหม่
            </MobileButton>
            <MobileButton
              variant="outline"
              onClick={() => router.navigate({ to: '/ticket/history' })}
              className="flex flex-1 items-center justify-center"
              disabled={!hasToken}
            >
              <History className="mr-2 h-4 w-4" />
              ประวัติ
            </MobileButton>
          </div>

          {showForm && hasToken ? (
            <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">แจ้งปัญหาใหม่</h3>
              <TicketForm
                onSubmit={handleSubmitTicket}
                onCancel={() => setShowForm(false)}
                isSubmitting={createMutation.isPending}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">ปัญหาล่าสุด</h3>
              {!hasToken ? null : isLoading ? (
                <p className="py-6 text-center text-sm text-gray-500">กำลังโหลด…</p>
              ) : isError ? (
                <div className="py-6 text-center text-sm text-red-600">
                  <p>โหลดรายการไม่สำเร็จ</p>
                  <button type="button" className="mt-2 text-[#EC1B2E] underline" onClick={() => void refetch()}>
                    ลองอีกครั้ง
                  </button>
                </div>
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
              ) : (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <span className="text-2xl" aria-hidden>
                      🎫
                    </span>
                  </div>
                  <p className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">ยังไม่มีปัญหา</p>
                  <p className="text-sm">กดปุ่ม &quot;แจ้งปัญหาใหม่&quot; เพื่อเริ่มต้น</p>
                </div>
              )}
            </div>
          )}
        </div>
      </MobileContent>
      <BottomNavigation currentPath="/ticket" />
    </MobileLayout>
  )
}
