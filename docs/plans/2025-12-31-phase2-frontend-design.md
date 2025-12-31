# Phase 2 Frontend Design - Product Catalog & Cart System

**Date:** 2025-12-31
**Project:** shad-yippi (Frontend)
**Phase:** 2 - Product Catalog & Cart (Week 3-4)
**Status:** Design Complete, Ready for Implementation

---

## Executive Summary

This document details the technical design for Phase 2 frontend implementation, covering:
- **Product Catalog Integration** with backend API (search, filters, pagination)
- **Dynamic Variant Selector** for flexible JSONB attributes
- **Cart System** with guest cart (localStorage) and auto-merge on login
- **Stock Validation** at checkout to prevent overselling

**Key Design Decisions:**
1. ✅ **Dynamic variant selector** - Auto-detect attribute types from API (size, color, custom)
2. ✅ **Guest cart in localStorage** - No login required for shopping
3. ✅ **Auto-merge on login** - Seamless UX with silent sync
4. ✅ **Validate stock at checkout only** - Minimal friction, optimistic UI
5. ✅ **Reuse existing UI** - Adjust categories & product detail pages with real API

---

## Architecture & Data Flow

### Feature-Based Structure

Following CLAUDE.md architecture guidelines:

```
src/features/
├── products/
│   ├── components/
│   │   ├── product-card.tsx          # Reusable product card
│   │   ├── product-grid.tsx          # Grid layout with loading states
│   │   ├── product-filters.tsx       # Filter drawer (existing, adjust)
│   │   ├── product-search.tsx        # Search bar component
│   │   ├── variant-selector.tsx      # ⭐ NEW: Dynamic variant UI
│   │   ├── stock-indicator.tsx       # ⭐ NEW: Stock availability badge
│   │   ├── product-skeleton.tsx      # ⭐ NEW: Loading skeleton
│   │   └── product-card.test.tsx     # Unit tests
│   ├── hooks/
│   │   ├── use-products.ts           # TanStack Query for product list
│   │   ├── use-product-detail.ts     # TanStack Query for single product
│   │   ├── use-product-filters.ts    # Filter state management
│   │   └── use-variant-selection.ts  # ⭐ NEW: Variant selection logic
│   ├── api/
│   │   ├── queries.ts                # Product API calls
│   │   └── endpoints.ts              # API endpoint definitions
│   ├── types.ts                      # Product, Variant, Filter types
│   └── index.ts                      # Public API exports
│
├── cart/
│   ├── components/
│   │   ├── cart-item.tsx             # Single cart item row
│   │   ├── cart-summary.tsx          # Price summary section
│   │   ├── cart-empty.tsx            # Empty cart state
│   │   └── cart-item.test.tsx        # Unit tests
│   ├── hooks/
│   │   ├── use-cart.ts               # ⭐ REFACTOR: Cart operations
│   │   ├── use-cart-sync.ts          # ⭐ NEW: Sync localStorage ↔ backend
│   │   └── use-checkout-validation.ts # ⭐ NEW: Stock validation
│   ├── store/
│   │   └── cart-store.ts             # ⭐ REFACTOR: Zustand + localStorage
│   ├── api/
│   │   ├── queries.ts                # Cart API calls
│   │   └── endpoints.ts              # /api/cart/* endpoints
│   ├── types.ts                      # Cart, CartItem types
│   └── index.ts                      # Public API exports
│
├── components/common/
│   ├── pagination.tsx                # ⭐ NEW: Pagination component
│   └── pagination.test.tsx
```

### Data Flow

**Guest User Flow:**
```
Product Page → Add to Cart → localStorage (guest_cart) → Zustand state
→ Cart Page (read from localStorage)
→ Checkout → Stock Validation
```

**Authenticated User Flow:**
```
Product Page → Add to Cart → POST /api/cart/items → Backend DB
→ Update Zustand state
→ Cart Page (GET /api/cart)
→ Checkout → Stock Validation → Proceed
```

**Login Event Flow:**
```
User has guest cart in localStorage
→ Login successful (auth token received)
→ useCartSync hook detects auth change
→ Call POST /api/cart/merge with guest items
→ Backend merges (sum quantities if duplicate)
→ Clear localStorage guest_cart
→ Sync Zustand state with backend
→ Toast: "Cart synced successfully"
```

---

## TypeScript Types & Interfaces

### Product Types

**File: `src/features/products/types.ts`**

```typescript
// Product (list view)
export interface Product {
  id: string
  slug: string
  name: string
  base_price: number
  description: string
  image_urls: string[]
  status: 'published' | 'draft' | 'archived'
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  category: {
    id: string
    name: string
  }
  brand: {
    id: string
    name: string
  }
  variants_count: number
  min_price: number
  max_price: number
  has_stock: boolean
  created_at: string
  updated_at: string
}

// Product Variant (JSONB attributes)
export interface ProductVariant {
  id: string
  sku: string
  attributes: Record<string, string>  // Flexible: {size: "M", color: "Red"}
  stock_quantity: number
  price_adjustment: number
  final_price: number
  is_active: boolean
  is_in_stock: boolean
}

// Product Detail (with variants)
export interface ProductDetail extends Product {
  variants: ProductVariant[]
}

// Filter params (match backend query params)
export interface ProductFilterParams {
  search?: string
  category_id?: string
  brand_id?: string
  min_price?: number
  max_price?: number
  status?: string
  size?: string
  color?: string
  sort_by?: 'name' | 'price' | 'created_at'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// API Response
export interface ProductListResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}
```

