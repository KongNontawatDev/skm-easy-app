// ข้อมูลกลางสำหรับทั้งระบบ
export interface ContractData {
  id: string
  contractNumber: string
  vehicleInfo: {
    brand: string
    model: string
    year: number
    color: string
    plateNumber: string
    imageUrl: string
  }
  customerInfo: {
    name: string
    phone: string
    email: string
    address: string
    taxId: string
  }
  financialInfo: {
    totalAmount: number
    downPayment: number
    loanAmount: number
    monthlyPayment: number
    interestRate: number
    remainingAmount: number
    term: number
  }
  contractInfo: {
    startDate: string
    endDate: string
    term: number
    status: 'active' | 'overdue' | 'completed'
  }
  progress: number
  nextPaymentDate: string
  createdAt: string
}

export interface PaymentData {
  id: string
  contractNo: string
  installmentNo: number
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
}

export interface InvoiceData {
  id: string
  invoiceNumber: string
  contractId: string
  contractNumber: string
  customerInfo: {
    name: string
    address: string
    taxId: string
  }
  vehicleInfo: {
    brand: string
    model: string
    plateNumber: string
  }
  billingInfo: {
    issueDate: string
    dueDate: string
    paymentDate?: string
    amount: number
    vat: number
    totalAmount: number
    lateFee?: number
    collectionFee?: number
    otherFees?: number
  }
  paymentInfo: {
    method: string
    reference: string
    status: 'paid' | 'pending' | 'sent'
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    amount: number
  }>
  status: 'paid' | 'sent' | 'pending'
  createdAt: string
  updatedAt: string
}

export interface ReceiptData {
  id: string
  receiptNumber: string
  invoiceId: string
  contractId: string
  contractNumber: string
  customerInfo: {
    name: string
    address: string
    taxId: string
  }
  vehicleInfo: {
    brand: string
    model: string
    plateNumber: string
  }
  paymentInfo: {
    paymentDate: string
    amount: number
    method: string
    reference: string
    bankAccount: string
    status: 'completed' | 'pending' | 'failed'
    baseAmount?: number
    lateFee?: number
    collectionFee?: number
    otherFees?: number
  }
  items: Array<{
    id: string
    description: string
    amount: number
    period: string
  }>
  createdAt: string
  updatedAt: string
}

