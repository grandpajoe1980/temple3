# Temple3 Agent Guide

## Core Principles
- Always consult `PLAN.md` before starting new work and keep changes aligned with the roadmap.
- Preserve and enhance the multi-tenant architecture: every feature must respect tenant isolation both in UI and API usage.
- Prioritize modern, immersive UI/UX patterns (glassmorphism, gradients, micro-interactions) while maintaining accessibility and responsiveness.
- Favor reusable, composable components with clear separation of concerns.

## Frontend Standards
- Prefer TypeScript for new React components; when editing existing JavaScript files, keep consistent style and add JSDoc when helpful.
- Every async flow must surface loading, empty, and error states with polished visuals.
- Use context hooks (`useAuth`, `useTenant`, `useNotification`) instead of prop drilling for global data.
- Interact with the backend via dedicated service modules in `src/services`; centralize API logic there.
- When possible, debounce expensive operations (search, filtering) and memoize derived data.
- Keep UI snappy with optimistic updates where it will not jeopardize data integrity.

## Backend Standards
- Extend the Express API using the existing middleware stack (`tenantMiddleware`, `requireTenant`, `auth`, `validateTenantAccess`).
- Keep controllers skinny: validate input, call model layer, handle responses.
- Use parameterized queries only; never interpolate user input into SQL.

## Process Expectations
- Update documentation and progress trackers when a major milestone moves forward.
- Write descriptive commit messages and include a concise PR summary and testing notes with every change.
- Run available linters/tests relevant to the touched packages.

Follow this guide for all future tasks unless new instructions override it.
