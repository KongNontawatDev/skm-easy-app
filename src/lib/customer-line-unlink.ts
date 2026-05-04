import { skmApi, unwrapData } from '@/lib/skm-api'

/** ยกเลิกการผูก LINE ของอุปกรณ์นี้ (ต้องมี JWT ลูกค้า) */
export async function unlinkCurrentLineDeviceFromApi(): Promise<void> {
  // ยิง API ก่อนเสมอ โดยใช้ JWT ลูกค้าจากแอปเป็นหลัก
  const res = await skmApi.post('/me/unlink-line', {})
  unwrapData<{ ok: boolean }>(res)
}
