# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun install              # Install dependencies
bun --bun run dev        # Start dev server on port 3000
bun --bun run build      # Production build
bun --bun run test       # Run tests (Vitest)
bun --bun run lint       # Lint with Biome
bun --bun run format     # Format with Biome
bun --bun run check      # Full Biome check
```

## Adding Shadcn Components

```bash
pnpm dlx shadcn@latest add <component>
```

Shadcn is configured with:
- Style: `new-york`
- Base color: `zinc`
- CSS variables enabled
- Icon library: `lucide`

## Architecture

This is a TanStack Start application with file-based routing.

**Core Stack:**
- **Framework:** TanStack Start (SSR-capable React framework)
- **Routing:** TanStack Router with file-based routes in `src/routes/`
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4 with Shadcn UI components
- **Build:** Vite with Nitro for server capabilities

**Key Files:**
- `src/routes/__root.tsx` - Root layout with QueryClientProvider, Header, and devtools
- `src/router.tsx` - Router factory with scroll restoration
- `src/routeTree.gen.ts` - Auto-generated route tree (do not edit)
- `src/services/api.ts` - API client (connects to `localhost:8089`)

**Path Aliases:**
- `@/*` maps to `./src/*`

**Code Style (Biome):**
- Indent: tabs
- Quotes: double
- Files excluded from linting: `routeTree.gen.ts`, `styles.css`

**File Naming Convention:**
- Use kebab-case for all file names (e.g., `my-component.tsx`, `api-service.ts`)
- Route files in `src/routes/` should use kebab-case (e.g., `user-profile.tsx`, `api-endpoints.ts`)

## Routes

Routes are files in `src/routes/`. TanStack Router auto-generates the route tree.
- File naming: `start.ssr.tsx` creates nested route `/start/ssr`
- Demo routes in `src/routes/demo/` can be safely deleted