// ข้อมูลสัญญาหลัก
export const CONTRACTS_DATA: ContractData[] = [
  {
    id: 'CT-2024-001',
    contractNumber: 'CT-2024-001',
    vehicleInfo: {
      brand: 'Honda',
      model: 'CBR150R',
      year: 2023,
      color: 'แดง',
      plateNumber: 'กข-1234',
      imageUrl: 'https://s38.wheelsage.org/picture/h/honda/cbr1000rr_sp/honda_cbr1000rr_sp_8.jpeg'
    },
    customerInfo: {
      name: 'สมชาย ใจดี',
      phone: '081-234-5678',
      email: 'somchai@email.com',
      address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
      taxId: '1234567890123'
    },
    financialInfo: {
      totalAmount: 90000, // ราคารถ Honda CBR150R 90,000 บาท
      downPayment: 15000,
      loanAmount: 75000,
      monthlyPayment: 3750, // คำนวณจาก 75,000 บาท ผ่อน 24 งวด ดอกเบี้ย 3.5%
      interestRate: 3.5,
      remainingAmount: 11250, // 3 งวดที่ค้างชำระ x 3,750 = 11,250
      term: 24
    },
    contractInfo: {
      startDate: '2024-08-01',
      endDate: '2026-07-31',
      term: 24,
      status: 'overdue' // ค้างชำระ 3 งวด
    },
    progress: 87, // 21 งวดที่ชำระแล้ว / 24 งวดทั้งหมด = 87.5%
    nextPaymentDate: '2025-11-15', // งวดที่ 24 ที่ค้างชำระ
    createdAt: '2024-08-01T00:00:00Z'
  },
  {
    id: 'CT-2024-002',
    contractNumber: 'CT-2024-002',
    vehicleInfo: {
      brand: 'Honda',
      model: 'PCX160',
      year: 2022,
      color: 'ดำ',
      plateNumber: 'กข-5678',
      imageUrl: 'https://img.motofiixthailand.com/asset/files/17345971816726901.webp'
    },
    customerInfo: {
      name: 'สมศรี รักดี',
      phone: '082-345-6789',
      email: 'somsri@email.com',
      address: '456 ถนนรัชดาภิเษก กรุงเทพฯ 10400',
      taxId: '9876543210987'
    },
    financialInfo: {
      totalAmount: 110000, // ราคารถ Honda PCX160 110,000 บาท
      downPayment: 20000,
      loanAmount: 90000,
      monthlyPayment: 4500, // คำนวณจาก 90,000 บาท ผ่อน 20 งวด ดอกเบี้ย 3.0%
      interestRate: 3.0,
      remainingAmount: 27000, // 6 งวดที่เหลือ x 4,500 = 27,000
      term: 20
    },
    contractInfo: {
      startDate: '2025-02-01',
      endDate: '2026-09-30',
      term: 20,
      status: 'active'
    },
    progress: 70, // 14 งวดที่ชำระแล้ว / 20 งวดทั้งหมด = 70%
    nextPaymentDate: '2026-11-01',
    createdAt: '2025-02-01T00:00:00Z'
  },
  {
    id: 'CT-2024-003',
    contractNumber: 'CT-2024-003',
    vehicleInfo: {
      brand: 'Honda',
      model: 'Wave 125i',
      year: 2021,
      color: 'เงิน',
      plateNumber: 'กข-9012',
      imageUrl: 'https://s359.kapook.com/rq/600/auto/10/pagebuilder/d00209a5-b85a-4592-8cd5-3955b2d799c2.jpg'
    },
    customerInfo: {
      name: 'สมศักดิ์ ใจงาม',
      phone: '083-456-7890',
      email: 'somsak@email.com',
      address: '789 ถนนลาดพร้าว กรุงเทพฯ 10230',
      taxId: '4567891234567'
    },
    financialInfo: {
      totalAmount: 65000, // ราคารถ Honda Wave 125i 65,000 บาท
      downPayment: 10000,
      loanAmount: 55000,
      monthlyPayment: 2750, // คำนวณจาก 55,000 บาท ผ่อน 20 งวด ดอกเบี้ย 3.0%
      interestRate: 3.0,
      remainingAmount: 13750, // 5 งวดที่เหลือ x 2,750 = 13,750
      term: 20
    },
    contractInfo: {
      startDate: '2025-05-01',
      endDate: '2026-12-31',
      term: 20,
      status: 'active'
    },
    progress: 75, // 15 งวดที่ชำระแล้ว / 20 งวดทั้งหมด = 75%
    nextPaymentDate: '2026-11-01',
    createdAt: '2025-05-01T00:00:00Z'
  }
]

