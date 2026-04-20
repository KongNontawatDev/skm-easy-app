import type { ContractCard } from '@/features/home/types'

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, ''))
    return Number.isNaN(n) ? fallback : n
  }
  return fallback
}

function str(v: unknown, fallback = ''): string {
  return v === undefined || v === null ? fallback : String(v)
}

/** แปลงแถวจาก raw SQL legacy เป็นการ์ดสัญญาในแอป — ชื่อคอลัมน์ปรับได้ตาม SQL จริง */
export function mapLegacyContractRow(row: Record<string, unknown>): ContractCard {
  const contractRef = str(
    row.contractRef ?? row.contract_ref ?? row.contractref ?? row.CONTRACT_NO ?? row.contno ?? row.id,
  )
  const statusRaw = str(row.status ?? row.contract_status ?? row.contsts, 'active').toLowerCase()
  const status: ContractCard['status'] =
    statusRaw === 'overdue' || statusRaw === 'ค้าง' ? 'overdue' : statusRaw === 'completed' || statusRaw === 'ปิด' ? 'completed' : 'active'

  return {
    id: contractRef,
    contractNumber: str(row.contractNumber ?? row.contract_no ?? row.contno ?? contractRef),
    vehicleInfo: {
      brand: str(row.brand ?? row.vehicle_brand ?? '—'),
      model: str(row.model ?? row.vehicle_model ?? '—'),
      year: num(row.year ?? row.vehicle_year ?? row.caryear, new Date().getFullYear()),
      color: str(row.color ?? row.vehicle_color ?? '—'),
      imageUrl: str(row.imageUrl ?? row.vehicle_image ?? row.image_url, '') || undefined,
    },
    remainingAmount: num(row.remainingAmount ?? row.remaining_amount ?? row.outsbal ?? row.balance),
    nextPaymentDate: str(
      row.nextPaymentDate ?? row.next_due_date ?? row.nextpaymentdate ?? new Date().toISOString().slice(0, 10),
    ),
    status,
    progress: Math.min(100, Math.max(0, num(row.progress ?? row.paid_percent, 0))),
  }
}
