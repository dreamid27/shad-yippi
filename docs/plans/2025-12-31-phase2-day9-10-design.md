# Phase 2 Day 9-10 - Cart System & Checkout Flow

**Date:** 2025-12-31
**Project:** shad-yippi (Frontend)
**Phase:** 2 - Product Catalog & Cart (Week 3-4)
**Sprint:** Day 9-10 - Cart System Complete & Checkout Flow
**Status:** Design Complete, Ready for Implementation

---

## Executive Summary

This document details the technical design for Phase 2 Day 9-10 implementation, completing the cart system and building the checkout flow foundation. This sprint focuses on:

1. **Cart System Migration** - Remove deprecated cart, integrate new cart store everywhere
2. **Cart Page Enhancements** - Real-time stock validation, guest cart improvements
3. **Checkout Flow** - Two-page checkout (shipping + payment) with mock processing
4. **Order Management** - Success page, order confirmation

**Key Design Decisions:**
1. ✅ **Delete old cart system** - Complete migration to new useCartStore
2. ✅ **Validate stock at cart page** - Block checkout before issues occur
3. ✅ **Hybrid checkout (2 pages)** - Shipping + Payment separate but connected
4. ✅ **Mock payment processing** - Complete checkout UI, real API in Phase 3
5. ✅ **Simple cart merge** - Auto-merge on login with toast notification

---

## Current State Analysis

### What's Already Done ✅

**Phase 2 Day 1-4 (Product Catalog):**
- ✅ Product API integration (GET /api/products)
- ✅ Search with debounce (300ms)
- ✅ Filter system (category, brand, price, size, color)
- ✅ Pagination component
- ✅ ProductSkeleton loading states
- ✅ TanStack Query integration with keepPreviousData
- ✅ Categories page refactored with real API

**Phase 2 Day 5-8 (Product Detail & Cart Infrastructure):**
- ✅ VariantSelector component (dynamic UI for size/color/custom)
- ✅ StockIndicator component (in stock, low stock, out of stock)
- ✅ Product detail page refactored with useProductDetail hook
- ✅ Cart store created (guest + authenticated support)
- ✅ Cart sync hook created (useCartSync)
- ✅ Cart API queries (fetch, add, update, remove, merge)
- ✅ Feature-based structure (products/, cart/)
- ✅ TypeScript types defined

### What Needs to be Done 🎯

**Phase 2 Day 9-10:**
1. Cart system migration (delete old useCart, integrate new store)
2. Product detail page - connect to new cart store
3. Cart page - add stock validation, improve guest cart UI
4. Checkout store & pages (shipping, payment, success)
5. Stock validation hook (useCheckoutValidation)
6. Integration testing & bug fixes

---

## Architecture Overview