// ข้อมูลการชำระเงิน
export const PAYMENTS_DATA: PaymentData[] = [
  // CT-2024-001 - ค้างชำระ 3 งวด (ผ่อนไปแล้ว 21 งวด) - วันที่ปัจจุบัน: 20 ตุลาคม 2025
  {
    id: 'PAY-001-24',
    contractNo: 'CT-2024-001',
    installmentNo: 24,
    amount: 3750,
    dueDate: '2025-11-15',
    status: 'pending'
  },
  {
    id: 'PAY-001-23',
    contractNo: 'CT-2024-001',
    installmentNo: 23,
    amount: 3750,
    dueDate: '2025-10-15',
    status: 'overdue'
  },
  {
    id: 'PAY-001-22',
    contractNo: 'CT-2024-001',
    installmentNo: 22,
    amount: 3750,
    dueDate: '2025-09-15',
    status: 'overdue'
  },
  {
    id: 'PAY-001-21',
    contractNo: 'CT-2024-001',
    installmentNo: 21,
    amount: 3750,
    dueDate: '2025-08-15',
    status: 'overdue'
  },
  {
    id: 'PAY-001-20',
    contractNo: 'CT-2024-001',
    installmentNo: 20,
    amount: 3750,
    dueDate: '2025-07-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-19',
    contractNo: 'CT-2024-001',
    installmentNo: 19,
    amount: 3750,
    dueDate: '2025-06-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-18',
    contractNo: 'CT-2024-001',
    installmentNo: 18,
    amount: 3750,
    dueDate: '2025-05-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-17',
    contractNo: 'CT-2024-001',
    installmentNo: 17,
    amount: 3750,
    dueDate: '2025-04-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-16',
    contractNo: 'CT-2024-001',
    installmentNo: 16,
    amount: 3750,
    dueDate: '2025-03-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-15',
    contractNo: 'CT-2024-001',
    installmentNo: 15,
    amount: 3750,
    dueDate: '2025-02-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-14',
    contractNo: 'CT-2024-001',
    installmentNo: 14,
    amount: 3750,
    dueDate: '2025-09-15',
    status: 'paid'
  },
  {
    id: 'PAY-001-13',
    contractNo: 'CT-2024-001',
    installmentNo: 13,
    amount: 3750,
    dueDate: '2025-08-15',
    status: 'paid'
  },
  // CT-2024-002 - ผ่อนไปแล้ว 14 งวด (เหลือ 6 งวด) - วันที่ปัจจุบัน: 17 ตุลาคม 2026
  {
    id: 'PAY-002-20',
    contractNo: 'CT-2024-002',
    installmentNo: 20,
    amount: 4500,
    dueDate: '2026-09-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-19',
    contractNo: 'CT-2024-002',
    installmentNo: 19,
    amount: 4500,
    dueDate: '2026-08-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-18',
    contractNo: 'CT-2024-002',
    installmentNo: 18,
    amount: 4500,
    dueDate: '2026-07-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-17',
    contractNo: 'CT-2024-002',
    installmentNo: 17,
    amount: 4500,
    dueDate: '2026-06-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-16',
    contractNo: 'CT-2024-002',
    installmentNo: 16,
    amount: 4500,
    dueDate: '2026-05-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-15',
    contractNo: 'CT-2024-002',
    installmentNo: 15,
    amount: 4500,
    dueDate: '2026-04-01',
    status: 'pending'
  },
  {
    id: 'PAY-002-14',
    contractNo: 'CT-2024-002',
    installmentNo: 14,
    amount: 4500,
    dueDate: '2026-03-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-13',
    contractNo: 'CT-2024-002',
    installmentNo: 13,
    amount: 4500,
    dueDate: '2026-02-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-12',
    contractNo: 'CT-2024-002',
    installmentNo: 12,
    amount: 4500,
    dueDate: '2026-01-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-11',
    contractNo: 'CT-2024-002',
    installmentNo: 11,
    amount: 4500,
    dueDate: '2025-12-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-10',
    contractNo: 'CT-2024-002',
    installmentNo: 10,
    amount: 4500,
    dueDate: '2025-11-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-9',
    contractNo: 'CT-2024-002',
    installmentNo: 9,
    amount: 4500,
    dueDate: '2025-10-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-8',
    contractNo: 'CT-2024-002',
    installmentNo: 8,
    amount: 4500,
    dueDate: '2025-09-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-7',
    contractNo: 'CT-2024-002',
    installmentNo: 7,
    amount: 4500,
    dueDate: '2025-08-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-6',
    contractNo: 'CT-2024-002',
    installmentNo: 6,
    amount: 4500,
    dueDate: '2025-07-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-5',
    contractNo: 'CT-2024-002',
    installmentNo: 5,
    amount: 4500,
    dueDate: '2025-06-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-4',
    contractNo: 'CT-2024-002',
    installmentNo: 4,
    amount: 4500,
    dueDate: '2025-05-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-3',
    contractNo: 'CT-2024-002',
    installmentNo: 3,
    amount: 4500,
    dueDate: '2025-04-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-2',
    contractNo: 'CT-2024-002',
    installmentNo: 2,
    amount: 4500,
    dueDate: '2025-03-01',
    status: 'paid'
  },
  {
    id: 'PAY-002-1',
    contractNo: 'CT-2024-002',
    installmentNo: 1,
    amount: 4500,
    dueDate: '2025-02-01',
    status: 'paid'
  },
  // CT-2024-003 - ผ่อนไปแล้ว 15 งวด (เหลือ 5 งวด) - วันที่ปัจจุบัน: 17 ตุลาคม 2026
  {
    id: 'PAY-003-20',
    contractNo: 'CT-2024-003',
    installmentNo: 20,
    amount: 2750,
    dueDate: '2026-12-01',
    status: 'pending'
  },
  {
    id: 'PAY-003-19',
    contractNo: 'CT-2024-003',
    installmentNo: 19,
    amount: 2750,
    dueDate: '2026-11-01',
    status: 'pending'
  },
  {
    id: 'PAY-003-18',
    contractNo: 'CT-2024-003',
    installmentNo: 18,
    amount: 2750,
    dueDate: '2026-10-01',
    status: 'pending'
  },
  {
    id: 'PAY-003-17',
    contractNo: 'CT-2024-003',
    installmentNo: 17,
    amount: 2750,
    dueDate: '2026-09-01',
    status: 'pending'
  },
  {
    id: 'PAY-003-16',
    contractNo: 'CT-2024-003',
    installmentNo: 16,
    amount: 2750,
    dueDate: '2026-08-01',
    status: 'pending'
  },
  {
    id: 'PAY-003-15',
    contractNo: 'CT-2024-003',
    installmentNo: 15,
    amount: 2750,
    dueDate: '2026-07-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-14',
    contractNo: 'CT-2024-003',
    installmentNo: 14,
    amount: 2750,
    dueDate: '2026-06-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-13',
    contractNo: 'CT-2024-003',
    installmentNo: 13,
    amount: 2750,
    dueDate: '2026-05-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-12',
    contractNo: 'CT-2024-003',
    installmentNo: 12,
    amount: 2750,
    dueDate: '2026-04-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-11',
    contractNo: 'CT-2024-003',
    installmentNo: 11,
    amount: 2750,
    dueDate: '2026-03-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-10',
    contractNo: 'CT-2024-003',
    installmentNo: 10,
    amount: 2750,
    dueDate: '2026-02-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-9',
    contractNo: 'CT-2024-003',
    installmentNo: 9,
    amount: 2750,
    dueDate: '2026-01-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-8',
    contractNo: 'CT-2024-003',
    installmentNo: 8,
    amount: 2750,
    dueDate: '2025-12-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-7',
    contractNo: 'CT-2024-003',
    installmentNo: 7,
    amount: 2750,
    dueDate: '2025-11-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-6',
    contractNo: 'CT-2024-003',
    installmentNo: 6,
    amount: 2750,
    dueDate: '2025-10-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-5',
    contractNo: 'CT-2024-003',
    installmentNo: 5,
    amount: 2750,
    dueDate: '2025-09-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-4',
    contractNo: 'CT-2024-003',
    installmentNo: 4,
    amount: 2750,
    dueDate: '2025-08-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-3',
    contractNo: 'CT-2024-003',
    installmentNo: 3,
    amount: 2750,
    dueDate: '2025-07-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-2',
    contractNo: 'CT-2024-003',
    installmentNo: 2,
    amount: 2750,
    dueDate: '2025-06-01',
    status: 'paid'
  },
  {
    id: 'PAY-003-1',
    contractNo: 'CT-2024-003',
    installmentNo: 1,
    amount: 2750,
    dueDate: '2025-05-01',
    status: 'paid'
  }
]

