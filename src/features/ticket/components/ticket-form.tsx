import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { MobileButton, MobileInput } from '@/components/mobile'
import { ImagePlus, Send, X } from 'lucide-react'

const MAX_IMAGES = 1
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

type LocalImage = { key: string; file: File; url: string }

interface TicketFormProps {
  onSubmit: (data: { title: string; description: string; files: File[] }) => void
  onCancel: () => void
  isSubmitting?: boolean
}

function isAllowedImage(file: File): boolean {
  const t = (file.type || '').toLowerCase()
  return t === 'image/jpeg' || t === 'image/png' || t === 'image/webp' || t === 'image/gif'
}

export function TicketForm({ onSubmit, onCancel, isSubmitting }: TicketFormProps) {
  const inputId = useId()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<LocalImage[]>([])
  const imagesRef = useRef<LocalImage[]>([])
  imagesRef.current = images

  const revokeAll = useCallback(() => {
    setImages((prev) => {
      for (const p of prev) {
        URL.revokeObjectURL(p.url)
      }
      return []
    })
  }, [])

  useEffect(() => {
    return () => {
      for (const p of imagesRef.current) {
        URL.revokeObjectURL(p.url)
      }
    }
  }, [])

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return
    const file = fileList.item(0)
    if (!file || !isAllowedImage(file)) return
    setImages((prev) => {
      for (const p of prev) URL.revokeObjectURL(p.url)
      return [
        {
          key: `${file.name}-${file.size}-0`,
          file,
          url: URL.createObjectURL(file),
        },
      ]
    })
  }

  const removeAt = (key: string) => {
    setImages((prev) => {
      const hit = prev.find((p) => p.key === key)
      if (hit) URL.revokeObjectURL(hit.url)
      return prev.filter((p) => p.key !== key)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    const d = description.trim()
    if (t.length >= 3 && d.length >= 5) {
      onSubmit({ title: t, description: d, files: images.map((x) => x.file) })
    }
  }

  const handleCancel = () => {
    revokeAll()
    setTitle('')
    setDescription('')
    onCancel()
  }

  const canSubmit = title.trim().length >= 3 && description.trim().length >= 5

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">หัวข้อปัญหา *</label>
        <MobileInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ระบุหัวข้อปัญหาที่พบ"
          required
          minLength={3}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">รายละเอียดปัญหา *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายรายละเอียดของปัญหาให้ชัดเจน (อย่างน้อย 5 ตัวอักษร)"
          className="w-full resize-none rounded-xl bg-white p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#EC1B2E] dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          rows={5}
          required
          minLength={5}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          แนบรูปประกอบ (ไม่บังคับ)
        </label>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={isSubmitting || images.length >= MAX_IMAGES}
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <MobileButton
            type="button"
            variant="outline"
            className="flex items-center justify-center"
            disabled={isSubmitting || images.length >= MAX_IMAGES}
            onClick={() => document.getElementById(inputId)?.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            เลือกรูป
          </MobileButton>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            JPEG / PNG / WebP / GIF ได้สูงสุด {MAX_IMAGES} รูป
          </span>
        </div>
        {images.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {images.map((img) => (
              <div key={img.key} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                  onClick={() => removeAt(img.key)}
                  disabled={isSubmitting}
                  aria-label="ลบรูป"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        ข้อมูลจะถูกส่งไปยังเจ้าหน้าที่ผ่านระบบ — กรุณาล็อกอินลูกค้าก่อนใช้งาน
      </p>

      <div className="flex space-x-3 pt-4">
        <MobileButton type="button" variant="outline" className="flex-1" onClick={handleCancel} disabled={isSubmitting}>
          ยกเลิก
        </MobileButton>
        <MobileButton
          type="submit"
          className="flex flex-1 items-center justify-center"
          disabled={!canSubmit || isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'กำลังส่ง…' : 'ส่งคำร้อง'}
        </MobileButton>
      </div>
    </form>
  )
}