### Cart Types

**File: `src/features/cart/types.ts`**

```typescript
export interface CartItem {
  id: string
  quantity: number
  price_snapshot: number
  subtotal: number
  product_variant: {
    id: string
    sku: string
    attributes: Record<string, string>
    stock_quantity: number
    final_price: number
    is_active: boolean
    is_in_stock: boolean
  }
  product: {
    id: string
    name: string
    slug: string
    image_urls: string[]
  }
}

export interface Cart {
  id: string
  user_id: string
  items: CartItem[]
  subtotal: number
  item_count: number
  created_at: string
  updated_at: string
}

// Guest cart (localStorage format)
export interface GuestCartItem {
  product_variant_id: string
  quantity: number
}

// Cart merge request
export interface CartMergeRequest {
  items: GuestCartItem[]
}

// Stock validation error
export interface StockValidationError {
  itemId: string
  productName: string
  variantSku: string
  requestedQty: number
  availableQty: number
}
```

---

## API Integration

### Product Endpoints

**File: `src/features/products/api/endpoints.ts`**

```typescript
export const productEndpoints = {
  list: '/api/products',
  detail: (id: string) => `/api/products/${id}`,
  variants: (productId: string) => `/api/products/${productId}/variants`,
} as const
```

**File: `src/features/products/api/queries.ts`**

```typescript
import { apiClient } from '@/services/api/client'
import type { ProductListResponse, ProductDetail, ProductFilterParams } from '../types'

export async function fetchProducts(
  filters: ProductFilterParams
): Promise<ProductListResponse> {
  const params = new URLSearchParams()

  // Add filters to query params
  if (filters.search) params.append('search', filters.search)
  if (filters.category_id) params.append('category_id', filters.category_id)
  if (filters.brand_id) params.append('brand_id', filters.brand_id)
  if (filters.min_price) params.append('min_price', String(filters.min_price))
  if (filters.max_price) params.append('max_price', String(filters.max_price))
  if (filters.size) params.append('size', filters.size)
  if (filters.color) params.append('color', filters.color)
  if (filters.sort_by) params.append('sort_by', filters.sort_by)
  if (filters.sort_order) params.append('sort_order', filters.sort_order)

  // Pagination
  params.append('page', String(filters.page || 1))
  params.append('limit', String(filters.limit || 20))

  // Only show published products
  params.append('status', 'published')

  const response = await apiClient.get(`/api/products?${params}`)
  return response.data
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const response = await apiClient.get(`/api/products/${id}`)
  return response.data
}
```

**File: `src/features/products/hooks/use-products.ts`**

```typescript
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchProducts } from '../api/queries'
import type { ProductFilterParams } from '../types'

export function useProducts(filters: ProductFilterParams) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth transition when filters change
  })
}
```

### Cart Endpoints

**File: `src/features/cart/api/endpoints.ts`**

```typescript
export const cartEndpoints = {
  get: '/api/cart',
  addItem: '/api/cart/items',
  updateItem: (itemId: string) => `/api/cart/items/${itemId}`,
  removeItem: (itemId: string) => `/api/cart/items/${itemId}`,
  clear: '/api/cart',
  merge: '/api/cart/merge',
} as const
```

**File: `src/features/cart/api/queries.ts`**

```typescript
import { apiClient } from '@/services/api/client'
import type { Cart, CartMergeRequest } from '../types'

export async function fetchCart(): Promise<Cart> {
  const response = await apiClient.get('/api/cart')
  return response.data
}

export async function addCartItem(variantId: string, quantity: number) {
  const response = await apiClient.post('/api/cart/items', {
    product_variant_id: variantId,
    quantity,
  })
  return response.data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const response = await apiClient.put(`/api/cart/items/${itemId}`, {
    quantity,
  })
  return response.data
}

export async function removeCartItem(itemId: string) {
  await apiClient.delete(`/api/cart/items/${itemId}`)
}

export async function clearCart() {
  await apiClient.delete('/api/cart')
}

export async function mergeCart(items: CartMergeRequest) {
  const response = await apiClient.post('/api/cart/merge', items)
  return response.data
}
```

---

## Component Design

### 1. Dynamic Variant Selector

**File: `src/features/products/components/variant-selector.tsx`**

**Purpose:** Render flexible UI based on JSONB variant attributes from backend.

**Design Strategy:**
1. Extract unique attribute keys from variants
2. For each attribute, get unique values
3. Render UI based on attribute type:
   - `size` → Button grid (XS, S, M, L, XL)
   - `color` → Color swatches with name
   - Others → Select dropdown
4. Progressive filtering (disable invalid combinations)
5. Show stock status per variant

**Component Interface:**

