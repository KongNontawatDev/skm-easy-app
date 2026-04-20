// Home page types
export interface WelcomeData {
  message: string
  userName: string
  /** ชื่อที่แสดงจาก LINE */
  lineDisplayName: string
  /** รูปโปรไฟล์ (ถ้าไม่มีจะใช้ตัวอักษรย่อ) */
  avatarUrl?: string
  lastLogin: string
}

export interface ContractCard {
  id: string
  contractNumber: string
  vehicleInfo: {
    brand: string
    model: string
    year: number
    color: string
    imageUrl?: string
  }
  remainingAmount: number
  nextPaymentDate: string
  status: 'active' | 'overdue' | 'completed'
  progress: number // 0-100
}

export interface QuickMenuItem {
  id: string
  title: string
  icon: string
  path: string
  color: string
  disabled?: boolean
}

export interface PromotionAd {
  id: string
  title: string
  description: string
  imageUrl: string
  actionUrl: string
  isActive: boolean
}

export interface ContractProgress {
  totalAmount: number
  paidAmount: number
  nextDueDate: string
  installmentIndex: number
  totalInstallments: number
}

export interface HomeData {
  welcome: WelcomeData
  contracts: ContractCard[]
  quickMenu: QuickMenuItem[]
  promotions: PromotionAd[]
}
