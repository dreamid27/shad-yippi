# Enhanced Categories Page Filtering Design

## Overview

Redesign the filtering and layout on the categories page to improve mobile responsiveness and user experience. The current layout consumes too much vertical space with visible categories and brands filters, making it difficult to use on mobile devices.

## Goals

- Reduce vertical space consumed by filters
- Improve mobile user experience
- Better organize filter controls (search, sort, filter)
- Make brands, sizes, and price filters accessible but not intrusive

## Layout Structure

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [← BACK]  COLLECTIONS    [Search............]       │
├─────────────────────────────────────────────────────────────┤
│ Categories: [ALL] [OUTERWEAR] [KNITWEAR] [BOTTOMS] →→→       │
├─────────────────────────────────────────────────────────────┤
│ Toolbar:                       [Sort▼]        [Filters▼]    │
└─────────────────────────────────────────────────────────────┘
│ Active Filters: 24 items  [BRAND×] [SIZES×] [PRICE×] Clear │
└─────────────────────────────────────────────────────────────┘
│ Products Grid                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Default)

```
┌─────────────────────────────────────────┐
│ Header: [←] COLLECTIONS          [🔍]    │
├─────────────────────────────────────────┤
│ Categories: [ALL] [OUTERWEAR] →→→       │
├─────────────────────────────────────────┤
│ Toolbar:        [Sort▼]    [Filters▼]  │
└─────────────────────────────────────────┘
│ Active Filters: 24 items  [BRAND×] Clear│
└─────────────────────────────────────────┘
│ Products Grid (1 column)                │
└─────────────────────────────────────────┘
```

### Mobile Layout (Search Active)

```
┌─────────────────────────────────────────┐
│ Header: [←] [Search............] [✕]     │
├─────────────────────────────────────────┤
│ Categories: [ALL] [OUTERWEAR] →→→       │
├─────────────────────────────────────────┤
│ Toolbar:        [Sort▼]    [Filters▼]  │
└─────────────────────────────────────────┘
```

## Components

### 1. Header

**Desktop:**
- Back button with "BACK" text
- Title: "COLLECTIONS"
- Search input (visible by default, full width available)
- Sticky at top

**Mobile:**
- Back icon only (no text)
- Title: "COLLECTIONS"
- Search icon button (toggles search input)
- When search active: header transforms to show input + X close button
- Sticky at top

### 2. Categories Tabs

- Horizontal scrollable tabs
- Sticky position below header
- Active category: bold text with bottom border
- Unselected: gray text, hover effect
- Consistent styling between desktop and mobile
- All categories always visible (scrollable if needed)

### 3. Toolbar

Contains: Sort dropdown + Filter button

**Desktop:**
- Right-aligned
- Sort dropdown with options: Featured, Price Low-High, Price High-Low, Name A-Z
- Filter button with badge showing count of active filters (brands, sizes, price)

**Mobile:**
- Full-width layout
- Sort and Filter buttons stacked vertically
- Filter button with badge for active filters

### 4. Filter Drawer

**Desktop:**
- Slide-in panel from right side (width ~400px)
- Dark overlay behind drawer
- Contains: Brands, Sizes, Price Range sections
- Bottom: Apply Filters + Clear All buttons
- Smooth slide animation (300ms)

**Mobile:**
- Full-screen panel from bottom to top
- No overlay (fills entire screen)
- Same content as desktop
- Sticky Apply/Clear buttons at bottom
- Slide animation (300ms)

**Filter Options:**
- **Brands:** Checkbox or toggle buttons, multi-select
- **Sizes:** XS, S, M, L, XL (multi-select)
- **Price Range:** Under $500, $500-$1000, $1000+ (single select)

### 5. Active Filters Chips

- Appears only when filters are active (brand, size, or price)
- Shows item count: "X items found"
- Each chip shows: Brand name, "X sizes", or price range
- Each chip has X button to remove that filter
- "Clear All" button on right side
- Note: Category and search query NOT shown in chips (already visible above)

### 6. Products Grid

**Desktop:**
- 3 columns
- Product cards with image, name, price, badge
- Hover effects

**Mobile:**
- 1 column
- Full-width product cards
- Stacked layout

## State Management

```typescript
interface FiltersState {
  category: string | null // default: null (All)
  search: string // default: ''
  brand: string | null // default: null
  sizes: string[] // default: []
  priceRange: string | null // default: null
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name' // default: 'featured'
  isSearchActive: boolean // default: false
  isFilterDrawerOpen: boolean // default: false
}

// Derived state
interface ActiveFilter {
  type: 'brand' | 'size' | 'price'
  label: string
}
```

## Key Improvements

1. **Reduced Vertical Space**: Brands, sizes, and price moved to drawer, saving significant space
2. **Better Mobile UX**: Search toggle icon, stacked controls, appropriate touch targets
3. **Organized Controls**: Search in header, categories as tabs, sort/filter in toolbar
4. **Filter Visibility**: Active filters shown as chips for easy removal
5. **Consistent UX**: Categories tabs work same way as menus page

## Responsive Breakpoints

- **Mobile**: < 768px
- **Desktop**: >= 768px

## Transitions & Animations

- Header search toggle: fade/slide (200ms)
- Categories tabs: horizontal scroll
- Filter drawer: slide from right/bottom (300ms)
- Active filter chips: fade in (200ms)

## Accessibility Considerations

- Focus management when opening/closing drawer
- Keyboard navigation for all controls
- ARIA labels for filter counts
- Touch-friendly button sizes (min 44x44px)