```typescript
interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onVariantChange: (variant: ProductVariant) => void
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  // 1. Extract attribute keys
  const attributeKeys = getUniqueAttributeKeys(variants)
  // Example: ["size", "color"]

  // 2. Track selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

  // 3. Filter available options based on current selection
  const availableOptions = getAvailableOptions(variants, selectedAttributes)

  // 4. Find exact variant match
  useEffect(() => {
    const variant = findVariantByAttributes(variants, selectedAttributes)
    onVariantChange(variant)
  }, [selectedAttributes])

  // 5. Render UI for each attribute
  return (
    <div className="space-y-6">
      {attributeKeys.map((key) => (
        <AttributeSelector
          key={key}
          attributeKey={key}
          options={availableOptions[key]}
          selectedValue={selectedAttributes[key]}
          onSelect={(value) => {
            setSelectedAttributes({ ...selectedAttributes, [key]: value })
          }}
        />
      ))}
    </div>
  )
}
```

**Helper Functions:**

```typescript
// Extract unique attribute keys from all variants
function getUniqueAttributeKeys(variants: ProductVariant[]): string[] {
  const keys = new Set<string>()
  variants.forEach(v => {
    Object.keys(v.attributes).forEach(key => keys.add(key))
  })
  return Array.from(keys)
}

// Get available options for each attribute based on current selection
function getAvailableOptions(
  variants: ProductVariant[],
  selectedAttributes: Record<string, string>
): Record<string, VariantOption[]> {
  // Filter variants that match current selection
  const matchingVariants = variants.filter(v => {
    return Object.entries(selectedAttributes).every(([key, value]) => {
      return !value || v.attributes[key] === value
    })
  })

  // Extract unique values for each attribute from matching variants
  const options: Record<string, VariantOption[]> = {}

  const keys = getUniqueAttributeKeys(matchingVariants)
  keys.forEach(key => {
    const values = new Set<string>()
    matchingVariants.forEach(v => {
      if (v.attributes[key]) values.add(v.attributes[key])
    })

    options[key] = Array.from(values).map(value => ({
      value,
      isAvailable: matchingVariants.some(v =>
        v.attributes[key] === value && v.is_in_stock
      ),
    }))
  })

  return options
}

// Find exact variant by selected attributes
function findVariantByAttributes(
  variants: ProductVariant[],
  attributes: Record<string, string>
): ProductVariant | null {
  return variants.find(v => {
    return Object.entries(attributes).every(([key, value]) => {
      return v.attributes[key] === value
    })
  }) || null
}
```

**AttributeSelector Sub-component:**

```typescript
interface AttributeSelectorProps {
  attributeKey: string
  options: VariantOption[]
  selectedValue?: string
  onSelect: (value: string) => void
}

function AttributeSelector({
  attributeKey,
  options,
  selectedValue,
  onSelect,
}: AttributeSelectorProps) {
  // Render different UI based on attribute type
  if (attributeKey === 'size') {
    return <SizeSelector options={options} selected={selectedValue} onSelect={onSelect} />
  }

  if (attributeKey === 'color') {
    return <ColorSelector options={options} selected={selectedValue} onSelect={onSelect} />
  }

  // Generic dropdown for other attributes
  return <GenericSelector label={attributeKey} options={options} selected={selectedValue} onSelect={onSelect} />
}
```

**UI Components:**

```typescript
// Size selector - button grid
function SizeSelector({ options, selected, onSelect }) {
  return (
    <div>
      <label className="text-sm font-medium tracking-wide">SELECT SIZE</label>
      <div className="grid grid-cols-5 gap-2 mt-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            disabled={!option.isAvailable}
            className={`py-4 border transition-all ${
              selected === option.value
                ? 'bg-white text-black border-white'
                : option.isAvailable
                ? 'border-white/20 hover:border-white/60'
                : 'border-white/10 opacity-30 cursor-not-allowed'
            }`}
          >
            {option.value}
          </button>
        ))}
      </div>
    </div>
  )
}

// Color selector - color swatches
function ColorSelector({ options, selected, onSelect }) {
  return (
    <div>
      <label className="text-sm font-medium tracking-wide">SELECT COLOR</label>
      <div className="flex flex-wrap gap-3 mt-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            disabled={!option.isAvailable}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-12 h-12 rounded-full border-2 transition-all ${
                selected === option.value
                  ? 'border-white scale-110'
                  : option.isAvailable
                  ? 'border-white/20 hover:border-white/60'
                  : 'border-white/10 opacity-30'
              }`}
              style={{ backgroundColor: getColorCode(option.value) }}
            />
            <span className="text-xs">{option.value}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

### 2. Stock Indicator Component

**File: `src/features/products/components/stock-indicator.tsx`**

```typescript
interface StockIndicatorProps {
  stockQuantity?: number
  isInStock?: boolean
  lowStockThreshold?: number
}

export function StockIndicator({
  stockQuantity,
  isInStock,
  lowStockThreshold = 10
}: StockIndicatorProps) {
  if (!isInStock || stockQuantity === 0) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm font-medium">OUT OF STOCK</span>
      </div>
    )
  }

  if (stockQuantity && stockQuantity <= lowStockThreshold) {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <span className="text-sm font-medium">LOW STOCK ({stockQuantity} left)</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-green-500">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm font-medium">IN STOCK</span>
    </div>
  )
}
```

