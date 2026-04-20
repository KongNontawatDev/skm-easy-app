/** บทความจาก API `/public/articles` */
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  coverImageUrl: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}
