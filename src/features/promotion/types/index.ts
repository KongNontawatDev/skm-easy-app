/** รายการโปรโมชันจาก API `/public/promotions` (ข้อมูลจากฐานข้อมูล) */
export interface PromotionListItem {
  id: string
  title: string
  /** ข้อความธรรมดาสำหรับการ์ด */
  descriptionPlain: string
  /** HTML จาก CMS สำหรับหน้ารายละเอียด (ถ้ามี) */
  descriptionHtml: string
  imageUrl: string
  startDate: string | null
  endDate: string | null
}
