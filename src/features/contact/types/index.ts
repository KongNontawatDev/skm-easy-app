export interface ContactInfo {
  id: string
  type: ContactType
  title: string
  value: string
  description?: string
  icon?: string
  isActive: boolean
  /** เปิดในแท็บใหม่ (Facebook, Line, แผนที่) */
  externalUrl?: string
}

export type ContactType = 'phone' | 'email' | 'address' | 'hours' | 'social'

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  category: string
}