### Cart System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cart System Overview                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   Guest      │         │ Authenticated│              │
│  │   User       │         │    User     │              │
│  └──────┬───────┘         └──────┬───────┘              │
│         │                         │                          │
│         │ localStorage              │ API                     │
│         │                         │                          │
│         ▼                         ▼                          │
│  ┌──────────────────────────────────────────┐                 │
│  │        useCartStore (Zustand)         │                 │
│  │  • guestCart: GuestCartItem[]          │                 │
│  │  • cart: Cart | null                 │                 │
│  │  • addItem/addGuestItem              │                 │
│  │  • updateItem/updateGuestItem        │                 │
│  │  • removeItem/removeGuestItem        │                 │
│  │  • syncCart (merge on login)        │                 │
│  └──────────────────────────────────────────┘                 │
│                    │                                      │
│                    ▼                                      │
│  ┌──────────────────────────────────────────┐                 │
│  │   useCheckoutValidation Hook            │                 │
│  │  • validateStock()                   │                 │
│  │  • Re-fetch products for latest stock  │                 │
│  │  • Returns StockValidationError[]       │                 │
│  └──────────────────────────────────────────┘                 │
│                    │                                      │
│         ┌──────────┴──────────┐                           │
│         ▼                     ▼                           │
│  ┌──────────┐         ┌──────────┐                         │
│  │Cart Page │         │Product   │                         │
│  │          │         │Detail    │                         │
│  │Display   │         │Page      │                         │
│  │+ Validate│         │Add Items │                         │
│  └──────────┘         └──────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Checkout Flow Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Checkout Flow                     │
└──────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────────┐         ┌──────────────────┐
│  Cart Page      │         │ Checkout Flow    │
│  (Stock Val)   │────────▶│  (2 Pages)     │
└──────────────────┘         └────────┬─────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                  ┌──────────────┐         ┌──────────────┐
                  │/checkout/   │         │/checkout/    │
                  │shipping     │────────▶│payment      │
                  │             │         │              │
                  │Step 1 of 2  │         │Step 2 of 2  │
                  └──────────────┘         └──────────────┘
                         │                         │
                         ▼                         ▼
                  [Shipping Form]         [Payment Form]
                  [Address Select]        [Method Select]
                  [Review Items]         [Mock Process]
                         │                         │
                         └────────────┬────────────┘
                                      ▼
                              ┌──────────────┐
                              │Order Success │
                              │             │
                              │Thank You    │
                              └──────────────┘
```

---

## Implementation Tasks

### Day 9: Cart System Complete

#### Task 1: Delete Deprecated Cart System

**File:** `src/hooks/use-cart.ts`

**Action:** DELETE entire file

**Reasoning:**
- Old cart system uses simple localStorage (no variant support)
- Doesn't integrate with backend API
- Conflicts with new useCartStore (Zustand + API)
- Product detail page uses old system (line 27 in product.$id.tsx)
- Must be removed to avoid confusion

**Files affected:**
- Delete: `src/hooks/use-cart.ts`
- Update imports in all files using it

---

#### Task 2: Product Detail Cart Integration

**File:** `src/routes/product.$id.tsx`

**Changes:**

1. Replace import:
```typescript
// DELETE:
import { useCart, type Product } from "@/hooks/use-cart"

// ADD:
import { useCartStore } from "@/features/cart"
import { useAuthStore } from "@/features/auth"
import { useProductDetail, VariantSelector, StockIndicator } from "@/features/products"
import { toast } from "sonner"
```

2. Replace cart state:
```typescript
// DELETE:
const { addItem, itemCount } = useCart()

// ADD:
const { accessToken, isAuthenticated } = useAuthStore()
const { addItem, addGuestItem } = useCartStore()
```

3. Replace handleAddToCart (lines 48-82):
```typescript
const [isAddingToCart, setIsAddingToCart] = useState(false)

const handleAddToCart = async () => {
  // Validation
  if (!selectedVariant) {
    toast.error("Please select all product options")
    return
  }

  if (!selectedVariant.is_in_stock || selectedVariant.stock_quantity === 0) {
    toast.error("This variant is out of stock")
    return
  }

  if (quantity > selectedVariant.stock_quantity) {
    toast.error(`Only ${selectedVariant.stock_quantity} items available`)
    return
  }

  // Add to cart based on auth status
  setIsAddingToCart(true)
  try {
    if (isAuthenticated && accessToken) {
      await addItem(accessToken, selectedVariant.id, quantity)
    } else {
      addGuestItem(selectedVariant.id, quantity)
    }
    toast.success("Added to cart")
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to add to cart")
  } finally {
    setIsAddingToCart(false)
  }
}

const handleVariantChange = (variant: ProductVariant | null) => {
  setSelectedVariant(variant)
  if (variant) {
    setQuantity(1)
  }
}
```

4. Update quantity handler (lines 56-89):
```typescript
const handleQuantityChange = (newQuantity: number) => {
  const max = selectedVariant?.stock_quantity || 1
  const clamped = Math.min(Math.max(1, newQuantity), max)
  setQuantity(clamped)
}
```

5. Update "Add to Cart" button (lines 300-312):
```typescript
<Button
  size="lg"
  className="w-full"
  onClick={handleAddToCart}
  disabled={!selectedVariant || !selectedVariant.is_in_stock || isAddingToCart}
