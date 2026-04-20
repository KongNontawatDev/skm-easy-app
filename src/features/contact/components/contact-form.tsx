import { useState } from 'react'
import { MobileButton, MobileInput } from '@/components/mobile'
import { Send } from 'lucide-react'

interface ContactFormProps {
  onSubmit: (data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    category: string
  }) => void
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.email.trim() && formData.message.trim()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ชื่อ-นามสกุล *
          </label>
          <MobileInput
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="ชื่อ-นามสกุล"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            เบอร์โทรศัพท์ *
          </label>
          <MobileInput
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="เบอร์โทรศัพท์"
            type="tel"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          อีเมล *
        </label>
        <MobileInput
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="อีเมล"
          type="email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          หมวดหมู่
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full p-3 rounded-xl focus:ring-2 focus:ring-[#EC1B2E] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="general">ทั่วไป</option>
          <option value="payment">การชำระเงิน</option>
          <option value="technical">เทคนิค</option>
          <option value="complaint">ร้องเรียน</option>
          <option value="suggestion">ข้อเสนอแนะ</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          หัวข้อ *
        </label>
        <MobileInput
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="หัวข้อที่ต้องการติดต่อ"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ข้อความ *
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="รายละเอียดที่ต้องการติดต่อ"
          className="w-full p-3 rounded-xl focus:ring-2 focus:ring-[#EC1B2E] resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          rows={4}
          required
        />
      </div>

      <MobileButton
        type="submit"
        className="w-full flex items-center justify-center"
        disabled={!formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
      >
        <Send className="w-4 h-4 mr-2" />
        ส่งข้อความ
      </MobileButton>
    </form>
  )
}
