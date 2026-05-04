# SKM Easy App AI Skill

Use this skill when working on `skm-easy-app`.

## First Steps

1. Inspect the current route/component/API client involved in the request.
2. Read `CODE_FLOW.md` for file-level flow, imports, exports, and function input/output before broad changes.
3. Check `skm-easy-api-v3` before changing API response assumptions.
4. Keep the customer mobile/LIFF experience central.

## Hard Rules

- Do not add direct database access.
- Do not expose secrets in frontend code or `VITE_*` values.
- Do not show annual interest rate on contract detail.
- Keep engine/chassis copy buttons working when those values exist.
- Keep invoice/receipt PDFs aligned with the current receipt-style design without signature section.

## Preferred Patterns

- TanStack Router routes under `src/routes`.
- TanStack Query for server data.
- Axios through `src/lib/skm-api.ts`.
- Existing UI components and Tailwind utilities.
- Browser image compression through `src/lib/image-compression.ts`.

## Verification

Run after meaningful changes:

- `npm run type-check`
- `npm run build`

Use browser testing for auth, contract detail, support ticket upload, and PDF output when touched.