---

### 3. Cart Store (Zustand)

**File: `src/features/cart/store/cart-store.ts`**

```typescript
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { toast } from 'sonner'
import * as cartApi from '../api/queries'
import type { CartItem, GuestCartItem } from '../types'

interface CartState {
  // State
  items: CartItem[]
  isGuest: boolean
  isSyncing: boolean

  // Actions - Guest
  addGuestItem: (variantId: string, quantity: number) => void
  updateGuestQuantity: (variantId: string, quantity: number) => void
  removeGuestItem: (variantId: string) => void
  clearGuestCart: () => void

  // Actions - Authenticated
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>

  // Sync actions
  syncWithBackend: () => Promise<void>
  mergeGuestCart: (guestItems: GuestCartItem[]) => Promise<void>

  // Computed
  itemCount: number
  subtotal: number
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isGuest: true,
        isSyncing: false,
        itemCount: 0,
        subtotal: 0,

        // Guest cart - localStorage only
        addGuestItem: (variantId, quantity) => {
          const guestCart = getGuestCart()
          const existingItem = guestCart.find(i => i.product_variant_id === variantId)

          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            guestCart.push({ product_variant_id: variantId, quantity })
          }

          saveGuestCart(guestCart)
          toast.success('Added to cart')
        },

        updateGuestQuantity: (variantId, quantity) => {
          const guestCart = getGuestCart()
          const item = guestCart.find(i => i.product_variant_id === variantId)

          if (item) {
            if (quantity === 0) {
              const filtered = guestCart.filter(i => i.product_variant_id !== variantId)
              saveGuestCart(filtered)
            } else {
              item.quantity = quantity
              saveGuestCart(guestCart)
            }
          }
        },

        removeGuestItem: (variantId) => {
          const guestCart = getGuestCart()
          const filtered = guestCart.filter(i => i.product_variant_id !== variantId)
          saveGuestCart(filtered)
          toast.success('Item removed')
        },

        clearGuestCart: () => {
          localStorage.removeItem('guest_cart')
        },

        // Authenticated cart - API calls
        addItem: async (variantId, quantity) => {
          try {
            const updatedCart = await cartApi.addCartItem(variantId, quantity)
            set({ items: updatedCart.items, itemCount: updatedCart.item_count, subtotal: updatedCart.subtotal })
            toast.success('Added to cart')
          } catch (error) {
            toast.error('Failed to add to cart')
            throw error
          }
        },

        updateQuantity: async (itemId, quantity) => {
          try {
            const updatedCart = await cartApi.updateCartItem(itemId, quantity)
            set({ items: updatedCart.items, itemCount: updatedCart.item_count, subtotal: updatedCart.subtotal })
          } catch (error) {
            toast.error('Failed to update quantity')
            throw error
          }
        },

        removeItem: async (itemId) => {
          try {
            await cartApi.removeCartItem(itemId)
            await get().syncWithBackend()
            toast.success('Item removed')
          } catch (error) {
            toast.error('Failed to remove item')
            throw error
          }
        },

        clearCart: async () => {
          try {
            await cartApi.clearCart()
            set({ items: [], itemCount: 0, subtotal: 0 })
          } catch (error) {
            toast.error('Failed to clear cart')
            throw error
          }
        },

        // Sync with backend
        syncWithBackend: async () => {
          try {
            set({ isSyncing: true })
            const cart = await cartApi.fetchCart()
            set({
              items: cart.items,
              itemCount: cart.item_count,
              subtotal: cart.subtotal,
              isGuest: false,
            })
          } catch (error) {
            console.error('Failed to sync cart:', error)
          } finally {
            set({ isSyncing: false })
          }
        },

        // Merge guest cart on login
        mergeGuestCart: async (guestItems) => {
          try {
            set({ isSyncing: true })
            const mergedCart = await cartApi.mergeCart({ items: guestItems })
            set({
              items: mergedCart.items,
              itemCount: mergedCart.item_count,
              subtotal: mergedCart.subtotal,
              isGuest: false,
            })
            toast.success('Cart synced successfully')
          } catch (error) {
            toast.error('Failed to sync cart')
            throw error
          } finally {
            set({ isSyncing: false })
          }
        },
      }),
      {
        name: 'cart-storage',
        // Don't persist for authenticated users (fetch from backend)
        partialize: (state) => state.isGuest ? state : { items: [], isGuest: false },
      }
    )
  )
)

// Helper functions
function getGuestCart(): GuestCartItem[] {
  const cart = localStorage.getItem('guest_cart')
  return cart ? JSON.parse(cart) : []
}

function saveGuestCart(cart: GuestCartItem[]) {
  localStorage.setItem('guest_cart', JSON.stringify(cart))
}
```

---

### 4. Cart Sync Hook

**File: `src/features/cart/hooks/use-cart-sync.ts`**