>
  {isAddingToCart ? (
    <span className="flex items-center gap-2">
      <RefreshCw className="w-4 h-4 animate-spin" />
      ADDING...
    </span>
  ) : (
    "ADD TO CART"
  )}
</Button>
```

6. Delete old cart product code (lines 66-78)

**Key improvements:**
- ✅ Uses new cart store (guest + authenticated)
- ✅ Single API call to add quantity (not loop)
- ✅ Loading state on button during API call
- ✅ Toast notifications for success/error
- ✅ Quantity validation against stock
- ✅ Disabled button state when out of stock
- ✅ Show "Only X left" warning for low stock

**Estimated lines changed:** ~60 lines

---

#### Task 3: Add Cart Sync to Root

**File:** `src/routes/__root.tsx`

**Changes:**

```typescript
// ADD import:
import { useCartSync } from "@/features/cart"

// ADD to RootComponent:
function RootComponent() {
  useCartSync() // Auto-sync cart on auth change

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}
```

**Purpose:**
- Detects when user logs in (guest → authenticated transition)
- Auto-merges guest cart to backend via POST /api/cart/merge
- Clears localStorage guest_cart after successful merge
- Shows toast notification: "Cart synced successfully"

**Estimated lines changed:** +2 lines

---

#### Task 4: Create Stock Validation Hook

**File:** `src/features/cart/hooks/use-checkout-validation.ts` (NEW)

**Full implementation:**

```typescript
import { useState, useEffect } from "react"
import { useCartStore } from "../store/cart-store"
import { fetchProductDetail } from "@/features/products/api/queries"
import type { StockValidationError } from "../types"

