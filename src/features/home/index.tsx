import { useQuery } from '@tanstack/react-query'
import { useCustomerContracts, useCustomerToken } from '@/hooks/use-customer-contracts'
import {
  MobileLayout,
  MobileContent,
  BottomNavigation,
  MobileAvatar,
  MobileHeaderMenu,
} from '@/components/mobile'
import { ContractCardsCarousel } from './components/contract-cards-carousel'
import { QuickMenuGrid } from './components/quick-menu-grid'
import { PromotionBanner } from './components/promotion-banner'
import { quickMenuItems } from './quick-menu-items'
import { TermsAcceptanceModal } from './components/terms-acceptance-modal'
import { fetchPublicPromotions } from '@/lib/cms-public-api'
import { skmApi, unwrapData } from '@/lib/skm-api'
import type { ContractCard, PromotionAd, WelcomeData } from './types'

import { Skeleton } from '@/components/ui/skeleton'

export function Home() {
  const hasToken = useCustomerToken()

  const promotionsQuery = useQuery({
    queryKey: ['public-promotions'],
    queryFn: fetchPublicPromotions,
    select: (rows): PromotionAd[] =>
      rows.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.descriptionPlain,
        imageUrl: p.imageUrl,
        actionUrl: '/promotion',
        isActive: true,
      })),
  })

  const contractsQuery = useCustomerContracts()

  const profileQuery = useQuery({
    queryKey: ['me-profile'],
    enabled: hasToken,
    queryFn: async () => {
      const res = await skmApi.get('/me/profile')
      return unwrapData<Record<string, unknown>>(res)
    },
  })

  const profile = profileQuery.data
  const pick = (keys: string[]) => {
    if (!profile) return ''
    for (const k of keys) {
      const v = profile[k]
      if (v != null && String(v).trim()) return String(v).trim()
    }
    return ''
  }

  const legacyDisplayName =
    pick(['cus_name', 'name', 'CusName', 'customer_name', 'full_name']) ||
    [pick(['THNAME']), pick(['THSURN', 'thsurn'])].filter(Boolean).join(' ').trim()

  const welcome: WelcomeData = hasToken
    ? {
        message: profileQuery.isError
          ? 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ — แตะที่โปรไฟล์เพื่อลองใหม่'
          : '',
        userName: legacyDisplayName || '—',
        lineDisplayName:
          pick(['line_display_name', 'line_user_name', 'lineUserName']) ||
          (profileQuery.isLoading ? '…' : '—'),
        avatarUrl:
          pick(['line_picture_url', 'linePictureUrl', 'line_user_profile', 'lineUserProfile']) || undefined,
        lastLogin: new Date().toISOString(),
      }
    : {
        message: '',
        userName: '',
        lineDisplayName: '',
        lastLogin: '',
      }

  const displayContracts: ContractCard[] = hasToken ? (contractsQuery.data ?? []) : []
  const displayPromotions: PromotionAd[] = promotionsQuery.data ?? []

  const avatarFallback =
    (hasToken ? welcome.userName : '').trim().charAt(0) ||
    (hasToken ? welcome.lineDisplayName : '').trim().charAt(0) ||
    'ค'

  const displayLineName = hasToken
    ? welcome.lineDisplayName || '—'
    : 'ยังไม่ได้ล็อกอิน'

  return (
    <MobileLayout>
      <MobileContent className="pb-20">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {hasToken && profileQuery.isLoading ? (
                <>
                  <Skeleton className="h-12 w-12 rounded-full shrink-0 shadow-md ring-2 ring-white dark:ring-gray-800" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <MobileAvatar
                    src={welcome.avatarUrl}
                    alt={displayLineName}
                    fallback={avatarFallback}
                    size="lg"
                    className="shrink-0 shadow-md ring-2 ring-white dark:ring-gray-800"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#06C755]">
                      LINE
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {displayLineName}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="shrink-0">
              <MobileHeaderMenu />
            </div>
          </div>

          <ContractCardsCarousel
            contracts={displayContracts}
            mode="home"
            isLoading={hasToken && contractsQuery.isLoading}
            isError={hasToken && contractsQuery.isError}
            onRetry={() => contractsQuery.refetch()}
          />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">เมนูด่วน</h2>
            <QuickMenuGrid items={quickMenuItems} />
          </div>

          <PromotionBanner
            promotions={displayPromotions}
            isLoading={promotionsQuery.isLoading}
            isError={promotionsQuery.isError}
            onRetry={() => promotionsQuery.refetch()}
          />
        </div>
      </MobileContent>

      <BottomNavigation currentPath="/" />

      <TermsAcceptanceModal />
    </MobileLayout>
  )
}
