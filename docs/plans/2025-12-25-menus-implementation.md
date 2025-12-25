# Menus Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clean, modern restaurant menu browsing and ordering page at `/menus` with category navigation, search/filtering, and cart functionality.

**Architecture:** TanStack Start file-based routing with React Query for data fetching, Context API for cart state, and Shadcn UI components. Mock API data from existing `api.ts` will be used.

**Tech Stack:** TanStack Start, React Query, Context API, Tailwind CSS v4, Shadcn UI, TypeScript

---

## Phase 1: Core Infrastructure

### Task 1: Create useCart hook

**Files:**
- Create: `src/hooks/use-cart.ts`

**Step 1: Write cart interface and context**

```typescript
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { MenuItem } from '@/services/api'

export interface CartItem extends MenuItem {
  quantity: number
  customizations?: Record<string, string>
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem, customizations?: Record<string, string>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const saveCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [])

  const addItem = useCallback((item: MenuItem, customizations?: Record<string, string>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      let newItems
      if (existing) {
        newItems = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...prev, { ...item, quantity: 1, customizations }]
      }
      saveCart(newItems)
      return newItems
    })
  }, [saveCart])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id)
      saveCart(newItems)
      return newItems
    })
  }, [saveCart])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => {
      const newItems = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      saveCart(newItems)
      return newItems
    })
  }, [saveCart, removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('cart')
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

**Step 2: Add CartProvider to root layout**

**Modify:** `src/routes/__root.tsx`

Find the root component and wrap it with CartProvider.

**Step 3: Commit**

```bash
git add src/hooks/use-cart.ts src/routes/__root.tsx
git commit -m "feat: add cart context hook with localStorage persistence"
```

---

### Task 2: Create loading skeleton component

**Files:**
- Create: `src/components/menu/loading-skeleton.tsx`

**Step 1: Write skeleton card component**

```typescript
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/loading-skeleton.tsx
git commit -m "feat: add loading skeleton component for menu items"
```

---

### Task 3: Create error state component

**Files:**
- Create: `src/components/menu/error-state.tsx`

**Step 1: Write error state component**

```typescript
interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load menu</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/error-state.tsx
git commit -m "feat: add error state component with retry functionality"
```

---

### Task 4: Create header component

**Files:**
- Create: `src/components/menu/header.tsx`

**Step 1: Write header component**

```typescript
import { Search } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onSearch: (query: string) => void
  searchQuery: string
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const [input, setInput] = useState(searchQuery)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    // Debounce could be added here
    onSearch(value)
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="font-semibold text-xl text-gray-900">Restaurant Menu</div>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-100 rounded-full" />
      </div>
    </header>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/header.tsx
git commit -m "feat: add header component with search input"
```

---

## Phase 2: Category Navigation

### Task 5: Create category tabs component

**Files:**
- Create: `src/components/menu/category-tabs.tsx`

**Step 1: Write category tabs component**

```typescript
import type { MenuCategory } from '@/services/api'

