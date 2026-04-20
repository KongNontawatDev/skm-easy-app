import type { Notification, NotificationPriority, NotificationType } from '@/features/notification/types'

const TYPES: NotificationType[] = ['payment', 'promotion', 'system', 'reminder', 'alert']
const PRIOS: NotificationPriority[] = ['low', 'medium', 'high', 'urgent']

const RELATED: Array<NonNullable<Notification['relatedType']>> = [
  'contract',
  'invoice',
  'receipt',
  'installment',
  'promotion',
]

function asRelatedType(raw: unknown): Notification['relatedType'] | undefined {
  const s = String(raw ?? '')
  return RELATED.includes(s as NonNullable<Notification['relatedType']>)
    ? (s as NonNullable<Notification['relatedType']>)
    : undefined
}

function asType(raw: unknown): NotificationType {
  const s = String(raw ?? 'system').toLowerCase()
  return TYPES.includes(s as NotificationType) ? (s as NotificationType) : 'system'
}

function asPriority(raw: unknown): NotificationPriority {
  const s = String(raw ?? 'medium').toLowerCase()
  return PRIOS.includes(s as NotificationPriority) ? (s as NotificationPriority) : 'medium'
}

/** แถวจาก GET /notifications → รูปแบบ Notification ของแอป */
export function mapCustomerNotificationRow(row: Record<string, unknown>): Notification {
  const id = String(row.id ?? '')
  const createdAt = String(row.createdAt ?? row.created_at ?? new Date().toISOString())
  return {
    id,
    title: String(row.title ?? ''),
    message: String(row.message ?? ''),
    type: asType(row.type),
    priority: asPriority(row.priority),
    isRead: Boolean(row.isRead ?? row.is_read),
    isImportant: Boolean(row.isImportant ?? row.is_important),
    relatedId: row.relatedId != null ? String(row.relatedId) : undefined,
    relatedType: asRelatedType(row.relatedType),
    createdAt,
    updatedAt: String(row.updatedAt ?? row.updated_at ?? createdAt),
    actionUrl: row.actionUrl != null ? String(row.actionUrl) : undefined,
    actionText: row.actionText != null ? String(row.actionText) : undefined,
  }
}