```typescript
import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth'
import { useCartStore } from '../store/cart-store'

export function useCartSync() {
  const { isAuthenticated } = useAuthStore()
  const { mergeGuestCart, syncWithBackend, clearGuestCart } = useCartStore()

  useEffect(() => {
    if (isAuthenticated) {
      // Check if guest cart exists
      const guestCartData = localStorage.getItem('guest_cart')

      if (guestCartData) {
        const guestItems = JSON.parse(guestCartData)

        if (guestItems.length > 0) {
          // Merge guest cart with backend
          mergeGuestCart(guestItems).then(() => {
            // Clear localStorage after successful merge
            clearGuestCart()
          })
        } else {
          // Just sync with backend
          syncWithBackend()
        }
      } else {
        // No guest cart, just sync
        syncWithBackend()
      }
    }
  }, [isAuthenticated])
}
```

**Usage in App Root:**

```typescript
// src/routes/__root.tsx
import { useCartSync } from '@/features/cart'

export function Root() {
  useCartSync() // Auto-sync cart on auth change

  return <Outlet />
}
```

---

### 5. Checkout Validation Hook

**File: `src/features/cart/hooks/use-checkout-validation.ts`**

```typescript
import { useState } from 'react'
import { useCartStore } from '../store/cart-store'
import { fetchProductDetail } from '@/features/products/api/queries'
import type { StockValidationError } from '../types'

export function useCheckoutValidation() {
  const { items } = useCartStore()
  const [isValidating, setIsValidating] = useState(false)
  const [errors, setErrors] = useState<StockValidationError[]>([])

  const validateStock = async (): Promise<boolean> => {
    setIsValidating(true)
    const stockErrors: StockValidationError[] = []

    try {
      // Re-fetch latest product data to check current stock
      for (const item of items) {
        const product = await fetchProductDetail(item.product.id)
        const variant = product.variants.find(v => v.id === item.product_variant.id)

        if (!variant) {
          stockErrors.push({
            itemId: item.id,
            productName: item.product.name,
            variantSku: item.product_variant.sku,
            requestedQty: item.quantity,
            availableQty: 0,
          })
          continue
        }

        if (!variant.is_in_stock || variant.stock_quantity < item.quantity) {
          stockErrors.push({
            itemId: item.id,
            productName: item.product.name,
            variantSku: variant.sku,
            requestedQty: item.quantity,
            availableQty: variant.stock_quantity,
          })
        }
      }

      setErrors(stockErrors)
      return stockErrors.length === 0
    } finally {
      setIsValidating(false)
    }
  }

  return {
    validateStock,
    isValidating,
    errors,
    hasErrors: errors.length > 0,
  }
}
```

---

## Page Integrations

### 1. Categories Page (Product Catalog)

**File: `src/routes/categories.tsx`**

**Changes:**
- Replace mock `products` array with `useProducts()` hook
- Pass filter state to API
- Add loading skeletons
- Add pagination component
- Adjust FilterDrawer for dynamic variant attributes

```typescript
import { useProducts } from '@/features/products'

function CategoriesPage() {
  const [filters, setFilters] = useState<ProductFilterParams>({
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const { data, isLoading, isError } = useProducts(filters)

  // Handle search with debounce
  const debouncedSearch = useDebounce(filters.search, 300)

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }))
  }, [debouncedSearch])

  if (isLoading) {
    return <ProductSkeleton count={12} />
  }

  if (isError) {
    return <ErrorState />
  }

  return (
    <div>
      {/* Existing header, filters, etc. */}

      <ProductGrid products={data.data} />

      <Pagination
        currentPage={data.pagination.page}
        totalPages={data.pagination.total_pages}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />
    </div>
  )
}
```

---

### 2. Product Detail Page

**File: `src/routes/product.$id.tsx`**

**Changes:**
- Replace mock product with `useProductDetail()` hook
- Add VariantSelector component
- Dynamic price display based on selected variant
- Add StockIndicator component
- Update "Add to Cart" to use variant ID

```typescript
import { useProductDetail } from '@/features/products'
import { VariantSelector, StockIndicator } from '@/features/products/components'
import { useCartStore } from '@/features/cart'

function ProductDetailPage() {
  const { id } = Route.useParams()
  const { data: product, isLoading } = useProductDetail(id)
  const { addItem, addGuestItem, isGuest } = useCartStore()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select product options')
      return
    }

    if (!selectedVariant.is_in_stock) {
      toast.error('This variant is out of stock')
      return
    }

    try {
      if (isGuest) {
        addGuestItem(selectedVariant.id, quantity)
      } else {
        await addItem(selectedVariant.id, quantity)
      }
    } catch (error) {
      // Error handled in store
    }
  }

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) return <NotFound />

  return (
    <div>
      {/* Existing image gallery */}

      <div className="space-y-8">
        {/* Product info */}

        {/* Price - dynamic based on variant */}
        {selectedVariant ? (
          <p className="text-3xl font-bold">${selectedVariant.final_price}</p>
        ) : (
          <p className="text-3xl font-bold">
            ${product.min_price} - ${product.max_price}
          </p>
        )}

        {/* Variant Selector */}
        <VariantSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />

        {/* Stock Indicator */}
        {selectedVariant && (
          <StockIndicator
            stockQuantity={selectedVariant.stock_quantity}
            isInStock={selectedVariant.is_in_stock}
          />
        )}

        {/* Quantity selector */}

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !selectedVariant.is_in_stock}
        >
          ADD TO CART
        </Button>
      </div>
    </div>
  )
}
```