interface CategoryTabsProps {
  categories: MenuCategory[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  isLoading?: boolean
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[73px] z-20 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 py-3">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.display_name}
            </button>
          ))}
          {isLoading && (
            <div className="flex items-center px-4">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/category-tabs.tsx
git commit -m "feat: add sticky category tabs navigation"
```

---

### Task 6: Create category header component

**Files:**
- Create: `src/components/menu/category-header.tsx`

**Step 1: Write category header component**

```typescript
import type { MenuCategory } from '@/services/api'

interface CategoryHeaderProps {
  category: MenuCategory | null
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  if (!category) {
    return (
      <div className="px-4 py-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">All Menu Items</h1>
        <p className="text-gray-600 mt-1">Browse all delicious options</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">{category.display_name}</h1>
      <p className="text-gray-600 mt-1">{category.description}</p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/category-header.tsx
git commit -m "feat: add category header with title and description"
```

---

## Phase 3: Menu Item Display

### Task 7: Create dietary badge component

**Files:**
- Create: `src/components/menu/dietary-badge.tsx`

**Step 1: Write dietary badge component**

```typescript
import type { MenuItem } from '@/services/api'

interface DietaryBadgeProps {
  item: MenuItem
}

export function DietaryBadge({ item }: DietaryBadgeProps) {
  const badges: Array<{ label: string; show: boolean; bgColor: string; textColor: string }> = [
    { label: 'Popular', show: item.badges.popular, bgColor: 'bg-red-500', textColor: 'text-white' },
    { label: 'Chef\'s Special', show: item.badges.chef_special, bgColor: 'bg-yellow-500', textColor: 'text-gray-900' },
    { label: 'Vegan', show: item.dietary.vegan, bgColor: 'bg-green-500', textColor: 'text-white' },
    { label: 'Vegetarian', show: item.dietary.vegetarian, bgColor: 'bg-green-500', textColor: 'text-white' },
  ]

  const visibleBadges = badges.filter((b) => b.show)

  if (visibleBadges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {visibleBadges.slice(0, 3).map((badge, idx) => (
        <span
          key={idx}
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.bgColor} ${badge.textColor}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/dietary-badge.tsx
git commit -m "feat: add dietary badge component for item tags"
```

---

### Task 8: Create spice indicator component

**Files:**
- Create: `src/components/menu/spice-indicator.tsx`

**Step 1: Write spice indicator component**

```typescript
import { Flame } from 'lucide-react'
import type { MenuItem } from '@/services/api'

interface SpiceIndicatorProps {
  item: MenuItem
}

export function SpiceIndicator({ item }: SpiceIndicatorProps) {
  const spiceLevels = { mild: 1, medium: 2, hot: 3 }
  const level = spiceLevels[item.spice_level]

  return (
    <div className="flex gap-0.5 mt-2" title={`Spice level: ${item.spice_level}`}>
      {[1, 2, 3].map((i) => (
        <Flame
          key={i}
          className={`h-3 w-3 ${i <= level ? 'fill-orange-500 text-orange-500' : 'text-gray-200'}`}
        />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/spice-indicator.tsx
git commit -m "feat: add spice indicator component with chili pepper icons"
```

---

### Task 9: Create menu item card component

**Files:**
- Create: `src/components/menu/menu-item-card.tsx`

**Step 1: Write menu item card component**

```typescript
import { Plus } from 'lucide-react'
import type { MenuItem } from '@/services/api'
import { DietaryBadge } from './dietary-badge'
import { SpiceIndicator } from './spice-indicator'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={item.photos[0]}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        {item.reviews.rating >= 4.5 && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
            ★ {item.reviews.rating}
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <DietaryBadge item={item} />
        <SpiceIndicator item={item} />
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-lg text-orange-600">${item.price}</span>
          <button
            onClick={() => onAddToCart(item)}
            className="h-8 px-4 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/menu-item-card.tsx
git commit -m "feat: add menu item card component with image, details, and add button"
```

---

### Task 10: Create menu items grid component

**Files:**
- Create: `src/components/menu/menu-items-grid.tsx`

**Step 1: Write menu items grid component**

```typescript
import { MenuItemCard } from './menu-item-card'
import { LoadingSkeleton } from './loading-skeleton'
import type { MenuItem } from '@/services/api'

interface MenuItemsGridProps {
  items: MenuItem[]
  isLoading: boolean
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemsGrid({ items, isLoading, onAddToCart }: MenuItemsGridProps) {
  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">Try a different search or category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/menu-items-grid.tsx
git commit -m "feat: add menu items grid component with responsive layout"
```

---

## Phase 4: Cart Components

### Task 11: Create cart button component

**Files:**
- Create: `src/components/menu/cart-button.tsx`

**Step 1: Write cart button component**

```typescript
import { ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface CartButtonProps {
  itemCount: number
  onClick: () => void
}

export function CartButton({ itemCount, onClick }: CartButtonProps) {
  const [animate, setAnimate] = useState(false)
  const prevCountRef = useRef(itemCount)

  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 500)
    }
    prevCountRef.current = itemCount
  }, [itemCount])

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors z-50 ${animate ? 'animate-bounce' : ''}`}
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/cart-button.tsx
git commit -m "feat: add floating cart button with item count badge and bounce animation"
```

---

### Task 12: Create cart item component

**Files:**
- Create: `src/components/menu/cart-item.tsx`

**Step 1: Write cart item component**

```typescript
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/hooks/use-cart'

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
      <img
        src={item.photos[0]}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-orange-600 font-semibold">${item.price}</p>
        {item.customizations && (
          <p className="text-xs text-gray-500 mt-1">
            {Object.entries(item.customizations).map(([key, value]) => `${key}: ${value}`).join(', ')}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/menu/cart-item.tsx
git commit -m "feat: add cart item component with quantity controls and remove button"
```

---

### Task 13: Create cart modal component

**Files:**
- Create: `src/components/menu/cart-modal.tsx`

**Step 1: Write cart modal component**

```typescript
import { X } from 'lucide-react'
import type { CartItem } from '@/hooks/use-cart'
import { CartItemComponent } from './cart-item'

interface CartModalProps {
  items: CartItem[]
  subtotal: number
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onClearCart: () => void
}

export function CartModal({
  items,
  subtotal,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onClearCart,
}: CartModalProps) {
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Start adding some delicious items!</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Add missing import**

Add `import { ShoppingCart } from 'lucide-react'` at the top of the file.

**Step 3: Commit**

```bash
git add src/components/menu/cart-modal.tsx
git commit -m "feat: add cart modal component with items list and checkout summary"
```

---

## Phase 5: Main Page Integration

### Task 14: Create main menus route

**Files:**
- Create: `src/routes/menus.tsx`

**Step 1: Write the main menus page**

```typescript
import { createFileRoute, useQuery } from '@tanstack/react-router'
import { useState } from 'react'
import { fetchMenuCategories, fetchMenuItems, type MenuItem } from '@/services/api'
import { useCart } from '@/hooks/use-cart'
import { Header } from '@/components/menu/header'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { CategoryHeader } from '@/components/menu/category-header'
import { MenuItemsGrid } from '@/components/menu/menu-items-grid'
import { CartButton } from '@/components/menu/cart-button'
import { CartModal } from '@/components/menu/cart-modal'
import { ErrorState } from '@/components/menu/error-state'

export const Route = createFileRoute('/menus')({
  component: MenusPage,
})

function MenusPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: fetchMenuCategories,
  })

  const {
    data: items,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ['menu-items', selectedCategory],
    queryFn: () => fetchMenuItems(selectedCategory || undefined),
  })

  const cart = useCart()

  const selectedCategoryData = categories?.find((c) => c.id === selectedCategory)

  // Filter items by search query
  const filteredItems = items?.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCart = (item: MenuItem) => {
    cart.addItem(item)
    // Brief feedback could be added here
  }

  if (categoriesError || itemsError) {
    return (
      <div>
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <ErrorState
          message="Something went wrong loading the menu. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      {categories && (
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isLoading={itemsLoading}
        />
      )}
      <CategoryHeader category={selectedCategoryData || null} />
      {filteredItems && (
        <MenuItemsGrid
          items={filteredItems}
          isLoading={itemsLoading}
          onAddToCart={handleAddToCart}
        />
      )}
      <CartButton itemCount={cart.itemCount} onClick={() => setIsCartOpen(true)} />
      <CartModal
        items={cart.items}
        subtotal={cart.subtotal}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeItem}
        onCheckout={() => {
          alert('Checkout functionality coming soon!')
          setIsCartOpen(false)
        }}
        onClearCart={cart.clearCart}
      />
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/routes/menus.tsx
git commit -m "feat: add main menus page with category navigation and cart integration"
```

---

### Task 15: Fix cart modal component (add missing import)

**Files:**
- Modify: `src/components/menu/cart-modal.tsx`

**Step 1: Add missing ShoppingCart import**

At line 1, add:
```typescript
import { X, ShoppingCart } from 'lucide-react'
```

**Step 2: Commit**

```bash
git add src/components/menu/cart-modal.tsx
git commit -m "fix: add missing ShoppingCart import to cart modal"
```

---

### Task 16: Add styles for scrollbar-hide

**Files:**
- Modify: `src/styles.css` or `src/app.css`

**Step 1: Add scrollbar-hide utility**

Add this CSS to your global styles file:

```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**Step 2: Commit**

```bash
git add src/styles.css
git commit -m "style: add scrollbar-hide utility for category tabs"
```

---

## Phase 6: Testing & Verification

### Task 17: Run development server

**Step 1: Start dev server**

```bash
bun --bun run dev
```

**Step 2: Verify functionality**

Visit `http://localhost:3000/menus` and verify:
- Categories load and display in tabs
- First category is selected by default
- Menu items display in grid layout
- Search bar filters items
- Add to cart works and increments badge
- Cart modal opens and shows items
- Quantity controls work in cart

---

### Task 18: Run build

**Step 1: Build project**

```bash
bun --bun run build
```

**Expected:** Build succeeds without errors

---

### Task 19: Format code

**Step 1: Run Biome format**

```bash
bun --bun run format
```

**Step 2: Commit any formatting changes**

```bash
git add -A
git commit -m "style: format code with Biome"
```

---

## Summary

This implementation creates:
- Complete cart state management with localStorage persistence
- Category-based menu navigation with sticky tabs
- Responsive menu item cards with images, descriptions, and dietary badges
- Search functionality
- Floating cart button with item count
- Full cart modal with checkout summary
- Loading skeletons and error states
- All components use kebab-case naming convention

Total: 19 tasks organized into 6 phases
