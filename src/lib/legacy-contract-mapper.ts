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

function firstText(values: unknown[], fallback = ''): string {
  for (const value of values) {
    const text = str(value).trim()
    if (text && text !== '---' && text !== '—') return text
  }
  return fallback
}

/** แปลงแถวจาก raw SQL legacy เป็นการ์ดสัญญาในแอป — ชื่อคอลัมน์ปรับได้ตาม SQL จริง */
export function mapLegacyContractRow(row: Record<string, unknown>): ContractCard {
  const contractRef = str(
    row.contractRef ?? row.contract_ref ?? row.contractref ?? row.CONT_NO ?? row.contno ?? row.id,
  )
  const statusRaw = str(row.status ?? row.contract_status ?? row.contsts, 'active').toLowerCase()
  const status: ContractCard['status'] =
    statusRaw === 'overdue' ? 'overdue' : statusRaw === 'completed' ? 'completed' : 'active'

  return {
    id: contractRef,
    contractNumber: str(row.contractNumber ?? row.contract_no ?? row.CONTNO ?? row.contno ?? contractRef),
    vehicleInfo: {
      brand: firstText([row.brand, row.vehicleBrand, row.vehicle_brand, row.BRAND], '---'),
      model: firstText(
        [row.modelDescription, row.model, row.vehicleModel, row.vehicle_model, row.MODEL, row.modelCode],
        '---',
      ),
      year: num(row.year ?? row.vehicle_year ?? row.CARYEAR, new Date().getFullYear()),
      color: firstText([row.colorDescription, row.color, row.vehicle_color, row.COLOR, row.colorCode], '---'),
      imageUrl: str(row.imageUrl ?? row.vehicle_image ?? row.image_url, '') || undefined,
    },
    remainingAmount: num(row.outstandingBalance ?? row.remainingAmount ?? row.remaining_amount ?? row.OUTSBAL ?? row.balance),
    nextPaymentDate: str(
      row.nextPaymentDate ?? row.next_due_date ?? row.nextpaymentdate ?? row.FIRSTDTE ?? new Date().toISOString().slice(0, 10),
    ),
    status,
    progress: Math.min(100, Math.max(0, num(row.progress ?? row.paid_percent, 0))),
  }
}