---

### 3. Cart Page

**File: `src/routes/cart.tsx`**

**Changes:**
- Use cart from `useCartStore()`
- Add checkout validation before proceeding
- Display stock errors
- Auto-adjust quantity options

```typescript
import { useCartStore } from '@/features/cart'
import { useCheckoutValidation } from '@/features/cart/hooks/use-checkout-validation'

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore()
  const { validateStock, isValidating, errors } = useCheckoutValidation()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    const isValid = await validateStock()

    if (isValid) {
      navigate('/checkout')
    } else {
      toast.error(`${errors.length} item(s) have stock issues. Please review your cart.`)
    }
  }

  if (items.length === 0) {
    return <CartEmpty />
  }

  return (
    <div>
      <div className="space-y-4">
        {items.map((item) => {
          const error = errors.find(e => e.itemId === item.id)

          return (
            <CartItem
              key={item.id}
              item={item}
              error={error}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
              onRemove={() => removeItem(item.id)}
            />
          )
        })}
      </div>

      <CartSummary subtotal={subtotal} />

      <Button
        onClick={handleCheckout}
        disabled={isValidating || errors.length > 0}
      >
        {isValidating ? 'Validating...' : 'PROCEED TO CHECKOUT'}
      </Button>
    </div>
  )
}
```

---

## UI/UX Components

### Pagination Component

**File: `src/components/common/pagination.tsx`**

```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← PREVIOUS
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first, last, current, and neighbors
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 border transition-all ${
                  page === currentPage
                    ? 'bg-white text-black border-white'
                    : 'border-white/20 hover:border-white/60'
                }`}
              >
                {page}
              </button>
            )
          }

          // Show ellipsis
          if (page === currentPage - 2 || page === currentPage + 2) {
            return <span key={page}>...</span>
          }

          return null
        })}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        NEXT →
      </Button>
    </div>
  )
}
```

---

### Product Skeleton

**File: `src/features/products/components/product-skeleton.tsx`**

```typescript
export function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-800 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="h-3 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

### Empty States

**File: `src/features/cart/components/cart-empty.tsx`**

```typescript
export function CartEmpty() {
  return (
    <div className="text-center py-24">
      <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-600" />
      <h2 className="text-2xl font-bold mb-4">YOUR CART IS EMPTY</h2>
      <p className="text-gray-400 mb-8">Add some products to get started</p>
      <Button asChild>
        <Link to="/categories">CONTINUE SHOPPING</Link>
      </Button>
    </div>
  )
}
```

---

## Implementation Checklist

### Day 1-2: Setup & Types
- [ ] Create feature folders structure (products/, cart/)
- [ ] Define TypeScript types (Product, Variant, Cart, Filters)
- [ ] Setup API client endpoints
- [ ] Create base API query functions
- [ ] Write type tests

### Day 3-4: Product Catalog Integration
- [ ] Implement `useProducts` hook with TanStack Query
- [ ] Integrate real API to categories page
- [ ] Implement search with debounce (300ms)
- [ ] Update FilterDrawer for JSONB variant attributes
- [ ] Add Pagination component
- [ ] Add ProductSkeleton loading states
- [ ] Test filter combinations (category + brand + price + size)
- [ ] Test pagination navigation
- [ ] Test search functionality

### Day 5-6: Product Detail & Variant Selector
- [ ] Build VariantSelector component (dynamic UI)
- [ ] Build StockIndicator component
- [ ] Implement variant attribute detection logic
- [ ] Implement progressive filtering (size → color)
- [ ] Refactor product detail page with `useProductDetail` hook
- [ ] Dynamic price display based on selected variant
- [ ] Image gallery enhancements (thumbnails, keyboard nav)
- [ ] Test all variant attribute types (size, color, custom)
- [ ] Test stock indicator states (in stock, low stock, out of stock)
- [ ] Test variant selection flow

### Day 7-8: Cart System
- [ ] Refactor cart-store (Zustand + localStorage persistence)
- [ ] Implement guest cart logic (localStorage operations)
- [ ] Implement authenticated cart API calls
- [ ] Build `useCartSync` hook
- [ ] Implement cart merge on login (`POST /api/cart/merge`)
- [ ] Update cart page UI with real data from store
- [ ] Add optimistic UI updates
- [ ] Add toast notifications (success, error)
- [ ] Test guest cart → add items → persist in localStorage
- [ ] Test login → auto-merge → backend sync
- [ ] Test authenticated cart operations (add, update, remove)

### Day 9: Stock Validation & Checkout Flow
- [ ] Build `useCheckoutValidation` hook
- [ ] Implement stock validation logic (re-fetch variants)
- [ ] Error detection (insufficient stock, variant inactive)
- [ ] Display stock errors on cart page
- [ ] Auto-adjust quantity UI (max available)
- [ ] Prevent checkout if errors exist
- [ ] Test stock validation with various scenarios
- [ ] Test error display and recovery flow

