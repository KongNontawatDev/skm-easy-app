import { getLiffBootstrapResult } from '@/lib/liff-client'
import { skmApi, unwrapData } from '@/lib/skm-api'

/** ยกเลิกการผูก LINE ของอุปกรณ์นี้ (ต้องมี JWT ลูกค้า) — body ตรงกับ `/me/line/unlink` */
export async function unlinkCurrentLineDeviceFromApi(): Promise<void> {
  const r = await getLiffBootstrapResult()
  if (r.tag === 'line_redirect') {
    throw new Error('กำลังไปล็อกอิน LINE — รอให้กลับมาที่แอปแล้วลองอีกครั้ง')
  }
  if (r.tag === 'init_error') {
    throw new Error(r.message || 'เริ่มต้น LIFF ไม่สำเร็จ')
  }
  if (r.tag !== 'ok') {
    throw new Error('ไม่พบ LINE — ล็อกอิน LINE (LIFF) ก่อน หรือตั้งค่า VITE_LIFF_ID')
  }
  const res = await skmApi.post('/me/line/unlink', { idToken: r.idToken })
  unwrapData<{ ok: boolean }>(res)
}
