# Architecture Context

## Stack

| Layer     | Technology               | Role                                                        |
| --------- | ------------------------ | ----------------------------------------------------------- |
| Framework | Next.js 16 + TypeScript  | Full-stack framework — server components, API routes, SSR    |
| UI        | Tailwind CSS 4           | Utility-first styling with CSS custom property design tokens |
| Auth      | Clerk                    | User sign-in, session management, identity for collaboration |
| Database  | Prisma + PostgreSQL      | Relational storage for problems, solutions, comments, users  |
| Editor    | CodeMirror 6             | Code editor widget for solution code fields                  |
| Realtime  | Liveblocks or Supabase Realtime | Live collaboration and inline commenting              |

## System Boundaries

- `app/` — Next.js App Router pages, layouts, and route handlers. Owns routing and page-level data fetching.
- `app/api/` — Server-side API route handlers. Owns request validation, auth enforcement, and response shaping.
- `components/` — Reusable React components. Owns rendering logic — no direct data fetching or mutations.
- `lib/` — Shared utilities, Prisma client, auth helpers, and type definitions. Owns cross-cutting concerns.
- `prisma/` — Database schema and migrations. Owns the data model.

## Storage Model

- **Database (PostgreSQL via Prisma)**: User profiles, problem metadata (title, difficulty, tags, link), solution sets (code, intuition, approach, complexity), comments, review status, mentor/mentee relationships, and ownership records.
- **Blob/File Storage (e.g. Vercel Blob or S3)**: Problem statement HTML snapshots (imported from Leetcode), any user-uploaded media attachments.

## Auth and Access Model

- Every user signs in via Clerk (email, Google, or GitHub OAuth).
- Every solution set has a single author (the user who created it).
- A user can designate mentors who gain read + comment access to their solutions.
- A user can share individual solutions or entire problem workspaces with specific peers.
- Only the author can edit their own solution set fields (code, intuition, approach, complexity).
- Mentors and shared peers can add inline comments on any solution set they have access to.
- Problem statements are read-only for all users (immutable once imported).

## Invariants

1. Request handlers do not run long-lived background work — offload to queues or edge functions if needed.
2. A solution set always belongs to exactly one author and one problem — this relationship is immutable after creation.
3. Problem statements are never editable by any user — they are imported snapshots from Leetcode.
4. All mutations require an authenticated session — unauthenticated requests are rejected before any logic runs.
5. Comments are always scoped to a specific line or range within a solution set field — free-floating comments are not allowed.
