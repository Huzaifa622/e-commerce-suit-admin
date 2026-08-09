# Ecommerce Admin Dashboard - Developer Guide

This file documents the architectural conventions, tech stack, and guidelines for extending this codebase. Future AI agents and developers should strictly adhere to these patterns.

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS (v4) + shadcn/ui
- **Data Fetching (Client):** TanStack Query (React Query) + Axios
- **Database:** MongoDB via Mongoose (with cached connection `connect-db.ts`)
- **Images:** Cloudinary (Signed upload flow)
- **Emails:** Nodemailer (SMTP)
- **Icons:** `lucide-react`
- **Validation:** Zod

## Naming Conventions
- **Files and Folders:** `kebab-case` ONLY (e.g. `product-table.tsx`, `use-products.ts`, `product-management`). Exceptions for Next.js reserved files (`page.tsx`, `layout.tsx`, `route.ts`).
- **Component Exports:** `PascalCase` (e.g. `export function ProductTable() {}`).

## Folder Structure
We use a **feature-based** architecture.
- `app/`: Next.js routing ONLY. Thin files that delegate to features.
- `app/api/`: Route handlers acting as our backend REST-ish JSON API.
- `features/`: Business logic, scoped by domain (e.g., `product-management`, `auth`).
  - `features/[domain]/api/`: Axios calls and TanStack Query hooks.
  - `features/[domain]/components/`: React components specific to this feature.
  - `features/[domain]/types/`: TypeScript interfaces and types.
- `components/ui/`: shadcn generic components.
- `components/layout/`: Shared layout pieces (Sidebar, Topbar).
- `components/common/`: Shared reusable components (e.g., generic Data Table).
- `lib/`: Shared utilities (`axios.ts`, `query-client.ts`, DB connection, Cloudinary helpers, etc.).
- `models/`: Mongoose schemas.

## Data Fetching Pattern
We use TanStack Query on top of Axios. 
Filters (e.g., `page`, `limit`, `search`, `minPrice`) should be synced with the URL query string in the component and passed to the `useProducts(filters)` hook. The query key must include these filters to trigger refetches automatically.

## API Conventions
- Response Shape: `{ success: boolean, data?: any, message?: string, meta?: any, errors?: any }`.
- Status Codes: 200 (OK), 201 (Created), 400 (Bad Request / Validation Error), 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error).
- Validation: Use Zod schemas in `lib/validators/` for POST/PATCH endpoints.

## Database (Mongoose)
Use `import connectDb from '@/lib/db/connect-db'` in every API route before interacting with models. This ensures a cached connection is used in Next.js serverless/dev environments.

## Extending the Codebase
When adding a new feature (e.g., `inventory-management`):
1. Create Mongoose model in `models/`.
2. Create API routes in `app/api/inventory`.
3. Create feature folder `features/inventory-management/` with `api/`, `components/`, and `types/`.
4. Add the new route to `app/(dashboard)/inventory/page.tsx`.
5. Update `middleware.ts` if the route needs specific protection.
6. Add navigation link to `components/layout/app-sidebar.tsx`.

## Commands
- Run dev: `npm run dev`
- Build: `npm run build`
- Add UI component: `npx shadcn@latest add <component>`