// ข้อมูลใบแจ้งหนี้
export const INVOICES_DATA: InvoiceData[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    contractId: 'CT-2024-001',
    contractNumber: 'CT-2024-001',
    customerInfo: {
      name: 'สมชาย ใจดี',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
      taxId: '1234567890123'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'CBR150R',
      plateNumber: 'กข-1234 กรุงเทพ'
    },
    billingInfo: {
      issueDate: '2025-05-15T00:00:00Z',
      dueDate: '2025-06-15T00:00:00Z',
      paymentDate: '2025-05-20T00:00:00Z',
      amount: 3750,
      vat: 0,
      totalAmount: 3765, // 3750 + 5 (ค่าธรรมเนียมอื่นๆ) + 10 (ค่าติดตามหนี้) = 3765
      lateFee: 0,
      collectionFee: 10,
      otherFees: 5
    },
    paymentInfo: {
      method: 'โอนเงิน',
      reference: 'TXN-20240120-001',
      status: 'paid'
    },
    items: [
      {
        id: 'ITEM-001',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda CBR150R งวดที่ 22',
        quantity: 1,
        unitPrice: 3750,
        amount: 3750
      }
    ],
    status: 'paid',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-20T14:30:00Z'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    contractId: 'CT-2024-001',
    contractNumber: 'CT-2024-001',
    customerInfo: {
      name: 'สมชาย ใจดี',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
      taxId: '1234567890123'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'CBR150R',
      plateNumber: 'กข-1234 กรุงเทพ'
    },
    billingInfo: {
      issueDate: '2025-06-15T00:00:00Z',
      dueDate: '2025-07-15T00:00:00Z',
      amount: 3750,
      vat: 0,
      totalAmount: 4265, // 3750 + 500 (ค่าปรับล่าช้า) + 10 (ค่าติดตามหนี้) + 5 (ค่าธรรมเนียมอื่นๆ) = 4265
      lateFee: 500,
      collectionFee: 10,
      otherFees: 5
    },
    paymentInfo: {
      method: 'QR Code',
      reference: '',
      status: 'pending'
    },
    items: [
      {
        id: 'ITEM-002',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda CBR150R งวดที่ 23',
        quantity: 1,
        unitPrice: 3750,
        amount: 3750
      }
    ],
    status: 'sent',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z'
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2024-003',
    contractId: 'CT-2024-002',
    contractNumber: 'CT-2024-002',
    customerInfo: {
      name: 'สมศรี รักดี',
      address: '456 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10400',
      taxId: '9876543210987'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'PCX160',
      plateNumber: 'กข-5678 กรุงเทพ'
    },
    billingInfo: {
      issueDate: '2024-01-20T00:00:00Z',
      dueDate: '2024-02-20T00:00:00Z',
      amount: 12000,
      vat: 0,
      totalAmount: 12015, // 12000 + 5 (ค่าธรรมเนียมอื่นๆ) + 10 (ค่าติดตามหนี้) = 12015
      lateFee: 0,
      collectionFee: 10,
      otherFees: 5
    },
    paymentInfo: {
      method: 'โอนเงิน',
      reference: 'TXN-20240125-002',
      status: 'paid'
    },
    items: [
      {
        id: 'ITEM-003',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda PCX160 งวดที่ 4',
        quantity: 1,
        unitPrice: 12000,
        amount: 12000
      }
    ],
    status: 'paid',
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-25T11:15:00Z'
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2024-004',
    contractId: 'CT-2024-003',
    contractNumber: 'CT-2024-003',
    customerInfo: {
      name: 'สมศักดิ์ ใจงาม',
      address: '789 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10230',
      taxId: '4567891234567'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'Wave 125i',
      plateNumber: 'กข-9012 กรุงเทพ'
    },
    billingInfo: {
      issueDate: '2026-08-01T00:00:00Z',
      dueDate: '2026-09-01T00:00:00Z',
      amount: 2750,
      vat: 0,
      totalAmount: 3265, // 2750 + 500 (ค่าปรับล่าช้า) + 10 (ค่าติดตามหนี้) + 5 (ค่าธรรมเนียมอื่นๆ) = 3265
      lateFee: 500,
      collectionFee: 10,
      otherFees: 5
    },
    paymentInfo: {
      method: 'โอนเงิน',
      reference: 'TXN-20240112-003',
      status: 'paid'
    },
    items: [
      {
        id: 'ITEM-004',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda Wave 125i งวดที่ 18',
        quantity: 1,
        unitPrice: 2750,
        amount: 2750
      }
    ],
    status: 'paid',
    createdAt: '2026-08-01T14:00:00Z',
    updatedAt: '2026-08-01T16:45:00Z'
  }
]

