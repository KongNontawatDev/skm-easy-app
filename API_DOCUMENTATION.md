# SKM Easy App - API Usage Documentation

Updated: 2026-05-01

## API Client

Primary client: `src/lib/skm-api.ts`

Default base URL:

```text
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

All normal requests send:

```text
X-Client-App: skm-easy-app
```

## Customer Auth

The app uses customer auth endpoints for LIFF bootstrap, OTP request/verify, token refresh, and session restore. Keep these flows aligned with `skm-easy-api-v3` customer auth middleware.

## Customer Data

Current customer feature areas consume:

- profile/session routes
- contract list/detail routes
- installment/payment summary routes
- invoice and receipt routes
- notification routes
- support ticket routes
- CMS public content routes

Contract detail UI expects optional fields:

- `engineNumber`
- `chassisNumber`
- `taxDueDate`
- `taxPaymentDueDate`

These fields may be `null`.

## Uploads

Support ticket image upload uses `multipart/form-data`. Images are compressed in the browser first, then validated/compressed again by the API.

## Error Handling

The UI should show customer-safe messages. Avoid displaying raw backend stack traces, SQL errors, or internal diagnostic payloads.

