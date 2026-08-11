# UI Context

## Theme

Dark only. No light mode. The design language is a dark
technical workspace — near-black backgrounds, layered
surfaces, and vivid accent colors for interactive elements.
The aesthetic should feel like a premium code editor crossed
with a study tool — focused, clean, and distraction-free.

## Colors

All components must use these tokens — no hardcoded hex values.

| Role            | CSS Variable       | Value     |
| --------------- | ------------------ | --------- |
| Page background | `--bg-base`        | `#0a0a0f` |
| Surface         | `--bg-surface`     | `#12121a` |
| Elevated        | `--bg-elevated`    | `#1a1a26` |
| Primary text    | `--text-primary`   | `#e4e4ed` |
| Muted text      | `--text-muted`     | `#6b6b80` |
| Primary accent  | `--accent-primary` | `#22d3ee` |
| Accent hover    | `--accent-hover`   | `#06b6d4` |
| Border          | `--border-default` | `#1e1e2e` |
| Border active   | `--border-active`  | `#2e2e42` |
| Error           | `--state-error`    | `#f43f5e` |
| Success         | `--state-success`  | `#10b981` |
| Warning         | `--state-warning`  | `#f59e0b` |

## Typography

| Role      | Font       | Variable             |
| --------- | ---------- | -------------------- |
| UI text   | Geist Sans | `--font-geist-sans`  |
| Code/mono | Geist Mono | `--font-geist-mono`  |

## Border Radius

| Context           | Value         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-sm` (4px)  |
| Cards / panels    | `rounded-lg` (8px)  |
| Modals / overlays | `rounded-xl` (12px) |

## Component Library

No pre-built component library. Components are built
from scratch using Tailwind CSS utility classes and the
design tokens above. All reusable components live in
`components/ui/`. Build components incrementally as
needed — do not scaffold unused components.

## Layout Patterns

- **Solution Editor**: Full-viewport split layout. Left
  panel shows the problem statement (read-only). Right
  panel holds a tabbed editor with solution code,
  intuition, approach, and complexity fields. Each
  solution set is a tab group.
- **Dashboard / Problem List**: Top navbar with user
  avatar and navigation. Below it, a filterable list of
  problems grouped by status (Unsolved, Solved, Submitted
  for Review, Reviewed by Mentor). Each card shows
  problem title, difficulty badge, and solution count.
- **Sidebar (Collaboration)**: Right-side collapsible
  panel on the solution editor. Shows inline comments
  from mentors and peers anchored to specific lines.
- **Modals**: Centered overlay with backdrop blur. Used
  for confirmation dialogs, sharing settings, and
  problem selection.
- **Navbar**: Sticky top bar with subtle bottom border.
  Contains logo, breadcrumb navigation, and user controls.

## Icons

Lucide React. Stroke-based icons only. Sizes:
`h-4 w-4` (16px) for inline, `h-5 w-5` (20px) for buttons,
`h-6 w-6` (24px) for section headers.