### Day 10: Polish & Testing
- [ ] Add all toast notifications
- [ ] Implement all empty states (cart, no products)
- [ ] Polish all loading states (skeletons, spinners)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Accessibility audit (aria labels, keyboard nav)
- [ ] Performance testing (lighthouse score)
- [ ] Bug fixes and edge cases
- [ ] Final integration testing

---

## Testing Strategy

### Unit Tests (Vitest)

**Cart Store:**
```typescript
// src/features/cart/store/cart-store.test.ts
describe('CartStore', () => {
  it('adds item to guest cart in localStorage', () => {})
  it('updates quantity in guest cart', () => {})
  it('removes item from guest cart', () => {})
  it('calculates subtotal correctly', () => {})
  it('clears guest cart', () => {})

  it('adds item via API for authenticated users', async () => {})
  it('merges guest cart with backend cart', async () => {})
  it('syncs with backend on auth change', async () => {})
})
```

**Variant Selector:**
```typescript
// src/features/products/components/variant-selector.test.tsx
describe('VariantSelector', () => {
  it('extracts unique attribute keys from variants', () => {})
  it('renders size buttons for size attributes', () => {})
  it('renders color swatches for color attributes', () => {})
  it('renders generic select for custom attributes', () => {})
  it('disables out of stock variants', () => {})
  it('filters available options based on selection', () => {})
  it('finds exact variant match from attributes', () => {})
})
```

**Checkout Validation:**
```typescript
// src/features/cart/hooks/use-checkout-validation.test.ts
describe('useCheckoutValidation', () => {
  it('validates all cart items stock', async () => {})
  it('detects insufficient stock errors', async () => {})
  it('detects inactive variant errors', async () => {})
  it('returns validation errors with details', async () => {})
})
```

---

### Integration Tests

**Product Catalog Flow:**
```typescript
test('user can search and filter products', async () => {
  render(<CategoriesPage />)

  // Type in search
  const searchInput = screen.getByPlaceholderText('SEARCH...')
  await userEvent.type(searchInput, 'shirt')

  // Wait for debounced search
  await waitFor(() => {
    expect(screen.getByText(/search results/i)).toBeInTheDocument()
  })

  // Select category filter
  fireEvent.click(screen.getByText('FILTERS'))
  fireEvent.click(screen.getByText('Outerwear'))

  // Verify filtered results
  expect(mockFetchProducts).toHaveBeenCalledWith({
    search: 'shirt',
    category_id: 'outerwear-id',
  })
})
```

**Cart Merge Flow:**
```typescript
test('guest cart merges on login', async () => {
  // 1. Add items as guest
  const { result } = renderHook(() => useCartStore())

  act(() => {
    result.current.addGuestItem('variant-1', 2)
    result.current.addGuestItem('variant-2', 1)
  })

  // Verify localStorage
  const guestCart = JSON.parse(localStorage.getItem('guest_cart')!)
  expect(guestCart).toHaveLength(2)

  // 2. Login (trigger auth change)
  const { result: authResult } = renderHook(() => useAuthStore())
  act(() => {
    authResult.current.login({ email: 'user@test.com', password: 'pass' })
  })

  // 3. Wait for merge
  await waitFor(() => {
    expect(mockMergeCart).toHaveBeenCalledWith({
      items: [
        { product_variant_id: 'variant-1', quantity: 2 },
        { product_variant_id: 'variant-2', quantity: 1 },
      ]
    })
  })

  // 4. Verify localStorage cleared
  expect(localStorage.getItem('guest_cart')).toBeNull()

  // 5. Verify cart synced
  expect(result.current.items).toHaveLength(2)
  expect(result.current.isGuest).toBe(false)
})
```

**Checkout Validation Flow:**
```typescript
test('stock validation prevents checkout with errors', async () => {
  render(<CartPage />)

  // Mock cart with items
  mockUseCartStore.mockReturnValue({
    items: [
      { id: '1', quantity: 5, product_variant: { id: 'v1', stock_quantity: 3 } }
    ]
  })

  // Click checkout
  fireEvent.click(screen.getByText('PROCEED TO CHECKOUT'))

  // Wait for validation
  await waitFor(() => {
    expect(screen.getByText(/stock issues/i)).toBeInTheDocument()
  })

  // Verify error displayed on item
  expect(screen.getByText(/only 3 available/i)).toBeInTheDocument()

  // Adjust quantity
  fireEvent.click(screen.getByText('Update to 3'))

  // Click checkout again
  fireEvent.click(screen.getByText('PROCEED TO CHECKOUT'))

  // Should proceed
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/checkout')
  })
})
```

---

### Manual Testing Checklist

**Product Catalog:**
- [ ] Search products by name → correct results
- [ ] Search products by description → correct results
- [ ] Filter by category → correct products
- [ ] Filter by brand → correct products
- [ ] Filter by price range → correct products
- [ ] Filter by size → shows products with that size variant
- [ ] Filter by color → shows products with that color variant
- [ ] Combine multiple filters → correct intersection
- [ ] Sort by price low-high → correct order
- [ ] Sort by price high-low → correct order
- [ ] Sort by name → alphabetical order
- [ ] Pagination → navigate pages correctly
- [ ] Clear all filters → reset to all products

