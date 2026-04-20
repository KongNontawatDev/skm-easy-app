// Utility functions for payment calculations
import { type PaymentData } from './mock-data'

export interface PaymentBreakdown {
  baseAmount: number
  lateFee: number
  collectionFee: number
  otherFees: number
  totalAmount: number
  daysOverdue: number
}

/**
 * คำนวณค่าต่างๆ สำหรับแต่ละงวด
 */
export function calculatePaymentBreakdown(payment: { amount: number; dueDate: string }): PaymentBreakdown {
  const baseAmount = payment.amount
  const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
  
  // ค่าปรับล่าช้า (500 บาท ต่องวดที่ค้างเกิน 1 งวด)
  const lateFee = daysOverdue > 0 ? 500 : 0
  
  // ค่าติดตามหนี้ (10 บาท ต่องวดที่ค้างเกิน 1 งวด)
  const collectionFee = daysOverdue > 0 ? 10 : 0
  
  // ค่าธรรมเนียมอื่นๆ (5 บาท)
  const otherFees = 5
  
  const totalAmount = baseAmount + lateFee + collectionFee + otherFees
  
  return {
    baseAmount,
    lateFee,
    collectionFee,
    otherFees,
    totalAmount,
    daysOverdue
  }
}

/**
 * คำนวณยอดรวมของงวดที่ค้างชำระทั้งหมด
 */
export function calculateTotalOverdueAmount(payments: PaymentData[]): number {
  const overduePayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue')
  
  return overduePayments.reduce((total, payment) => {
    const breakdown = calculatePaymentBreakdown(payment)
    return total + breakdown.totalAmount
  }, 0)
}

/**
 * หางวดที่ค้างชำระทั้งหมด
 */
export function getOverduePayments(payments: PaymentData[]): PaymentData[] {
  return payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

/**
 * หางวดถัดไปที่ต้องชำระ
 */
export function getNextPayment(payments: PaymentData[]): PaymentData | undefined {
  return payments.find(p => p.status === 'pending' || p.status === 'overdue')
}

/**
 * คำนวณจำนวนงวดที่ค้างชำระ
 */
export function getOverdueCount(payments: PaymentData[]): number {
  return payments.filter(p => p.status === 'pending' || p.status === 'overdue').length
}

export function getMinimumPaymentAmount(payments: PaymentData[]): number {
  const overdue = getOverduePayments(payments)
  if (overdue.length === 0) return 0
  return calculatePaymentBreakdown(overdue[0]).totalAmount
}