export function useCheckoutValidation() {
  const { cart, guestCart, isAuthenticated } = useCartStore()
  const [isValidating, setIsValidating] = useState(false)
  const [errors, setErrors] = useState<StockValidationError[]>([])

  const validateStock = async (): Promise<boolean> => {
    setIsValidating(true)
    const stockErrors: StockValidationError[] = []

    try {
      // Determine which cart to validate
      const cartItems = isAuthenticated && cart
        ? cart.items
        : guestCart.map((item) => ({
            // Convert guest cart to CartItem format
            id: item.product_variant_id,
            quantity: item.quantity,
            product_variant: {
              id: item.product_variant_id,
              stock_quantity: 0, // Will fetch from API
              is_in_stock: false,
            },
            product: {
              id: "", // Will fetch from API
              name: "", // Will fetch from API
            },
          }))

      // Re-fetch latest product data to check current stock
      const uniqueProductIds = [
        ...new Set(cartItems.map((item) => item.product.id)),
      ]

      const productPromises = uniqueProductIds.map((productId) =>
        fetchProductDetail(productId)
      )

      const products = await Promise.all(productPromises)

      // Validate each cart item
      for (const cartItem of cartItems) {
        const product = products.find((p) => p.id === cartItem.product.id)

        if (!product) {
          stockErrors.push({
            itemId: cartItem.id,
            productName: "Unknown Product",
            variantSku: "Unknown",
            requestedQty: cartItem.quantity,
            availableQty: 0,
            error: "Product not found",
          })
          continue
        }

        const variant = product.variants.find(
          (v) => v.id === cartItem.product_variant.id
        )

        if (!variant) {
          stockErrors.push({
            itemId: cartItem.id,
            productName: product.name,
            variantSku: cartItem.product_variant.sku || "Unknown",
            requestedQty: cartItem.quantity,
            availableQty: 0,
            error: "Variant no longer available",
          })
          continue
        }

        if (!variant.is_active) {
          stockErrors.push({
            itemId: cartItem.id,
            productName: product.name,
            variantSku: variant.sku,
            requestedQty: cartItem.quantity,
            availableQty: 0,
            error: "Variant has been discontinued",
          })
          continue
        }

        if (!variant.is_in_stock || variant.stock_quantity === 0) {
          stockErrors.push({
            itemId: cartItem.id,
            productName: product.name,
            variantSku: variant.sku,
            requestedQty: cartItem.quantity,
            availableQty: 0,
            error: "Out of stock",
          })
          continue
        }

        if (variant.stock_quantity < cartItem.quantity) {
          stockErrors.push({
            itemId: cartItem.id,
            productName: product.name,
            variantSku: variant.sku,
            requestedQty: cartItem.quantity,
            availableQty: variant.stock_quantity,
            error: "Insufficient stock",
          })
        }
      }

      setErrors(stockErrors)
      return stockErrors.length === 0
    } catch (error) {
      console.error("Stock validation failed:", error)
      // If validation fails (network error), block checkout for safety
      return false
    } finally {
      setIsValidating(false)
    }
  }

  // Auto-validate on cart changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cart?.items.length > 0 || guestCart.length > 0) {
        validateStock()
      }
    }, 1000) // Debounce 1 second

    return () => clearTimeout(timer)
  }, [cart, guestCart, isAuthenticated])

  // Clear errors when user fixes issues
  const clearErrors = () => setErrors([])

  return {
    validateStock,
    isValidating,
    errors,
    hasErrors: errors.length > 0,
    clearErrors,
  }
}
```

**Key features:**
- ✅ Validates stock against latest API data (not cached)
- ✅ Detects all error types: insufficient stock, out of stock, inactive, discontinued
- ✅ Auto-validates on cart changes (debounced 1s)
- ✅ Works for both guest and authenticated carts
- ✅ Provides actionable error messages
- ✅ Batch fetch all products in parallel (Promise.all)

**Estimated lines:** ~150 lines

---

#### Task 5: Update Cart Types

**File:** `src/features/cart/types.ts`

**Add to existing types:**

```typescript
// Add to existing interfaces
export interface StockValidationError {
  itemId: string
  productName: string
  variantSku: string
  requestedQty: number
  availableQty: number
  error: string // "Insufficient stock", "Out of stock", "Variant discontinued", etc.
}

// Helper function to format stock error message
export function formatStockError(error: StockValidationError): string {
  switch (error.error) {
    case "Insufficient stock":
      return `${error.productName}: Only ${error.availableQty} available (requested: ${error.requestedQty})`
    case "Out of stock":
      return `${error.productName}: Currently out of stock`
    case "Variant discontinued":
      return `${error.productName}: This variant is no longer available`
    case "Product not found":
      return `${error.productName}: Product has been removed`
    default:
      return `${error.productName}: ${error.error}`
  }
}
```

**Estimated lines:** +25 lines

---

#### Task 6: Update Cart Store with Toast Notifications

**File:** `src/features/cart/store/cart-store.ts`

**Changes:**

1. Add import:
```typescript
import { toast } from "sonner"
```

2. Update guest cart actions (lines 59-113):
```typescript
addGuestItem: (variantId: string, quantity: number) => {
  const { guestCart } = get()
  const existingIndex = guestCart.findIndex(
    (item) => item.product_variant_id === variantId,
  )

  if (existingIndex >= 0) {
    // Update quantity if already exists
    const updatedCart = [...guestCart]
    updatedCart[existingIndex] = {
      ...updatedCart[existingIndex],
      quantity: updatedCart[existingIndex].quantity + quantity,
    }
    set({ guestCart: updatedCart })
  } else {
    // Add new item
    set({
      guestCart: [...guestCart, { product_variant_id: variantId, quantity }],
    })
  }

  toast.success("Added to cart")
},

