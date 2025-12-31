# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is an **e-commerce fashion application** (Cotton Ink style) with:
- Single brand group with multiple categories and products
- Medium-scale application (10-30 pages, 2-5 developers)
- Full e-commerce features: catalog, cart, checkout, auth, wishlist, user profile

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

This is a TanStack Start application using **Feature-Based Architecture**.

**Core Stack:**
- **Framework:** TanStack Start (SSR-capable React framework)
- **Routing:** TanStack Router with file-based routes in `src/routes/`
- **Data Fetching:** TanStack Query (React Query) for server state
- **State Management:** Zustand for client state (cart, wishlist, auth)
- **Styling:** Tailwind CSS v4 with Shadcn UI components
- **Build:** Vite with Nitro for server capabilities
- **Testing:** Vitest (mandatory unit tests for all components)

**Path Aliases:**
- `@/*` maps to `./src/*`

**Code Style (Biome):**
- Indent: tabs
- Quotes: double
- Files excluded from linting: `routeTree.gen.ts`, `styles.css`

**File Naming Convention:**
- Use kebab-case for all file names (e.g., `my-component.tsx`, `api-service.ts`)
- Route files in `src/routes/` should use kebab-case (e.g., `user-profile.tsx`, `api-endpoints.ts`)
- Test files: `component-name.test.tsx` (co-located with source file)

---

## Folder Structure

### Feature-Based Architecture

Organize code by business features/domains, keeping related files together:

```
src/
├── features/              # Business feature modules
│   ├── products/         # Product catalog feature
│   │   ├── components/   # Product-specific components
│   │   ├── hooks/        # Product hooks (useProducts, useFilters)
│   │   ├── api/          # Product API calls & TanStack Query hooks
│   │   ├── store/        # Zustand store (if needed)
│   │   ├── types.ts      # Product TypeScript interfaces
│   │   ├── utils.ts      # Product utilities
│   │   └── index.ts      # Public API (barrel export)
│   ├── cart/
│   ├── auth/
│   ├── wishlist/
│   ├── checkout/
│   └── profile/
├── components/           # Shared/global components
│   ├── ui/              # Shadcn components (auto-generated, don't edit)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   └── common/          # Reusable business components
├── lib/                 # Utilities, helpers, configs
│   ├── utils/           # Pure utility functions
│   ├── constants/       # App-wide constants
│   └── store/           # Zustand middleware & helpers
├── hooks/               # Global hooks only (useMediaQuery, useDebounce)
├── services/            # API client & global services
│   ├── api/             # HTTP client, config, interceptors
│   └── storage/         # localStorage helpers
├── types/               # Global TypeScript types
├── assets/              # Static assets
│   ├── images/          # Images (logo, banners, placeholders)
│   ├── icons/           # Custom SVG icons
│   └── fonts/           # Custom web fonts
└── routes/              # TanStack Router files (presentational only)
```

### Feature Module Anatomy

Each feature is a self-contained module with this structure:

```
features/products/
├── components/           # Product-specific components
│   ├── product-card.tsx
│   ├── product-card.test.tsx      # Mandatory test
│   ├── product-grid.tsx
│   └── product-grid.test.tsx
├── hooks/               # Product-specific hooks
│   ├── use-products.ts
│   └── use-products.test.ts       # Mandatory test
├── api/                 # Product API calls
│   ├── queries.ts       # TanStack Query hooks
│   ├── mutations.ts     # Mutations (if needed)
│   └── endpoints.ts     # API endpoint definitions
├── store/               # Zustand store (optional)
│   └── products-store.ts
├── types.ts             # Product TypeScript interfaces
├── utils.ts             # Product-specific utilities
├── utils.test.ts        # Mandatory test
└── index.ts             # Public API (barrel export)
```

---

## Rules & Best Practices

### 1. Feature Organization

**Core Principles:**
- Each feature is self-contained and portable
- Features export public API via `index.ts` (barrel exports)
- Features CANNOT import from other features directly
- Cross-feature dependencies must go through `components/common/` or `lib/`

**Examples:**
```typescript
// ✅ GOOD - Import from feature's public API
import { ProductCard, useProducts } from '@/features/products'

// ❌ BAD - Don't import directly from internals
import { ProductCard } from '@/features/products/components/product-card'

// ✅ GOOD - Shared component in common
import { PriceDisplay } from '@/components/common/price-display'

// ❌ BAD - Don't import feature component in another feature
import { CartButton } from '@/features/cart/components/cart-button'
```

