# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Frontend MVP — complete.

## Current Goal

- Frontend MVP with mock data is built and verified.

## Completed

- Next.js 16 project scaffolded with TypeScript and Tailwind CSS 4.
- Boilerplate cleaned — minimal `page.tsx`, empty `globals.css`, stripped `public/`.
- Context files created and populated.
- **Design system**: CSS custom properties in `globals.css` with all color tokens from `ui-context.md`.
- **Type definitions**: `lib/types.ts` with `Problem`, `SolutionSet`, `Comment`, `MockUser` interfaces.
- **Mock data layer**: `lib/mock-data.ts` with 10 Leetcode problems, realistic Python solutions, and mentor comments.
- **UI primitives**: `badge.tsx`, `tabs.tsx`, `code-editor.tsx`, `text-editor.tsx`.
- **Layout components**: `navbar.tsx`, `problem-card.tsx`, `problem-statement.tsx`, `solution-editor-panel.tsx`, `comment-sidebar.tsx`.
- **Dashboard page** (`app/page.tsx`): Stats row, filter tabs, search, responsive problem card grid.
- **Solution editor page** (`app/problems/[id]/page.tsx`): Resizable split layout, problem statement panel, tabbed solution editor, collapsible comment sidebar.
- `npm run build` passes with zero errors.

## In Progress

- None.

## Next Up

- Integrate Clerk authentication.
- Set up Prisma schema with core data models (User, Problem, SolutionSet, Comment).
- Replace mock data with database queries.
- Add CodeMirror 6 for proper syntax-highlighted code editing.
- Build the collaboration features (real-time comments, sharing).

## Open Questions

- How are Leetcode problems imported? Manual entry by the user, paste-a-URL scraper, or integration with a problem bank / API?
- What defines the mentor/mentee relationship? Is it a simple invite link, a code, or managed through a group/team concept?
- Should the solution code editor support syntax highlighting for multiple languages, or just one (e.g., Python)?
- Is there a notification system when a mentor leaves a comment on a solution?
- Are solution sets versioned, or is only the latest state stored?
- What does the "collective feed of solutions of peers or mentees" look like? Is it a timeline, a per-problem aggregation, or something else?

## Architecture Decisions

- **Clerk for auth**: Supports OAuth (Google, GitHub) which is natural for developer-oriented users.
- **PostgreSQL + Prisma**: The data model is highly relational (users → solutions → comments, problems → solution sets).
- **CodeMirror 6 for code editing**: Deferred to the backend phase — using textarea with line numbers for the MVP.
- **Dark-only theme**: One theme reduces design surface area for the MVP.
- **Mock data first**: Validates the full UI before committing to backend integration.

## Session Notes

- Frontend MVP is complete. Run `npm run dev` to see the app.
- Dashboard at `/`, solution editor at `/problems/[id]` (e.g. `/problems/two-sum`).
- All data is hardcoded in `lib/mock-data.ts` — next phase replaces this with database queries.
