# SKM Easy App - System Documentation

Updated: 2026-05-01

## Runtime

`skm-easy-app` is a static Vite React app deployed behind a web server. In local development it normally runs at:

```text
http://localhost:5173
```

## Environment

Important environment values:

- `VITE_API_BASE_URL`
- LIFF configuration values used by `src/lib/liff-client.ts`
- captcha/public integration keys when enabled

Never commit private secrets in frontend environment files. Any `VITE_*` value is visible to the browser.

## Routing

Routing is handled by TanStack Router under `src/routes`. Customer-protected pages must respect the existing auth bootstrap/session flow.

## Build and Deploy

Common commands:

- `npm install`
- `npm run dev`
- `npm run type-check`
- `npm run build`
- `npm run preview`

The build outputs static files to `dist`. The `postbuild` script copies `.htaccess` when present.

## Operational Notes

- API outages should route customers to friendly error states.
- PDF layout changes should be visually checked on desktop and mobile.
- LIFF behavior should be checked inside LINE when auth/callback logic changes.

