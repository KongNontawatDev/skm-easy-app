import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type { InvoiceData, ReceiptData } from '@/types/billing'

type PdfOrientation = 'portrait' | 'landscape'

const PAGE_SIZE: Record<PdfOrientation, { width: number; height: number; jsPdf: 'p' | 'l' }> = {
  portrait: { width: 794, height: 1123, jsPdf: 'p' },
  landscape: { width: 1123, height: 794, jsPdf: 'l' },
}

const fmt = (n: number) =>
  n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (d?: string) => {
  if (!d) return '-'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const esc = (value?: string | number | null) =>
  String(value ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

async function generatePDFFromHTML(
  htmlContent: string,
  filename: string,
  orientation: PdfOrientation = 'landscape',
) {
  // Input is a complete HTML fragment; output is a client-side A4 PDF saved through jsPDF.
  // html2canvas snapshots an off-screen DOM node so PDF layout stays independent from the visible page.
  const page = PAGE_SIZE[orientation]
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.width = `${page.width}px`
  container.style.minHeight = `${page.height}px`
  container.style.backgroundColor = '#ffffff'
  container.style.color = '#000000'
  container.style.fontFamily = '"Sarabun", "Noto Sans Thai", "Prompt", sans-serif'
  container.style.boxSizing = 'border-box'
  container.innerHTML = htmlContent

  document.body.appendChild(container)

  try {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const canvas = await html2canvas(container, {
      scale: 1.35,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.78)
    const pdf = new jsPDF(page.jsPdf, 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')
    pdf.save(filename)
  } catch {
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF')
  } finally {
    document.body.removeChild(container)
  }
}

const getStyles = () => `
  <style>
    .pdf-page {
      box-sizing: border-box;
      font-family: "Sarabun", "Noto Sans Thai", sans-serif;
      color: #111;
      background: #fff;
      line-height: 1.25;
      border-top: 3px dotted #222;
    }
    .pdf-page.landscape {
      width: 1123px;
      min-height: 794px;
      padding: 22px 36px 30px;
      font-size: 14px;
    }
    .pdf-page.portrait {
      width: 794px;
      min-height: 1123px;
      padding: 22px 30px 34px;
      font-size: 12px;
    }
    .top {
      display: grid;
      grid-template-columns: 1.2fr 0.9fr;
      gap: 22px;
      align-items: start;
    }
    .portrait .top {
      grid-template-columns: 1.12fr 0.88fr;
      gap: 18px;
    }
    .company { display: block; }
    .company-name {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 1px;
    }
    .portrait .company-name { font-size: 16px; }
    .company-line {
      margin: 0;
      font-size: 12.5px;
    }
    .portrait .company-line { font-size: 11px; }
    .doc-head {
      text-align: left;
      justify-self: end;
      min-width: 370px;
    }
    .portrait .doc-head {
      min-width: 0;
      width: 100%;
      justify-self: end;
    }
    .doc-title {
      text-align: center;
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 16px;
    }
    .portrait .doc-title {
      position: static;
      margin: 0 0 12px;
      font-size: 20px;
    }
    .doc-meta {
      display: grid;
      grid-template-columns: 150px 1fr;
      row-gap: 4px;
      column-gap: 7px;
      font-size: 13px;
    }
    .portrait .doc-meta {
      grid-template-columns: 120px 1fr;
      margin-top: 0;
      font-size: 11.5px;
    }
    .middle {
      display: grid;
      grid-template-columns: 1fr 1.12fr;
      gap: 28px;
      margin-top: 24px;
      align-items: start;
    }
    .portrait .middle {
      grid-template-columns: 0.95fr 1.25fr;
      gap: 18px;
      margin-top: 34px;
    }
    .customer-label { margin-bottom: 10px; }
    .address {
      padding-left: 86px;
      font-size: 13px;
      line-height: 1.32;
    }
    .portrait .address {
      padding-left: 70px;
      font-size: 11.5px;
    }
    .vehicle-box {
      border: 2px solid #222;
      padding: 9px 12px;
      min-height: 128px;
    }
    .vehicle-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 5px 22px;
    }
    .portrait .vehicle-grid {
      grid-template-columns: 1fr 1fr;
      gap: 5px 14px;
      font-size: 11.5px;
    }
    .label { font-weight: 600; }
    .table-wrap { margin-top: 24px; }
    .portrait .table-wrap { margin-top: 24px; }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    thead th {
      border-top: 3px solid #222;
      border-bottom: 3px solid #222;
      padding: 7px 6px;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }
    .portrait thead th { font-size: 12.5px; }
    tbody td {
      padding: 7px 6px;
      border-bottom: 2px solid #222;
      vertical-align: top;
    }
    .portrait tbody td { padding: 6px 6px; }
    .description { width: 46%; }
    .period { width: 24%; text-align: center; }
    .money { width: 15%; text-align: right; }
    .total-row td {
      font-weight: 600;
      border-bottom: 3px solid #222;
    }
    .amount-text {
      font-weight: 600;
      padding-left: 10px;
    }
    .footer-area {
      display: grid;
      grid-template-columns: 1fr 0.65fr;
      gap: 24px;
      margin-top: 18px;
      font-size: 13px;
    }
    .portrait .footer-area {
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 18px;
      font-size: 11.5px;
    }
    .note { line-height: 1.35; }
    .print-meta { margin-top: 12px; }
    .right { text-align: right; }
    .muted { color: #333; }
  </style>
`

type LineItem = {
  description: string
  period: string
  amount: number
}

type SkmDocument = {
  title: string
  numberLabel: string
  number: string
  dateLabel: string
  date: string
  paidDate?: string
  contractNumber: string
  customerInfo: InvoiceData['customerInfo']
  vehicleInfo: InvoiceData['vehicleInfo']
  remainingAmount?: number
  taxDueDate?: string
  taxPaymentDueDate?: string
  dueDay?: string
  totalInstallments?: string
  overdueInterest?: number
  lines: LineItem[]
  total: number
  orientation: PdfOrientation
}

const documentHtml = (doc: SkmDocument) => `
  <!-- Document flow: normalized invoice/receipt data -> print HTML -> html2canvas -> jsPDF. -->
  ${getStyles()}
  <div class="pdf-page ${doc.orientation}">
    <div class="top">
      <div class="company">
        <p class="company-name">บริษัท สุหกิจ มอเตอร์ไบค์ จำกัด</p>
        <p class="company-line">308 ถ.แจ้งสนิท ต.ในเมือง อ.เมืองยโสธร จ.ยโสธร 35000</p>
        <p class="company-line">โทร 02-017-9009</p>
        <p class="company-line">เลขประจำตัวผู้เสียภาษี 0355559000041&nbsp;&nbsp; สถานประกอบการ : สำนักงานใหญ่</p>
      </div>

      <div class="doc-head">
        <h1 class="doc-title">${esc(doc.title)}</h1>
        <div class="doc-meta">
          <span>${esc(doc.numberLabel)} :</span><strong>${esc(doc.number)}</strong>
          <span>${esc(doc.dateLabel)} :</span><strong>${fmtDate(doc.date)}</strong>
          ${doc.paidDate ? `<span>วันที่รับชำระ :</span><strong>${fmtDate(doc.paidDate)}</strong>` : ''}
          <span>สัญญาเช่าซื้อ :</span><strong>${esc(doc.contractNumber)}</strong>
        </div>
      </div>
    </div>

    <div class="middle">
      <div>
        <div class="customer-label"><span class="label">ชื่อและที่อยู่</span>&nbsp;&nbsp; ${esc(doc.customerInfo.name)}</div>
        <div class="address">
          ${esc(doc.customerInfo.address)}<br>
          เลขประจำตัวผู้เสียภาษี&nbsp;&nbsp; ${esc(doc.customerInfo.taxId)}
        </div>
      </div>

      <div class="vehicle-box">
        <div class="vehicle-grid">
          <div><span class="label">ยี่ห้อ :</span> ${esc(doc.vehicleInfo.brand)}</div>
          <div><span class="label">เลขทะเบียนรถ :</span> ${esc(doc.vehicleInfo.plateNumber)}</div>
          <div><span class="label">รุ่น :</span> ${esc(doc.vehicleInfo.model)}</div>
          <div><span class="label">เลขตัวถัง :</span> ${esc(doc.vehicleInfo.chassisNumber)}</div>
          <div><span class="label">เลขเครื่อง :</span> ${esc(doc.vehicleInfo.engineNumber)}</div>
          <div><span class="label">ยอดคงเหลือ :</span> ${doc.remainingAmount === undefined ? '-' : fmt(doc.remainingAmount)}</div>
          <div><span class="label">ครบกำหนดภาษี :</span> ${fmtDate(doc.taxDueDate || doc.vehicleInfo.taxDueDate)}</div>
          <div><span class="label">ครบกำหนดชำระภาษี :</span> ${fmtDate(doc.taxPaymentDueDate || doc.vehicleInfo.taxPaymentDueDate)}</div>
          <div><span class="label">ชำระทุกวันที่ :</span> ${esc(doc.dueDay)}</div>
          <div><span class="label">จำนวนงวด :</span> ${esc(doc.totalInstallments)}</div>
          <div><span class="label">ดอกเบี้ยคงค้าง :</span> ${fmt(doc.overdueInterest ?? 0)}</div>
        </div>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="description">รายการ</th>
            <th class="period">งวด</th>
            <th class="money">จำนวนเงิน</th>
            <th class="money">จำนวนเงินรวม</th>
          </tr>
        </thead>
        <tbody>
          ${doc.lines
            .map(
              (line) => `
                <tr>
                  <td>${esc(line.description)}</td>
                  <td class="period">${esc(line.period)}</td>
                  <td class="money">${fmt(line.amount)}</td>
                  <td class="money">${fmt(line.amount)}</td>
                </tr>
              `,
            )
            .join('')}
          <tr class="total-row">
            <td colspan="2"><span class="label">จำนวนเงินรวม</span><span class="amount-text">( ${fmt(doc.total)} บาท )</span></td>
            <td class="money">${fmt(doc.total)}</td>
            <td class="money">${fmt(doc.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-area">
      <div class="note muted">
        หมายเหตุ&nbsp;&nbsp; เอกสารนี้ออกโดยระบบอัตโนมัติ บริษัทได้รับชำระเงินตามเงื่อนไขเรียบร้อยแล้ว
        <div class="print-meta">${new Date().toLocaleDateString('th-TH')}</div>
      </div>
      <div class="right muted">
        เวลาพิมพ์ : ${new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
`

export async function generateInvoicePDF(invoice: InvoiceData): Promise<void> {
  // Invoice input comes from billing mapper/API data; this function flattens fees/items into printable rows.
  const lateFee = invoice.billingInfo.lateFee ?? 0
  const collectionFee = invoice.billingInfo.collectionFee ?? 0
  const otherFees = invoice.billingInfo.otherFees ?? 0
  const lines: LineItem[] = [
    ...invoice.items.map((item) => ({
      description: item.description,
      period: `${fmtDate(invoice.billingInfo.issueDate)} - ${fmtDate(invoice.billingInfo.dueDate)}`,
      amount: item.amount,
    })),
    ...(lateFee ? [{ description: 'ค่าปรับล่าช้า', period: '-', amount: lateFee }] : []),
    ...(collectionFee ? [{ description: 'ค่าติดตามหนี้', period: '-', amount: collectionFee }] : []),
    ...(otherFees ? [{ description: 'ค่าธรรมเนียมอื่นๆ', period: '-', amount: otherFees }] : []),
  ]

  const html = documentHtml({
    title: 'ใบแจ้งหนี้',
    numberLabel: 'เลขที่ใบแจ้งหนี้',
    number: invoice.invoiceNumber,
    dateLabel: 'วันที่',
    date: invoice.billingInfo.issueDate,
    contractNumber: invoice.contractNumber,
    customerInfo: invoice.customerInfo,
    vehicleInfo: invoice.vehicleInfo,
    dueDay: new Date(invoice.billingInfo.dueDate).getDate().toString(),
    totalInstallments: '-',
    overdueInterest: 0,
    lines,
    total: invoice.billingInfo.totalAmount,
    orientation: 'portrait',
  })

  await generatePDFFromHTML(html, `invoice-${invoice.invoiceNumber}.pdf`, 'portrait')
}

export function generateReceiptPDF(receipt: ReceiptData): void {
  // Receipt input uses the same shared document template but renders as A4 portrait per business requirement.
  const lines = receipt.items.map((item) => ({
    description: item.description,
    period: item.period,
    amount: item.amount,
  }))

  const html = documentHtml({
    title: 'ใบเสร็จรับเงิน',
    numberLabel: 'เลขที่ใบเสร็จรับเงิน',
    number: receipt.receiptNumber,
    dateLabel: 'วันที่',
    date: receipt.paymentInfo.paymentDate,
    paidDate: receipt.paymentInfo.paymentDate,
    contractNumber: receipt.contractNumber,
    customerInfo: receipt.customerInfo,
    vehicleInfo: receipt.vehicleInfo,
    dueDay: '-',
    totalInstallments: '-',
    overdueInterest: receipt.paymentInfo.lateFee ?? 0,
    lines,
    total: receipt.paymentInfo.amount,
    orientation: 'portrait',
  })

  void generatePDFFromHTML(html, `receipt-${receipt.receiptNumber}.pdf`, 'portrait')
}
