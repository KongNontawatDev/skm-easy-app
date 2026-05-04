# SKM Easy App - Database Documentation

Updated: 2026-05-01

## Database Access

`skm-easy-app` does not connect directly to the database. All data must come from `skm-easy-api-v3`.

## Safety Rule

Do not add browser-side database credentials, direct SQL calls, or direct production database access. Any database inspection or update belongs in the API project and must follow the production DB safety policy.

## Client Data Sources

The app consumes API-backed data for:

- Customer session/profile
- Contracts and installment status
- Invoice and receipt records
- Vehicle fields such as engine number, chassis number, and tax dates
- Notifications
- Promotions, articles, and guides
- Support tickets and uploaded support images

## Local State

Only store client session/cache/UI state needed for the customer experience. TanStack Query cache is not a database and should not be treated as a persistent record source.

