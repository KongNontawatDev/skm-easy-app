/** คู่มือจาก API `/public/guides` */
export interface AppGuideItem {
  id: string
  title: string
  content: string
  excerpt: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}