updateGuestItem: (variantId: string, quantity: number) => {
  const { guestCart } = get()
  if (quantity <= 0) {
    // Remove if quantity is 0
    set({
      guestCart: guestCart.filter(
        (item) => item.product_variant_id !== variantId,
      ),
    })
    toast.success("Item removed from cart")
  } else {
    // Update quantity
    set({
      guestCart: guestCart.map((item) =>
        item.product_variant_id === variantId
          ? { ...item, quantity }
          : item,
      ),
    })
  }
},

removeGuestItem: (variantId: string) => {
  set({
    guestCart: get().guestCart.filter(
      (item) => item.product_variant_id !== variantId,
    ),
  })
  toast.success("Item removed from cart")
},
```

3. Update authenticated cart actions (lines 130-184):
```typescript
addItem: async (
  accessToken: string,
  variantId: string,
  quantity: number,
) => {
  set({ isLoading: true, error: null })
  try {
    const cart = await addCartItem(accessToken, variantId, quantity)
    set({ cart, isLoading: false })
    toast.success("Added to cart")
  } catch (error) {
    set({
      error:
        error instanceof Error
          ? error.message
          : "Failed to add item to cart",
      isLoading: false,
    })
    toast.error(error instanceof Error ? error.message : "Failed to add to cart")
  }
},

updateItem: async (
  accessToken: string,
  itemId: string,
  quantity: number,
) => {
  set({ isLoading: true, error: null })
  try {
    const cart = await updateCartItem(accessToken, itemId, quantity)
    set({ cart, isLoading: false })
    toast.success("Quantity updated")
  } catch (error) {
    set({
      error:
        error instanceof Error
          ? error.message
          : "Failed to update cart item",
      isLoading: false,
    })
    toast.error(error instanceof Error ? error.message : "Failed to update quantity")
  }
},

removeItem: async (accessToken: string, itemId: string) => {
  set({ isLoading: true, error: null })
  try {
    const cart = await removeCartItem(accessToken, itemId)
    set({ cart, isLoading: false })
    toast.success("Item removed from cart")
  } catch (error) {
    set({
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove cart item",
      isLoading: false,
    })
    toast.error(error instanceof Error ? error.message : "Failed to remove item")
  }
},
```

4. Update syncCart action (lines 190-218):
```typescript
syncCart: async (accessToken: string) => {
  const { guestCart, clearGuestCart } = get()

  if (guestCart.length === 0) {
    // No guest cart items, just load server cart
    await get().loadCart(accessToken)
    return
  }

  set({ isLoading: true, error: null })
  try {
    // Merge guest cart to server
    const mergeRequest: CartMergeRequest = { items: guestCart }
    const cart = await mergeCart(accessToken, mergeRequest)
    set({ cart, isLoading: false })

    // Clear guest cart after successful merge
    clearGuestCart()
    toast.success("Cart synced successfully")
  } catch (error) {
    set({
      error:
        error instanceof Error
          ? error.message
          : "Failed to sync cart",
      isLoading: false,
    })
    toast.error(error instanceof Error ? error.message : "Failed to sync cart")
  }
},
```

**Key improvements:**
- ✅ Toast notification for every user action
- ✅ Clear error messages (success vs error toasts)
- ✅ Consistent user feedback across all cart operations

**Estimated lines changed:** +15 lines

---

#### Task 7: Update Cart Page UI

**File:** `src/routes/cart.tsx`

**Complete refactor (~350 lines):**

See full implementation in Section "Cart Page UI Improvements" below.

**Key changes:**
1. Import useCheckoutValidation hook
2. Add stock error display inline with cart items
3. Add validation on checkout button
4. Add clear cart confirmation modal
5. Add empty state with nice UI
6. Add loading skeleton
7. Add order summary sidebar (sticky)
8. Add toast notifications
9. Fix guest cart display (TODO for product fetching - Phase 3)

**Estimated lines changed:** ~350 lines (complete refactor)

---

### Day 10: Checkout Flow

#### Task 8: Create Checkout Store

**File:** `src/features/checkout/store/checkout-store.ts` (NEW)

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ShippingAddress {
  fullName: string
  phone: string
  province: string
  city: string
  address: string
  postalCode: string
  isDefault?: boolean
}

export interface ShippingMethod {
  id: string
  name: string
  cost: number
  estimatedDays: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  fee?: number
}

interface CheckoutState {
  // Shipping
  shippingAddress: ShippingAddress | null
  shippingMethod: ShippingMethod | null
  savedAddresses: ShippingAddress[]

  // Payment
  paymentMethod: PaymentMethod | null
  cardNumber: string
  cardExpiry: string
  cardCVV: string
  cardName: string

  // Validation
  shippingValid: boolean
  paymentValid: boolean
  isProcessing: boolean

  // Actions
  setShippingAddress: (address: ShippingAddress) => void
  setShippingMethod: (method: ShippingMethod) => void
  addSavedAddress: (address: ShippingAddress) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setCardDetails: (details: Partial<CheckoutState>) => void
  setShippingValid: (valid: boolean) => void
  setPaymentValid: (valid: boolean) => void
  setIsProcessing: (processing: boolean) => void
  resetCheckout: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  devtools((set) => ({
    // Initial state
    shippingAddress: null,
    shippingMethod: null,
    savedAddresses: [],
    paymentMethod: null,
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    shippingValid: false,
    paymentValid: false,
    isProcessing: false,

    // Actions
    setShippingAddress: (address) => set({ shippingAddress: address }),

    setShippingMethod: (method) => set({ shippingMethod: method }),

    addSavedAddress: (address) =>
      set((state) => ({
        savedAddresses: [...state.savedAddresses, address],
      })),

    setPaymentMethod: (method) => set({ paymentMethod: method }),

    setCardDetails: (details) => set({ ...details }),

    setShippingValid: (valid) => set({ shippingValid: valid }),

    setPaymentValid: (valid) => set({ paymentValid: valid }),

    setIsProcessing: (processing) => set({ isProcessing: processing }),

    resetCheckout: () =>
      set({
        shippingAddress: null,
        shippingMethod: null,
        paymentMethod: null,
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        cardName: '',
        shippingValid: false,
        paymentValid: false,
        isProcessing: false,
      }),
  }))
)
```

