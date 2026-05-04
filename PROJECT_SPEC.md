# SKM Easy App - Project Spec

Updated: 2026-05-01

## Purpose

`skm-easy-app` is the customer-facing SKM Easy web/LIFF application. It lets customers sign in, view installment contracts, invoices, receipts, notifications, CMS content, support tickets, and customer service flows.

## Stack

- React 19
- TypeScript
- Vite 7
- TanStack Router
- TanStack Query
- Tailwind CSS v4
- Radix/shadcn-style UI components
- Axios API client
- LINE LIFF SDK
- jsPDF/html2canvas for customer PDF generation

## Main Entry Points

- `src/main.tsx`
- `src/routes/*`
- `src/lib/skm-api.ts`
- `src/lib/customer-session.ts`
- `src/lib/liff-client.ts`
- `src/lib/pdf-generator.ts`
- `src/lib/image-compression.ts`

## Feature Areas

- Customer sign-in and OTP flows
- LIFF bootstrap and callback handling
- Customer profile/settings/contact pages
- Installment contract list/detail
- Invoice and receipt list/detail
- PDF invoice and receipt generation
- Notifications and due reminders
- Promotions, articles, and guides
- Support ticket creation/history/detail
- Coupon, credit-check, and refinance-check screens

## Current Product Rules

- Contract detail must not show annual interest rate.
- Contract detail should show engine number, chassis number, tax due date, and tax payment due date when returned by the API.
- Engine number and chassis number include copy icon buttons.
- Invoice and receipt PDFs use the current landscape receipt-style layout and do not include the old signature section.
- Support ticket images are compressed in the browser before upload and compressed again on the API when needed.

## API Dependency

Default API base URL is `http://localhost:3000/api/v1` through `VITE_API_BASE_URL`. Requests identify this client with `X-Client-App: skm-easy-app`.

