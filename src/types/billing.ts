// ข้อมูลกลางสำหรับทั้งระบบ — types เดิมจาก mock-data.ts (ย้ายมาใช้งานจริง)
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
    engineNumber?: string
    chassisNumber?: string
    taxDueDate?: string
    taxPaymentDueDate?: string
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
  balanceAmount?: number
  paidAmount?: number
  lateFee?: number
  collectionFee?: number
  otherFees?: number
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
    engineNumber?: string
    chassisNumber?: string
    taxDueDate?: string
    taxPaymentDueDate?: string
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
    engineNumber?: string
    chassisNumber?: string
    taxDueDate?: string
    taxPaymentDueDate?: string
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