**Estimated lines:** ~100 lines

---

#### Task 9: Create Shipping Page

**File:** `src/routes/checkout.shipping.tsx` (NEW)

**Complete implementation (~450 lines):**

See full implementation in Section "Page 1: `/checkout/shipping` Design" below.

**Key features:**
- Progress indicator (Step 1 of 2)
- Shipping address form (name, phone, address, province, city, postal code)
- Saved addresses selector
- Shipping method selection (JNE, J&T, SiCepat)
- Order summary sidebar (sticky)
- Validation before "Continue to Payment"
- Responsive grid layout

**Estimated lines:** ~450 lines

---

#### Task 10: Create Payment Page

**File:** `src/routes/checkout.payment.tsx` (NEW)

**Complete implementation (~500 lines):**

See full implementation in Section "Page 2: `/checkout/payment` Design" below.

**Key features:**
- Progress indicator (Step 2 of 2)
- Shipping confirmation (read-only from checkout store)
- Payment method selection (Credit Card, Bank Transfer, GoPay, COD)
- Credit card form (number, expiry, CVV, name)
- Card validation (Luhn algorithm, format MM/YY, CVV length)
- Order confirmation modal before placing order
- Order summary sidebar (sticky)
- Mock order processing (2 seconds delay)
- Navigate to success page after order

**Estimated lines:** ~500 lines

---

#### Task 11: Create Success Page

**File:** `src/routes/checkout.success.tsx` (NEW)

