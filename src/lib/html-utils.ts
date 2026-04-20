/** ตัดแท็ก HTML สำหรับข้อความตัวอย่างในการ์ด (เนื้อหาจริงยังอยู่ในรูปแบบ HTML จาก CMS) */
export function stripHtml(html: string, maxLen = 280): string {
  if (!html) return ''
  const text = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen)}…`
}
