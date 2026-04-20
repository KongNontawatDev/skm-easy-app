/**
 * อ่านโปรโมชัน / บทความ / คู่มือจาก Public API (ข้อมูลจากฐานข้อมูลผ่าน skm-easy-api-v2)
 */
import { isAxiosError } from 'axios'
import { skmApi, unwrapData } from '@/lib/skm-api'
import { resolveMediaUrl } from '@/lib/media-url'
import { stripHtml } from '@/lib/html-utils'
import type { BlogPost } from '@/features/blog/types'
import type { AppGuideItem } from '@/features/guide/types'
import type { PromotionListItem } from '@/features/promotion/types'

export type ApiPromotionRow = {
  id: string
  title: string
  description: string
  image: string | null
  startDate: string | null
  endDate: string | null
}

export type ApiArticleRow = {
  id: string
  title: string
  content: string
  coverImage: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ApiGuideRow = {
  id: string
  title: string
  content: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export async function fetchPublicPromotions(): Promise<PromotionListItem[]> {
  const res = await skmApi.get('/public/promotions')
  const rows = unwrapData<ApiPromotionRow[]>(res)
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    descriptionPlain: stripHtml(r.description, 400),
    descriptionHtml: r.description,
    imageUrl: resolveMediaUrl(r.image ?? ''),
    startDate: r.startDate,
    endDate: r.endDate,
  }))
}

export async function fetchPublicPromotionById(id: string): Promise<PromotionListItem | null> {
  try {
    const res = await skmApi.get(`/public/promotions/${encodeURIComponent(id)}`)
    const row = unwrapData<ApiPromotionRow>(res)
    return {
      id: row.id,
      title: row.title,
      descriptionPlain: stripHtml(row.description, 400),
      descriptionHtml: row.description,
      imageUrl: resolveMediaUrl(row.image ?? ''),
      startDate: row.startDate,
      endDate: row.endDate,
    }
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
}

function mapArticle(r: ApiArticleRow): BlogPost {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    excerpt: stripHtml(r.content, 220),
    coverImageUrl: resolveMediaUrl(r.coverImage ?? ''),
    publishedAt: r.publishedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }
}

export async function fetchPublicArticles(): Promise<BlogPost[]> {
  const res = await skmApi.get('/public/articles')
  const rows = unwrapData<ApiArticleRow[]>(res)
  return rows.map(mapArticle)
}

export async function fetchPublicArticleById(id: string): Promise<BlogPost | null> {
  try {
    const res = await skmApi.get(`/public/articles/${encodeURIComponent(id)}`)
    const row = unwrapData<ApiArticleRow>(res)
    return mapArticle(row)
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
}

function mapGuide(r: ApiGuideRow): AppGuideItem {
  return {
    id: r.id,
    title: r.title,
    content: r.content,
    excerpt: stripHtml(r.content, 220),
    sortOrder: r.sortOrder,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }
}

export async function fetchPublicGuides(): Promise<AppGuideItem[]> {
  const res = await skmApi.get('/public/guides')
  const rows = unwrapData<ApiGuideRow[]>(res)
  return rows.map(mapGuide)
}

export async function fetchPublicGuideById(id: string): Promise<AppGuideItem | null> {
  try {
    const res = await skmApi.get(`/public/guides/${encodeURIComponent(id)}`)
    const row = unwrapData<ApiGuideRow>(res)
    return mapGuide(row)
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) return null
    throw e
  }
}