```typescript
import { createFileRoute, Link } from "@tanstack/react-router"
import { CheckCircle2, Package, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/checkout/success")({
  component: OrderSuccessPage,
})

function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          ORDER PLACED SUCCESSFULLY!
        </h1>

        <p className="text-gray-400 mb-8">
          Thank you for your purchase. We've sent an order confirmation to your
          email with tracking information.
        </p>

        {/* Order Details Card */}
        <div className="border border-white/10 p-6 mb-8 text-left space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Order Number</p>
              <p className="font-medium">#ORD-2025-12345</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Estimated Delivery</p>
              <p className="font-medium">2-3 business days</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link to="/orders">View Order Status</Link>
          </Button>

          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link to="/categories">Continue Shopping</Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            asChild
          >
            <Link to="/">
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </span>
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-400">
          Need help? Contact our support team at{" "}
          <a
            href="mailto:support@yippi.com"
            className="underline hover:text-white"
          >
            support@yippi.com
          </a>
        </p>
      </div>
    </div>
  )
}
```

**Estimated lines:** ~80 lines

---

## File Structure After Implementation

```
src/
├── features/
│   ├── cart/
│   │   ├── components/
│   │   │   ├── cart-item.tsx              # ✅ Exists (update with validation)
│   │   │   ├── cart-summary.tsx            # ✅ Exists (update)
│   │   │   └── cart-empty.tsx             # ✅ Exists
│   │   ├── hooks/
│   │   │   ├── use-cart-sync.ts            # ✅ Exists (needs root integration)
│   │   └── use-checkout-validation.ts    # 🆕 NEW
│   │   ├── store/
│   │   │   └── cart-store.ts              # ✅ Exists (add toasts)
│   │   ├── api/
│   │   │   ├── endpoints.ts                # ✅ Exists
│   │   │   └── queries.ts                 # ✅ Exists
│   │   ├── types.ts                          # ✅ Exists (add StockValidationError)
│   │   └── index.ts                          # ✅ Exists
│   ├── checkout/
│   │   ├── store/
│   │   │   └── checkout-store.ts         # 🆕 NEW
│   │   └── index.ts                          # 🆕 NEW
│   └── products/
│       └── components/
│           ├── variant-selector.tsx          # ✅ Exists
│           └── stock-indicator.tsx           # ✅ Exists
├── hooks/
│   └── use-cart.ts                  # ❌ DELETE (deprecated)
├── routes/
│   ├── __root.tsx                   # ✅ Update (add useCartSync)
│   ├── cart.tsx                     # ✅ Update (complete refactor)
│   ├── product.$id.tsx              # ✅ Update (cart integration)
│   ├── checkout.shipping.tsx         # 🆕 NEW
│   ├── checkout.payment.tsx          # 🆕 NEW
│   └── checkout.success.tsx         # 🆕 NEW
└── components/
    └── common/
        └── pagination.tsx                # ✅ Exists
```

---

## Summary of Changes

| File | Action | Lines Changed |
|------|----------|---------------|
| `src/hooks/use-cart.ts` | DELETE | All |
| `src/routes/__root.tsx` | Add useCartSync hook | +2 |
| `src/routes/product.$id.tsx` | Replace cart integration | ~60 |
| `src/routes/cart.tsx` | Complete refactor with validation | ~350 |
| `src/features/cart/store/cart-store.ts` | Add toast notifications | +15 |
| `src/features/cart/types.ts` | Add StockValidationError | +25 |
| `src/features/cart/hooks/use-checkout-validation.ts` | CREATE NEW | ~150 |
| `src/features/checkout/store/checkout-store.ts` | CREATE NEW | ~100 |
| `src/features/checkout/index.ts` | CREATE NEW | ~10 |
| `src/routes/checkout.shipping.tsx` | CREATE NEW | ~450 |
| `src/routes/checkout.payment.tsx` | CREATE NEW | ~500 |
| `src/routes/checkout.success.tsx` | CREATE NEW | ~80 |

**Total new/modified code:** ~1,742 lines
**Files deleted:** 1
**Files created:** 4 new
**Files updated:** 4

---

## Testing Strategy

### Manual Testing Checklist

