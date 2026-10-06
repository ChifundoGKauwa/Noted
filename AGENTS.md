Implement the newsletter subscription feature for Noted.

First, inspect the existing frontend architecture and the
AGENTS.md instructions.

Read the relevant documentation for the installed Next.js
version before making changes.

Requirements:

1. Build a reusable subscription form.
2. Validate the email address.
3. Submit the request to the Axum backend.
4. Handle loading, success, and error states.
5. Prevent duplicate submissions while a request is pending.
6. Keep API communication outside the presentation component.
7. Do not expose secrets in client-side code.
8. Follow the existing design system.

Before coding, explain which files need to change.

After implementation, run the relevant checks and summarize
the changes, test results, and any remaining limitations.

Do not invent backend endpoints or response formats.
Inspect the existing API implementation first.

## Design Source of Truth

The design is the visual source of truth for the frontend.

Before implementing a UI feature:

1. Inspect the relevant design.
2. Identify the intended layout and responsive behavior.
3. Reuse existing components where possible.
4. Match typography, spacing, colors, borders, radius, and visual hierarchy.
5. Do not introduce arbitrary UI patterns that conflict with the design.
6. Ensure the implementation works on mobile, tablet, and desktop.
7. If the design is ambiguous, inspect the surrounding screens and existing components before making assumptions.

The design does not override functional, accessibility, security, or
Next.js architectural requirements.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