### 2. Shared Components Strategy

**Rule of Three:**
- Component used in **1 feature** → Keep in `features/xxx/components/`
- Component used in **2 features** → Copy first, refactor later if needed
- Component used in **3+ features** → Move to `components/common/`

**Component Locations:**
- `components/ui/` - Shadcn UI primitives (auto-generated, don't edit manually)
- `components/layout/` - Layout components (Header, Footer, Navbar, Sidebar)
- `components/common/` - Reusable business components (PriceDisplay, RatingStars, ImageGallery)

**Example:**
```typescript
// components/common/price-display.tsx
export function PriceDisplay({ amount }: { amount: number }) {
  return <span>{formatCurrency(amount)}</span>
}
```

### 3. State Management Strategy

**Use TanStack Query for:**
- Server state (products, categories, user data from API)
- Data that needs caching, refetching, sync with server
- Any data fetched from backend

**Use Zustand for:**
- Client-only state (cart items, wishlist, UI preferences)
- State that needs persistence (localStorage)
- Auth state (user session, tokens)
- Global UI state (modals, sidebars)

**Store Organization:**
- **One store per feature domain** (cart store, auth store, wishlist store)
- **Don't create global mega-store** - use multiple small stores
- **Persist only necessary stores**: cart, wishlist, auth (not UI state)
- Store files go in `features/*/store/` or `lib/store/`

**Example:**
```typescript
// features/cart/store/cart-store.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => set((state) => ({
          items: [...state.items, item]
        })),
        removeItem: (productId) => set((state) => ({
          items: state.items.filter(i => i.productId !== productId)
        })),
        clearCart: () => set({ items: [] })
      }),
      { name: 'cart-storage' }
    )
  )
)

// features/cart/index.ts
export { useCartStore } from './store/cart-store'
```

### 4. API & Data Fetching

**Structure:**
```
services/api/
├── client.ts        # HTTP client with interceptors
├── config.ts        # API base URL, timeouts, defaults
└── types.ts         # Global API response types

features/products/api/
├── queries.ts       # TanStack Query hooks
├── mutations.ts     # Mutations
└── endpoints.ts     # API endpoint definitions
```

**Guidelines:**
- All HTTP calls must go through `services/api/client.ts`
- TanStack Query hooks in `features/*/api/queries.ts`
- Query keys use array convention: `['resource', params]`
- Mock data stays in feature API files until backend is ready
- Error handling at client level (global interceptors)

**Example:**
```typescript
// features/products/api/queries.ts
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters)
  })
}

// features/products/api/endpoints.ts
export const productEndpoints = {
  list: '/products',
  detail: (id: string) => `/products/${id}`,
  search: '/products/search'
}
```

### 5. TypeScript Types

**Type Organization:**
- Global types → `types/common.ts`
- Feature-specific types → `features/*/types.ts`
- Always export via `index.ts` (barrel exports)

**Import Rules:**
```typescript
// ✅ GOOD - Import from public API
import { Product } from '@/features/products'
import { ApiResponse } from '@/types'

// ❌ BAD - Don't import directly from types.ts
import { Product } from '@/features/products/types'
```

**Example:**
```typescript
// types/common.ts - Global types
export interface PaginationParams {
  page: number
  limit: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

// features/products/types.ts - Feature types
export interface Product {
  id: string
  name: string
  price: number
}

// features/products/index.ts - Export
export type { Product, ProductFilters } from './types'
```

### 6. Hooks Organization

**Global Hooks** (`hooks/`):
- Generic, reusable across ANY feature
- No business logic
- Examples: `useMediaQuery`, `useDebounce`, `useLocalStorage`, `useClickOutside`

**Feature Hooks** (`features/*/hooks/`):
- Business logic specific to that feature
- Can use global hooks and feature store
- Examples: `useProductFilters`, `useCheckoutFlow`, `useCartSync`

**Example:**
```typescript
// hooks/use-debounce.ts - Global hook
export function useDebounce<T>(value: T, delay: number): T {
  // ... generic debounce logic
}

// features/products/hooks/use-product-filters.ts - Feature hook
import { useProductsStore } from '../store/products-store'
import { useDebounce } from '@/hooks/use-debounce'

export function useProductFilters() {
  const { filters, setFilters } = useProductsStore()
  const debouncedSearch = useDebounce(filters.search, 300)

  return { filters, debouncedSearch, updateFilters: setFilters }
}
```

### 7. Routing Strategy

**Route files = Presentational only**
- Route files handle routing & layout ONLY
- Business logic stays in features
- Keep routes thin and simple

**File Naming:**
- Dynamic routes: `$id.tsx`, `$slug.tsx`
- Static routes: `about.tsx`, `contact.tsx`
- Index routes: `index.tsx`
- Non-route files/folders: prefix with `_`

**Example:**
```typescript
// ✅ GOOD - Thin route file
// routes/products/index.tsx
import { ProductList } from '@/features/products'

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <ProductList />
    </div>
  )
}

// ❌ BAD - Don't put business logic in routes
export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({})
  // ... lots of logic here
}
```

### 8. Utilities & Constants

**Utilities** (`lib/utils/`):
- Pure functions only, no side effects
- Generic and reusable

**Constants** (`lib/constants/`):
- App-wide constants, routes, feature flags

**Example:**
```typescript
// lib/utils/format.ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount)
}

// lib/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout'
} as const
```

### 9. Assets Organization

**Structure:**
```
assets/
├── images/
│   ├── logo/              # Brand logos
│   ├── placeholders/      # Placeholder images
│   └── banners/           # Hero/banner images
├── icons/
│   ├── social/            # Social media icons
│   └── custom/            # Custom SVG icons (non-Lucide)
└── fonts/                 # Custom web fonts
```

**Guidelines:**
- Product images from CDN/Backend (URLs in database)
- Static images in `assets/images/`
- Prefer Lucide icons (already configured)
- Custom SVG icons in `assets/icons/`

**Import Pattern:**
```typescript
// Import static assets
import logo from '@/assets/images/logo/logo.svg'
import { ShoppingCart } from 'lucide-react' // Lucide icons

// Product images from API
<img src={product.imageUrl} /> // URL from backend
```

---

## Testing Requirements

### Mandatory Unit Testing

**Every component, hook, and utility MUST have a test file.**

**Rules:**
1. **Test file naming:** `component-name.test.tsx` (co-located with source)
2. **No exceptions:** Creating a component without a test = PR REJECTED
3. **Test files created at the same time** as the component/hook/util

**File Structure:**
```
features/products/components/
├── product-card.tsx
├── product-card.test.tsx       # MANDATORY
├── product-grid.tsx
└── product-grid.test.tsx       # MANDATORY

components/common/
├── price-display.tsx
└── price-display.test.tsx      # MANDATORY
```

**Minimum Test Coverage:**
```typescript
// product-card.test.tsx
describe('ProductCard', () => {
  it('renders product name and price', () => {})
  it('handles click events', () => {})
  it('displays correct image', () => {})
  it('shows out of stock state', () => {})
})
```

**Testing Checklist (must cover):**
- ✅ Rendering with props
- ✅ User interactions (click, hover, input)
- ✅ Conditional rendering (loading, error, empty states)
- ✅ Edge cases (null, undefined, empty data)

**PR/Commit Rules:**
- Component without test = PR REJECTED
- CI/CD must run tests before merge
- Consider git pre-commit hooks to enforce test file existence

---

## Quick Reference

### When to use what?

| Need | Solution |
|------|----------|
| Server data (products, users) | TanStack Query |
| Client state (cart, wishlist) | Zustand + persist |
| Global UI state (modals) | Zustand or React Context |
| Reusable utility | `lib/utils/` |
| Feature-specific logic | `features/*/` |
| Shared component (3+ features) | `components/common/` |
| Layout component | `components/layout/` |
| Global hook | `hooks/` |
| Feature hook | `features/*/hooks/` |
| Static assets | `assets/` |
| Product images | CDN/Backend URLs |

### Import Patterns

```typescript
// Features
import { ProductCard, useProducts } from '@/features/products'

// Shared components
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/common/price-display'

// Utils & constants
import { formatCurrency } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'

// Types
import { ApiResponse } from '@/types'

// Assets
import logo from '@/assets/images/logo/logo.svg'
import { ShoppingCart } from 'lucide-react'
```
