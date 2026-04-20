import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'
import type { ContactInfo } from '../types'

interface ContactInfoProps {
  contactInfo: ContactInfo[]
}

export function ContactInfo({ contactInfo }: ContactInfoProps) {
  if (contactInfo.length === 0) {
    return (
      <p className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
        ยังไม่มีข้อมูลติดต่อ
      </p>
    )
  }

  function getIcon(type: ContactInfo['type'], title: string) {
    switch (type) {
      case 'phone':
        return <Phone className="h-5 w-5" aria-hidden />
      case 'email':
        return <Mail className="h-5 w-5" aria-hidden />
      case 'address':
        return <MapPin className="h-5 w-5" aria-hidden />
      case 'hours':
        return <Clock className="h-5 w-5" aria-hidden />
      case 'social':
        return title === 'Facebook' ? (
          <Facebook className="h-5 w-5" aria-hidden />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden />
        )
      default:
        return <Phone className="h-5 w-5" aria-hidden />
    }
  }

  function openContact(contact: ContactInfo) {
    if (contact.externalUrl) {
      window.open(contact.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    switch (contact.type) {
      case 'phone':
        window.location.href = `tel:${contact.value.replace(/\s/g, '')}`
        break
      case 'email':
        window.location.href = `mailto:${contact.value}`
        break
      case 'address':
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.value)}`,
          '_blank',
          'noopener,noreferrer',
        )
        break
      default:
        break
    }
  }

  function isActionable(c: ContactInfo): boolean {
    if (c.externalUrl) return true
    return c.type === 'phone' || c.type === 'email' || c.type === 'address'
  }

  const rowClass =
    'flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700'

  return (
    <ul className="flex flex-col gap-4">
      {contactInfo.map((contact) => {
        const actionable = isActionable(contact)
        const body = (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EC1B2E]/10 text-[#EC1B2E]">
              {getIcon(contact.type, contact.title)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{contact.title}</span>
              <span className="mt-1 block text-sm text-gray-700 dark:text-gray-300">{contact.value}</span>
              {contact.description ? (
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{contact.description}</span>
              ) : null}
            </span>
          </>
        )

        return (
          <li key={contact.id}>
            {actionable ? (
              <button
                type="button"
                onClick={() => openContact(contact)}
                className={`${rowClass} cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-800/90 dark:active:bg-gray-800`}
              >
                {body}
              </button>
            ) : (
              <div className={rowClass}>{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
