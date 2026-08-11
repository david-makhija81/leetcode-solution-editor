# Code Standards

## General

- Keep modules small and single-purpose
- Fix root causes, do not layer workarounds
- Do not mix unrelated concerns in one component or route

## TypeScript

- Strict mode is required throughout the project
- Avoid any — use explicit interfaces or narrowly scoped types
- Validate unknown external input at system boundaries before trusting it

## Next.js

- Default to server components
- Add `"use client"` only when browser interactivity requires it
- Keep route handlers focused on a single responsibility
- Use the App Router (`app/`) for all routing — do not use the Pages Router
- Colocate page-specific components next to their `page.tsx` when they are not reusable

## Styling

- Use CSS custom property tokens defined in `ui-context.md` — no hardcoded hex values
- Follow the border radius scale defined in `ui-context.md`
- Prefer Tailwind utility classes; extract repeated patterns into components, not custom CSS

## API Routes

- Validate and parse request input before any logic runs
- Enforce auth and ownership before any mutation
- Return consistent, predictable response shapes
- Use Zod for request body and query param validation

## Data and Storage

- Metadata belongs in the database
- Large generated content belongs in file or blob storage
- Do not store large content directly in the database

## File Organization

- `app/` — Pages, layouts, and API route handlers (App Router)
- `app/api/` — REST API endpoints, one route per file
- `components/` — Shared, reusable React components
- `components/ui/` — Low-level design system primitives (buttons, inputs, badges)
- `lib/` — Utility functions, Prisma client, auth helpers, shared types
- `prisma/` — Database schema (`schema.prisma`) and migrations
- `context/` — Project specification and context files (not application code)
- `public/` — Static assets served at the root (favicon, images)