// ข้อมูลใบเสร็จ
export const RECEIPTS_DATA: ReceiptData[] = [
  {
    id: 'RCP-001',
    receiptNumber: 'RCP-2024-001',
    invoiceId: 'INV-001',
    contractId: 'CT-2024-001',
    contractNumber: 'CT-2024-001',
    customerInfo: {
      name: 'สมชาย ใจดี',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
      taxId: '1234567890123'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'CBR150R',
      plateNumber: 'กข-1234 กรุงเทพ'
    },
    paymentInfo: {
      paymentDate: '2025-05-20T14:30:00Z',
      amount: 3765,
      method: 'โอนเงิน',
      reference: 'TXN-20250520-001',
      bankAccount: '123-4-56789-0',
      status: 'completed',
      baseAmount: 3750,
      lateFee: 0,
      collectionFee: 10,
      otherFees: 5
    },
    items: [
      {
        id: 'ITEM-001',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda CBR150R งวดที่ 22',
        amount: 3750,
        period: 'พฤษภาคม 2568'
      },
      {
        id: 'ITEM-002',
        description: 'ค่าธรรมเนียมการชำระ',
        amount: 15,
        period: 'พฤษภาคม 2568'
      }
    ],
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-05-20T14:30:00Z'
  },
  {
    id: 'RCP-002',
    receiptNumber: 'RCP-2024-002',
    invoiceId: 'INV-003',
    contractId: 'CT-2024-002',
    contractNumber: 'CT-2024-002',
    customerInfo: {
      name: 'สมศรี รักดี',
      address: '456 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10400',
      taxId: '9876543210987'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'PCX160',
      plateNumber: 'กข-5678 กรุงเทพ'
    },
    paymentInfo: {
      paymentDate: '2024-01-25T11:15:00Z',
      amount: 12015,
      method: 'โอนเงิน',
      reference: 'TXN-20240125-002',
      bankAccount: '987-6-54321-0',
      status: 'completed',
      baseAmount: 12000,
      lateFee: 0,
      collectionFee: 10,
      otherFees: 5
    },
    items: [
      {
        id: 'ITEM-003',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda PCX160 งวดที่ 4',
        amount: 12000,
        period: 'มกราคม 2567'
      },
      {
        id: 'ITEM-004',
        description: 'ค่าธรรมเนียมการชำระ',
        amount: 15,
        period: 'มกราคม 2567'
      }
    ],
    createdAt: '2024-01-25T11:15:00Z',
    updatedAt: '2024-01-25T11:15:00Z'
  },
  {
    id: 'RCP-003',
    receiptNumber: 'RCP-2024-003',
    invoiceId: 'INV-004',
    contractId: 'CT-2024-003',
    contractNumber: 'CT-2024-003',
    customerInfo: {
      name: 'สมศักดิ์ ใจงาม',
      address: '789 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10230',
      taxId: '4567891234567'
    },
    vehicleInfo: {
      brand: 'Honda',
      model: 'Wave 125i',
      plateNumber: 'กข-9012 กรุงเทพ'
    },
    paymentInfo: {
      paymentDate: '2024-01-12T16:45:00Z',
      amount: 6615, // 6000 + 500 (ค่าปรับล่าช้า) + 10 (ค่าติดตามหนี้) + 5 (ค่าธรรมเนียมอื่นๆ) + 100 (ค่าอื่นๆ) = 6615
      method: 'โอนเงิน',
      reference: 'TXN-20240112-003',
      bankAccount: '456-7-89012-3',
      status: 'completed',
      baseAmount: 6000,
      lateFee: 500,
      collectionFee: 10,
      otherFees: 5
    },
    items: [
      {
        id: 'ITEM-005',
        description: 'ค่างวดรถมอเตอร์ไซค์ Honda Wave 125i งวดที่ 18',
        amount: 6250,
        period: 'มกราคม 2567'
      },
      {
        id: 'ITEM-006',
        description: 'ค่าธรรมเนียมการชำระ',
        amount: 25,
        period: 'มกราคม 2567'
      }
    ],
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
]

// Helper functions
export const getContractById = (id: string): ContractData | undefined => {
  return CONTRACTS_DATA.find(contract => contract.id === id || contract.contractNumber === id)
}

export const getPaymentsByContract = (contractId: string): PaymentData[] => {
  return PAYMENTS_DATA.filter(payment => payment.contractNo === contractId)
}

export const getInvoicesByContract = (contractId: string): InvoiceData[] => {
  return INVOICES_DATA.filter(invoice => invoice.contractId === contractId)
}

export const getReceiptsByContract = (contractId: string): ReceiptData[] => {
  return RECEIPTS_DATA.filter(receipt => receipt.contractId === contractId)
}

export const getPaymentById = (id: string): PaymentData | undefined => {
  return PAYMENTS_DATA.find(payment => payment.id === id)
}

export const getInvoiceById = (id: string): InvoiceData | undefined => {
  return INVOICES_DATA.find(invoice => invoice.id === id)
}

export const getReceiptById = (id: string): ReceiptData | undefined => {
  return RECEIPTS_DATA.find(receipt => receipt.id === id)
}
