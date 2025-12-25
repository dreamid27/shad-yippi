# Menus Page UI/UX Design

## Overview

Clean, modern restaurant menu browsing and ordering page at `/menus` with focus on food photography and intuitive user experience.

## Visual Style

- **Colors**: White background, subtle gray accents (#f8fafc, #e2e8f0), vibrant orange primary (#f97316) for CTAs
- **Typography**: Inter font - names 18px semibold, descriptions 14px regular (#64748b), prices 16px bold
- **Spacing**: Generous whitespace (24-32px padding), 8px border radius
- **Images**: Consistent 4:3 aspect ratio (400x300px), progressive loading
- **Interactions**: Subtle hover effects, 2px shadow on card hover, smooth transitions

## Layout Structure

**Header (fixed at top)**
- Restaurant logo/name (left)
- Search bar (center, 300px desktop / full-width mobile)
- User actions (right)
- Category tabs (sticky, immediately below)

**Content Section (scrollable)**
- Category title + description header
- Grid of menu items for selected category
- Responsive grid (3 columns desktop / 2 tablet / 1 mobile)

**Floating Elements**
- Cart button fixed bottom-right (24px edges, 56px size, orange)
- Cart icon with circular badge (red, 18px) showing item count

## Component Hierarchy (kebab-case)

```
menus.tsx
├── header.tsx
│   ├── restaurant-logo
│   ├── search-input
│   └── user-actions
├── category-tabs.tsx
└── category-section
    ├── category-header.tsx
    └── menu-items-grid.tsx
        └── menu-item-card.tsx (repeated)
```

## Menu Item Card

**Layout:**
- 4:3 image at top (fills card width)
- Content padding: 16px
- Height varies by description length

**Content (top to bottom):**
1. Item name (18px semibold, dark slate)
2. Description (14px, muted gray, max 3 lines with ellipsis)
3. Badges row (20px height pills):
   - Popular (red bg, white text)
   - Chef's Special (gold bg, dark text)
   - Customer Choice (purple bg, white text)
   - Vegan/Vegetarian (green bg, white text)
4. Dietary icons (16px): vegan, vegetarian, gluten-free, halal
5. Bottom row (flex space-between):
   - Price: $XX.XX (16px bold, orange)
   - Add to cart button: Small rounded (h-8 px-4), orange, white "+ Add" text

**Hover state:** 8px shadow, image scale 1.02x, button background darkens

## Category Tabs

**Tab bar:**
- Fixed at top (below header, z-index 40)
- White bg with bottom border (#e2e8f0)
- Horizontal scroll (hidden scrollbar)
- 48px height, comfortable tap targets

**Individual tab:**
- Padding: 12px 20px
- Text: 14px medium, gray (#64748b)
- Active: Orange (#f97316) text + 2px orange bottom border
- Smooth transition
- First category selected by default

**Mobile:** Swipable horizontal scroll, auto-scroll to center on selection

**Loading:** Small spinner below active tab during data fetch

## Search & Filters

**Search bar:**
- Centered in header
- Rounded input (32px height, 300px desktop / full-width mobile)
- Search icon left, "Search menu..." placeholder
- Real-time search with 300ms debounce
- Shows matching results from current category

**Filters:**
- Collapsible panel triggered by filter icon in header
- Filters: Dietary (vegan, vegetarian, gluten-free, halal), Spice Level (mild, medium, hot), Price Range (slider)
- Active filters shown as removable chips below search bar
- Clear all filters button when active

**Filter panel:**
- Desktop: Dropdown below search (300px width)
- Mobile: Bottom sheet from bottom, "Apply" button sticky

**Search results:**
- Category tabs fade/disabled during search
- All matching items across categories
- Category label shown on each card
- "Clear search" button appears

**Empty states:**
- No results: Illustration + "No items found" + suggestion
- No filters match: "No items match your filters" + "Clear filters" button

## Cart Design

**Floating cart button:**
- Fixed bottom-right (24px from edges)
- 56px circular, orange (#f97316) with white cart icon
- Badge: 18px red (#ef4444) in top-right, white text (item count)
- Bounce animation on item add
- Z-index 50

**Cart modal:**
- Full-screen mobile / centered modal desktop (max-width 480px)
- White bg with shadow
- Header: "Your Cart" + close button
- Body: Cart items list
- Footer: Subtotal, tax (10%), total, checkout button

**Cart item:**
- Horizontal flex row
- Image (60x60px, rounded)
- Details (name, quantity, price)
- Quantity controls (+/-, input field)
- Remove button (trash icon)
- Customization notes below name

**Empty cart:**
- Illustration, "Your cart is empty"
- "Start ordering" button scrolls to items

**Footer:**
- Subtotal, Tax, Total (bold, larger)
- Checkout button: full-width, orange

## Loading & Error States

**Page loading:**
- Skeleton cards in 3x3 grid with shimmer animation
- Category tabs show loading spinners
- Smooth transition to content

**Category loading:**
- Spinner below active tab
- Existing items visible while fetching
- Min 400ms to prevent flicker

**Network error:**
- Full-page illustration
- "Unable to load menu" message
- Retry button (orange)
- Offline: cached menu + "Offline mode" banner

**Empty category:**
- Centered illustration
- "No items in this category"
- Button to explore other categories

**Progressive loading:**
- Blur-up image placeholders
- Lazy loading below fold
- Smooth fade to high-res

## Responsive Design

**Mobile (320px - 767px):**
- Header: Stacked, search full-width
- Category tabs: Full-width horizontal scroll
- Menu grid: 1 column
- Cart button: Fixed bottom-right
- Filters: Bottom sheet with "Apply" button
- Spacing: 16px padding
- Typography: 14-16px body

**Tablet (768px - 1023px):**
- Header: Side-by-side
- Category tabs: Horizontal scroll, centered
- Menu grid: 2 columns, 24px gap
- Filters: Dropdown
- Spacing: 24px padding

**Desktop (1024px+):**
- Header: Centered content (max-width 1200px)
- Category tabs: Horizontal scroll, centered
- Menu grid: 3 columns, 32px gap
- Cart modal: Centered (max-width 480px)
- Filters: Dropdown, wider panel
- Spacing: 32px padding
- Hover effects: shadows, scale, transitions
- Images: Full resolution (800x600px)

## File Structure

```
src/
├── routes/
│   └── menus.tsx                 # Main page route
├── components/
│   └── menu/
│       ├── header.tsx            # Fixed header with search
│       ├── category-tabs.tsx     # Sticky category navigation
│       ├── category-header.tsx   # Category title + description
│       ├── menu-items-grid.tsx   # Grid layout for items
│       ├── menu-item-card.tsx    # Individual item card
│       ├── dietary-badge.tsx     # Dietary restriction badges
│       ├── spice-indicator.tsx   # Spice level icons
│       ├── cart-button.tsx       # Floating cart button
│       ├── cart-modal.tsx        # Cart modal/panel
│       ├── cart-item.tsx         # Individual cart item
│       ├── filters-panel.tsx     # Filter dropdown/bottom sheet
│       ├── filter-chips.tsx      # Active filter chips
│       ├── loading-skeleton.tsx  # Card loading state
│       └── error-state.tsx       # Error display component
├── hooks/
│   └── use-cart.ts               # Cart state management
└── services/
    └── api.ts                    # Already has menu API functions
```

## Data Flow

1. `menus.tsx` fetches menu categories and items on mount
2. React Query (`useQuery`) for categories and items
3. Selected category passed as query param for items
4. Search/filter state managed in component, derived filtered items
5. Cart state via `useCart` hook (Context API)
6. Components subscribe to state via props/context

## State Management

- **Menu data**: React Query (server state)
- **Cart**: Context API + localStorage persistence
- **UI state**: Component state (selected category, search, filters)
- **Loading/error**: React Query built-in

## Key Features

- Clean, food-first visual design
- Sticky category navigation
- Real-time search with debouncing
- Comprehensive dietary and price filters
- Floating cart with badge
- Responsive across all devices
- Progressive image loading
- Smooth animations and transitions
- Accessible touch targets and keyboard navigation
