# SKM Easy App - Development Rules

Updated: 2026-05-01

## Product and UI Rules

- Build the actual customer workflow first; do not add marketing landing pages.
- Keep the interface mobile-first and LIFF-friendly.
- Use existing UI primitives and Tailwind patterns before adding new component styles.
- Use icons for compact actions such as copy, back, download, refresh, and upload.
- Keep Thai display text natural and concise.
- Avoid showing internal API/debug details to customers.

## Auth and Session

- Use the existing customer session utilities.
- Preserve LIFF deep-link behavior.
- Do not store sensitive data beyond what the current session model requires.
- Let the API be the source of truth for customer identity and permissions.

## API Usage

- Use `src/lib/skm-api.ts` for authenticated API calls.
- Keep `X-Client-App: skm-easy-app`.
- Coordinate response type changes with `skm-easy-api-v3`.
- Prefer additive UI handling for optional/null backend fields.

## Images and Files

- Compress customer image uploads through `src/lib/image-compression.ts`.
- Validate file type and size before upload where the UI has enough context.
- Keep PDF generation in `src/lib/pdf-generator.ts` and verify Thai text/layout after changes.

## Verification

Run after meaningful changes:

- `npm run type-check`
- `npm run build`

Use browser testing for sign-in, contract detail, support image upload, and PDF flows when those areas change.