**Cart System:**
- [ ] Guest user adds item → stored in localStorage
- [ ] Guest user updates quantity → localStorage updated
- [ ] Guest user removes item → localStorage updated
- [ ] Cart persists after page refresh (guest)
- [ ] Cart count badge updates (guest)

**Cart Auth Sync:**
- [ ] Login with guest cart → auto-merge occurs
- [ ] Toast "Cart synced successfully" shown
- [ ] Guest cart cleared from localStorage
- [ ] Authenticated cart shows merged items
- [ ] Duplicate variants → quantities summed

**Stock Validation:**
- [ ] Cart with in-stock items → validation passes
- [ ] Cart with out-of-stock item → validation error shown
- [ ] Cart with insufficient stock → error with available qty
- [ ] Adjust quantity to available → error clears
- [ ] Remove problematic item → error clears
- [ ] All errors resolved → checkout button enabled

**Product Detail:**
- [ ] Add to cart without variant → error toast
- [ ] Add to cart with out-of-stock → error toast
- [ ] Add to cart with valid variant → success toast
- [ ] Button disabled during API call
- [ ] Loading spinner shown
- [ ] Quantity limited by stock
- [ ] "Only X left" warning for low stock

**Checkout Shipping:**
- [ ] Form validation → all fields required
- [ ] Shipping method selection required
- [ ] Order summary displays correct subtotal
- [ ] Progress indicator shows Step 1 of 2
- [ ] "Continue to Payment" disabled until valid

**Checkout Payment:**
- [ ] Payment method selection required
- [ ] Credit card fields validated
- [ ] Card number format (spaces every 4 digits)
- [ ] Expiry format (MM/YY)
- [ ] CVV validation (3 digits)
- [ ] Order confirmation modal shown before placing order
- [ ] Mock processing (2 seconds)
- [ ] Success page displayed after order
- [ ] Order number shown

**Cart Page UI:**
- [ ] Empty cart state displays
- [ ] Loading skeleton shown during API calls
- [ ] Stock errors displayed inline
- [ ] Clear cart confirmation modal works
- [ ] Order summary sticky on desktop
- [ ] Quantity controls respect stock limits
- [ ] Mobile responsive (1 column)

**Cross-Feature:**
- [ ] Product detail → cart → checkout flow works
- [ ] Guest → login → cart merge → checkout works
- [ ] Stock validation blocks checkout with errors
- [ ] Toast notifications appear consistently

---

## Success Criteria

**Phase 2 Day 9-10 Complete When:**

✅ Old cart system deleted (`use-cart.ts`)
✅ Product detail uses new cart store (guest + auth)
✅ Cart sync integrated in root (auto-merge on login)
✅ Stock validation hook created and working
✅ Cart page validates stock before checkout
✅ Cart page displays stock errors with actionable messages
✅ Toast notifications for all cart operations
✅ Checkout store created (shipping + payment state)
✅ Shipping page created with form validation
✅ Payment page created with mock processing
✅ Success page created with order confirmation
✅ Checkout flow works end-to-end (cart → shipping → payment → success)
✅ All manual testing checklist items passed
✅ Responsive on all devices (mobile, tablet, desktop)

---

## Next Steps

**After Phase 2 Complete:**

1. **Integration Testing:**
   - Test with real backend API (Phase 2 backend)
   - Verify cart merge logic with server
   - Test stock validation with actual product data

2. **Bug Fixes:**
   - Fix guest cart product details display (needs API enhancement)
   - Handle edge cases (network errors, token expiry)
   - Improve error messages based on user feedback

3. **Phase 3 Preparation:**
   - Backend: Checkout API, Payment API, Order API
   - Frontend: Real payment integration (Midtrans)
   - Frontend: Order management (history, tracking)

4. **Post-MVP Enhancements:**
   - Wishlist functionality
   - Product recommendations
   - Recently viewed products
   - Advanced search filters

---

**Document Status:** ✅ Complete
**Approved By:** [Pending]
**Implementation Start:** [TBD]
**Target Completion:** Day 9-10 (2 days)