**Product Detail:**
- [ ] Product loads with all variants
- [ ] Variant selector shows all attribute types
- [ ] Select size → updates available colors
- [ ] Select color → finds exact variant
- [ ] Price updates based on selected variant
- [ ] Stock indicator shows correct status
- [ ] Out of stock variant → disabled + visual indicator
- [ ] Low stock variant → yellow warning
- [ ] In stock variant → green indicator
- [ ] Add to cart without variant → error toast
- [ ] Add to cart with out of stock variant → error toast
- [ ] Add to cart with valid variant → success

**Guest Cart:**
- [ ] Add item as guest → stored in localStorage
- [ ] Update quantity → localStorage updated
- [ ] Remove item → localStorage updated
- [ ] Cart persists after page refresh
- [ ] Cart count badge updates
- [ ] Subtotal calculates correctly

**Authenticated Cart:**
- [ ] Add item → API called → backend sync
- [ ] Update quantity → API called
- [ ] Remove item → API called
- [ ] Cart loads from backend on page load
- [ ] Cart syncs across devices (login on different browser)

**Cart Merge:**
- [ ] Add 2 items as guest
- [ ] Login
- [ ] Cart auto-merges (toast notification)
- [ ] localStorage cleared
- [ ] Backend cart shows merged items
- [ ] Duplicate variants → quantities summed

**Checkout Validation:**
- [ ] Cart with in-stock items → checkout succeeds
- [ ] Cart with out-of-stock item → validation error
- [ ] Cart with insufficient stock → error with available qty
- [ ] Adjust quantity to available → error clears
- [ ] Remove problematic item → error clears
- [ ] All errors resolved → can proceed to checkout

**Responsive:**
- [ ] Mobile: Filter drawer full screen
- [ ] Mobile: Product grid 1 column
- [ ] Mobile: Variant selector stacks vertically
- [ ] Tablet: Product grid 2 columns
- [ ] Desktop: Product grid 3 columns
- [ ] Desktop: Filter drawer sidebar

**Performance:**
- [ ] Product list loads < 1s
- [ ] Search response < 500ms (debounced)
- [ ] Add to cart < 200ms (optimistic)
- [ ] Cart sync < 1s
- [ ] Images lazy load
- [ ] No layout shift during loading

---

## Performance Optimizations

### Image Optimization
```typescript
// Use Next.js Image or native lazy loading
<img
  src={product.image_urls[0]}
  alt={product.name}
  loading="lazy"
  className="aspect-[3/4] object-cover"
/>

// Responsive images
<img
  srcSet={`
    ${product.image_urls[0]}?w=400 400w,
    ${product.image_urls[0]}?w=800 800w,
    ${product.image_urls[0]}?w=1200 1200w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Code Splitting
```typescript
// Lazy load heavy components
const FilterDrawer = lazy(() => import('./components/filter-drawer'))
const ProductDetail = lazy(() => import('./routes/product.$id'))

// Prefetch on hover
<Link
  to={`/product/${product.id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.id],
      queryFn: () => fetchProductDetail(product.id)
    })
  }}
>
```

### API Optimizations
```typescript
// Debounce search
const debouncedSearch = useDebounce(searchQuery, 300)

// Cache product list
staleTime: 5 * 60 * 1000 // 5 minutes

// Keep previous data during filter changes
placeholderData: keepPreviousData
```

---

## Success Criteria

**Phase 2 Frontend Complete When:**

✅ Product catalog fetches from real API (`GET /api/products`)
✅ Search & filters working with backend (category, brand, price, size, color)
✅ Pagination working correctly
✅ Dynamic variant selector handles any JSONB attributes
✅ Stock indicator shows accurate status
✅ Guest cart works in localStorage (add, update, remove)
✅ Cart auto-merges on login via `POST /api/cart/merge`
✅ Authenticated cart syncs with backend (all operations)
✅ Stock validation at checkout prevents overselling
✅ All loading states implemented (skeletons, spinners)
✅ All error states handled (toast notifications)
✅ All empty states implemented (cart, no products)
✅ Responsive on all devices (mobile, tablet, desktop)
✅ Unit tests passing (>80% coverage for critical paths)
✅ Manual testing checklist complete
✅ Performance benchmarks met (< 1s load, < 500ms search)

---

## Next Steps

**After Phase 2 Frontend Complete:**
1. Integration testing with Phase 2 Backend
2. End-to-end testing (Cypress/Playwright)
3. Move to Phase 3: Checkout & Payment (Week 5-6)
4. Consider additional enhancements:
   - Product quick view modal
   - Recently viewed products
   - Wishlist functionality
   - Product image zoom on mobile (pinch gesture)

---

**Document Status:** ✅ Complete
**Approved By:** [Pending]
**Implementation Start:** [TBD]
**Target Completion:** Week 3-4 (10 days)
