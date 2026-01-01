# Phase 2 Frontend Requirements - Remaining Tasks (Day 9-10)

**Date:** 2025-01-01
**Project:** shad-yippi (Frontend)
**Phase:** Phase 2 - Product Catalog & Cart (Week 3-4)
**Timeline:** 2 days (Day 9-10)
**Document Type:** Internal Development Guide

---

## Section 1: Document Overview & Scope

### Document Purpose
Internal development guide for completing Phase 2 frontend implementation, focusing on cart page refactor, stock validation, and comprehensive testing.

### Prerequisites (Already Completed)
- **Days 1-4:** Product catalog with API integration, search, filters, pagination
- **Days 5-8:** Product detail page, VariantSelector, StockIndicator, cart store infrastructure (guest + authenticated cart logic with useCartSync hook)

### Remaining Scope (This Document)
1. **Cart Page UI Refactor** - Update cart page to use new cart store (replace old implementation)
2. **Stock Validation & Checkout Preparation** - Validate stock before checkout, handle out-of-stock scenarios
3. **Integration & E2E Testing** - Comprehensive testing scenarios for complete Phase 2 flows
4. **Polish & Edge Cases** - Error handling, empty states, loading states

### Success Criteria
- ✅ Cart page fully integrated with new cart store (guest + authenticated logic)
- ✅ Stock validation prevents invalid checkout attempts
- ✅ All critical user flows tested and passing
- ✅ No breaking bugs in cart-to-checkout transition

---

## Section 2: Feature 1 - Cart Page UI Refactor

### Current State
Cart page (`src/routes/cart.tsx`) exists but uses old/mock cart logic. New cart store (`src/features/cart/store/cart-store.ts`) is implemented with guest cart (localStorage) and authenticated cart (API) logic.

### Objective
Refactor cart page to use the new cart store, supporting both guest and authenticated users with proper state synchronization.

### Key Requirements

#### 2.1 Cart Display
- Display cart items from `useCartStore()` (guest or authenticated based on auth state)
- Show product details: image, name, selected variant (size, color), price
- Display quantity controls (-, +, direct input) with stock limits
- Show item subtotal (price × quantity)
- Real-time cart total calculation (sum of all item subtotals)

#### 2.2 Cart Actions
- **Update quantity:** Call `updateItem()` or `updateGuestItem()` based on auth state
- **Remove item:** Call `removeItem()` or `removeGuestItem()` with confirmation
- **Clear cart:** Button to clear all items (with confirmation dialog)
- **Continue shopping:** Link back to categories/products page

#### 2.3 State Management Integration
- Use `useAuthStore()` to determine if user is authenticated
- If authenticated: use `useCartStore().items` (from API)
- If guest: use `useCartStore().guestItems` (from localStorage)
- Display guest cart item count badge in header (already handled by useCartSync)

#### 2.4 Empty State
- When cart is empty: show illustration + "Your cart is empty" message
- CTA button: "Start Shopping" → redirect to `/categories`

### Acceptance Criteria
- [ ] Cart displays correct items for guest vs authenticated users
- [ ] Quantity updates reflect immediately in UI and persist to storage/API
- [ ] Remove item shows confirmation and updates cart total
- [ ] Cart total matches sum of all item subtotals
- [ ] Empty state displays when cart has 0 items
- [ ] Guest cart persists across page refreshes (localStorage)
- [ ] Authenticated cart fetches from API on page load

---

## Section 3: Feature 2 - Stock Validation & Checkout Preparation

### Current State
- StockIndicator component shows stock status on product pages
- Cart store has items with quantities
- No validation before proceeding to checkout

### Objective
Implement stock validation logic to prevent users from checking out with out-of-stock or insufficient stock items.

### Key Requirements

#### 3.1 Pre-Checkout Stock Validation
- **Trigger point:** When user clicks "Proceed to Checkout" button on cart page
- **Validation logic:**
  - Check each cart item's quantity against current available stock (from API)
  - Identify items that are: out of stock, insufficient stock, or inactive/deleted
  - Display validation errors inline (on cart page) without navigating away

#### 3.2 Stock Validation API Call
- Create `useCheckoutValidation` hook (in `src/features/cart/hooks/`)
- API endpoint: `POST /api/cart/validate` (sends cart items, returns validation result)
- Response format:
  ```typescript
  {
    valid: boolean,
    errors: Array<{
      productId: string,
      variantId: string,
      productName: string,
      requestedQty: number,
      availableQty: number,
      error: 'out_of_stock' | 'insufficient_stock' | 'product_inactive'
    }>
  }
  ```

#### 3.3 Error Display & Resolution
- **Out of stock:** Show red badge on item + message "This item is out of stock" + "Remove" button
- **Insufficient stock:** Show yellow badge + message "Only X available" + auto-adjust quantity to max available + "Update" button
- **Product inactive:** Show gray badge + message "This product is no longer available" + "Remove" button
- Display validation error summary at top of cart (e.g., "2 items have stock issues. Please resolve before checkout.")

#### 3.4 Checkout Button Behavior
- **Before validation:** Button enabled, shows "Proceed to Checkout"
- **During validation:** Button disabled, shows loading spinner + "Validating stock..."
- **Validation passed:** Navigate to `/checkout`
- **Validation failed:** Stay on cart page, show errors, button re-enabled for retry

#### 3.5 Auto-fix Options
- Provide "Fix Issues" button that:
  - Removes out-of-stock items
  - Adjusts insufficient stock items to max available
  - Removes inactive products
- After auto-fix, re-run validation automatically

### Acceptance Criteria
- [ ] Clicking "Proceed to Checkout" triggers stock validation API call
- [ ] Out-of-stock items show error badge and cannot proceed to checkout
- [ ] Insufficient stock items display available quantity and offer auto-adjustment
- [ ] Inactive/deleted products show error and can be removed
- [ ] Validation errors display inline on affected cart items
- [ ] "Fix Issues" button resolves all fixable errors automatically
- [ ] Only valid carts can proceed to checkout page
- [ ] Validation re-runs if user manually updates quantities after initial validation

---

## Section 4: Testing Requirements

### 4.1 Feature-Based Testing Checklists

#### Feature: Cart Page UI

**Guest Cart (Unauthenticated User):**
- [ ] Empty cart shows empty state with "Start Shopping" CTA
- [ ] Adding product from product detail page appears in cart
- [ ] Cart items display: image, name, variant (size/color), price, quantity
- [ ] Quantity increment (+) button increases quantity
- [ ] Quantity decrement (-) button decreases quantity (min: 1)
- [ ] Direct quantity input accepts valid numbers
- [ ] Direct quantity input rejects invalid input (letters, negatives, zero)
- [ ] Quantity changes update item subtotal immediately
- [ ] Cart total updates when any item quantity changes
- [ ] Remove item button shows confirmation dialog
- [ ] Confirming remove deletes item from cart
- [ ] Canceling remove keeps item in cart
- [ ] Clear cart button shows confirmation dialog
- [ ] Confirming clear cart empties all items
- [ ] Guest cart persists after page refresh (localStorage)
- [ ] Guest cart persists across browser tabs

**Authenticated Cart (Logged-in User):**
- [ ] Cart fetches from API on page load
- [ ] Cart displays server-side items (not localStorage)
- [ ] Adding item calls API and updates server cart
- [ ] Quantity update calls API (`PUT /api/cart/items/:id`)
- [ ] Remove item calls API (`DELETE /api/cart/items/:id`)
- [ ] Clear cart calls API and empties server cart
- [ ] Cart updates sync across multiple browser tabs/devices
- [ ] API errors display user-friendly error messages
- [ ] Failed API calls don't break UI (graceful degradation)

**Guest → Authenticated Cart Merge:**
- [ ] Guest cart with 2 items + login → items merge to authenticated cart
- [ ] Duplicate items (same product+variant) combine quantities
- [ ] Guest cart clears from localStorage after successful merge
- [ ] Merge failure keeps guest cart intact and shows error

---

#### Feature: Stock Validation

**Valid Cart Scenarios:**
- [ ] Cart with all in-stock items passes validation
- [ ] "Proceed to Checkout" navigates to `/checkout` on success
- [ ] Validation shows loading state during API call
- [ ] No errors displayed for valid cart

**Out of Stock Scenarios:**
- [ ] Item with 0 stock shows "Out of stock" error badge
- [ ] Out-of-stock item prevents checkout
- [ ] Remove button appears on out-of-stock item
- [ ] Removing out-of-stock item allows retry validation
- [ ] Multiple out-of-stock items show individual errors

**Insufficient Stock Scenarios:**
- [ ] Item with quantity 5 but only 3 available shows "Only 3 available" warning
- [ ] Insufficient stock item prevents checkout
- [ ] "Update to 3" button appears to auto-adjust quantity
- [ ] Clicking update adjusts quantity and re-validates
- [ ] Auto-adjusted cart passes validation if no other issues

**Inactive Product Scenarios:**
- [ ] Deleted/inactive product shows "No longer available" error
- [ ] Inactive product prevents checkout
- [ ] Remove button appears on inactive product
- [ ] Removing inactive product allows retry validation

**Auto-Fix Functionality:**
- [ ] "Fix Issues" button appears when validation errors exist
- [ ] Auto-fix removes all out-of-stock items
- [ ] Auto-fix adjusts all insufficient stock items to max available
- [ ] Auto-fix removes all inactive products
- [ ] Auto-fix triggers automatic re-validation
- [ ] After auto-fix, cart proceeds to checkout if valid

**Edge Cases:**
- [ ] Validation with empty cart shows "Cart is empty" message
- [ ] Validation API timeout shows error + retry button
- [ ] Validation API 500 error shows user-friendly message
- [ ] Stock changes between page load and validation handled correctly
- [ ] Multiple rapid validation clicks don't cause duplicate API calls

---

### 4.2 End-to-End User Flows

#### Flow 1: Guest User - Browse to Cart

**Steps:**
1. User lands on homepage (not logged in)
2. Navigate to `/categories`
3. Select product → go to product detail page
4. Select variant (size: M, color: Black)
5. Set quantity to 2
6. Click "Add to Cart"
7. Navigate to `/cart`

**Expected Results:**
- [ ] Cart shows 1 item: selected product, variant M/Black, quantity 2
- [ ] Item subtotal = price × 2
- [ ] Cart total matches item subtotal
- [ ] Cart badge in header shows "1"
- [ ] Refresh page → cart persists (localStorage)

---

#### Flow 2: Guest Cart → Login → Merge

**Steps:**
1. As guest, add Product A (size M) × 2 to cart
2. Add Product B (color Red) × 1 to cart
3. Guest cart total = 2 items
4. Click "Login" in header
5. Login with valid credentials
6. After login redirect, navigate to `/cart`

**Expected Results:**
- [ ] Cart shows merged items: Product A × 2, Product B × 1
- [ ] Cart total = sum of merged items
- [ ] Guest cart cleared from localStorage
- [ ] Cart badge shows "2"
- [ ] Refresh page → cart fetches from API (not localStorage)

---

#### Flow 3: Authenticated User - Add to Cart with Stock Validation

**Steps:**
1. Login as authenticated user
2. Navigate to product with low stock (e.g., 3 available)
3. Select variant, set quantity to 5
4. Click "Add to Cart"
5. Navigate to `/cart`
6. Click "Proceed to Checkout"

**Expected Results:**
- [ ] Cart shows item with quantity 5
- [ ] Validation runs when clicking "Proceed to Checkout"
- [ ] Validation error: "Only 3 available"
- [ ] "Update to 3" button appears
- [ ] Click update → quantity changes to 3
- [ ] Automatic re-validation passes
- [ ] User proceeds to `/checkout`

---

#### Flow 4: Cart with Mixed Stock Issues

**Steps:**
1. Cart contains:
   - Product A (in stock) × 2
   - Product B (out of stock) × 1
   - Product C (only 2 available, user has 5) × 5
2. Click "Proceed to Checkout"

**Expected Results:**
- [ ] Validation fails, stays on cart page
- [ ] Product A: no error (valid)
- [ ] Product B: red badge "Out of stock" + Remove button
- [ ] Product C: yellow badge "Only 2 available" + Update button
- [ ] Error summary: "2 items have stock issues"
- [ ] "Fix Issues" button appears
- [ ] Click "Fix Issues":
  - Product B removed
  - Product C quantity adjusted to 2
  - Auto re-validation runs
- [ ] Validation passes → proceeds to checkout

---

#### Flow 5: Cart Persistence Across Devices (Authenticated)

**Steps:**
1. Device 1: Login, add Product A × 2 to cart
2. Device 2: Login with same account
3. Navigate to `/cart` on Device 2

**Expected Results:**
- [ ] Device 2 cart shows Product A × 2 (fetched from API)
- [ ] Cart total matches Device 1
- [ ] Update quantity on Device 2 → change persists to server
- [ ] Refresh Device 1 → shows updated quantity

---

## Section 5: UI/UX Guidelines & Layout Specifications

### 5.1 Cart Page Layout

**Desktop Layout (≥1024px):**
```
┌─────────────────────────────────────────────────────────┐
│  Header (existing)                                      │
├─────────────────────────────────────────────────────────┤
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Cart Items (70%)       │  │ Order Summary (30%)  │  │
│  │                        │  │                      │  │
│  │ [Item 1]               │  │ Subtotal: Rp XXX    │  │
│  │ [Item 2]               │  │ Total Items: X      │  │
│  │ [Item 3]               │  │                      │  │
│  │                        │  │ [Proceed to Checkout]│  │
│  │ [Clear Cart]           │  │ [Continue Shopping]  │  │
│  └────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Mobile Layout (<768px):**
```
┌───────────────────────┐
│ Header                │
├───────────────────────┤
│ Order Summary (sticky)│
│ Subtotal: Rp XXX     │
│ [Proceed to Checkout] │
├───────────────────────┤
│ Cart Items (scrollable│
│                       │
│ [Item 1]              │
│ [Item 2]              │
│ [Item 3]              │
│                       │
│ [Clear Cart]          │
│ [Continue Shopping]   │
└───────────────────────┘
```

**Cart Item Card Layout:**
```
┌──────────────────────────────────────────────────┐
│ [Image] Product Name                    [Remove] │
│ 100x100 Variant: Size M, Color Black            │
│         Rp XXX,XXX                               │
│                                                  │
│         [−] [Qty: 2] [+]    Subtotal: Rp XXX    │
│                                                  │
│         {Stock validation error badge - if any} │
└──────────────────────────────────────────────────┘
```

---

### 5.2 Visual Design Guidelines

**Color Coding for Stock Status:**
- **In Stock (valid):** No badge, normal styling
- **Low Stock Warning:** Yellow/amber badge `bg-yellow-100 text-yellow-800`
- **Out of Stock:** Red badge `bg-red-100 text-red-800`
- **Product Inactive:** Gray badge `bg-gray-100 text-gray-800`

**Button States:**
- **Proceed to Checkout (enabled):** Primary button (black bg, white text)
- **Proceed to Checkout (loading):** Disabled with spinner animation
- **Proceed to Checkout (disabled after error):** Re-enabled for retry
- **Remove Item:** Ghost button (red text on hover)
- **Clear Cart:** Secondary button (outline style)
- **Fix Issues:** Accent button (amber/yellow bg)

**Typography:**
- Product name: `text-base font-medium`
- Variant info: `text-sm text-gray-600`
- Price: `text-lg font-semibold`
- Subtotal: `text-base font-medium`
- Cart total: `text-2xl font-bold`

**Spacing:**
- Cart item cards: `gap-4` between items
- Padding inside cart item card: `p-4`
- Order summary: `sticky top-20` (stays visible on scroll)

---

### 5.3 Loading States

**Cart Page Initial Load:**
- Show skeleton loaders for cart items (3 placeholder cards)
- Order summary shows loading spinner
- Duration: Until API response received

**Quantity Update Loading:**
- Disable quantity controls during update
- Show subtle spinner next to quantity input
- Lock item card (prevent other actions)

**Stock Validation Loading:**
- "Proceed to Checkout" button shows spinner + "Validating stock..."
- Disable all cart actions during validation
- Show loading overlay on cart items section

**Remove Item Loading:**
- Fade out item card with loading overlay
- Show spinner in place of item
- Remove from DOM after API confirmation

---

### 5.4 Error States

**API Failure Scenarios:**

**Cart Load Failed:**
```
┌────────────────────────────────────┐
│  ⚠️ Unable to load your cart       │
│  Please check your connection      │
│  [Retry] button                    │
└────────────────────────────────────┘
```

**Update Quantity Failed:**
```
Inline error below quantity controls:
"Failed to update quantity. [Retry]"
(Red text, small font)
```

**Stock Validation Failed (API error):**
```
Banner at top of cart page:
"Unable to validate stock. Please try again."
[Retry Validation] button
```

**Remove Item Failed:**
```
Toast notification (top-right):
"Failed to remove item. Please try again."
(Auto-dismiss after 5 seconds)
```

---

### 5.5 Empty States

**Empty Cart (No Items):**
```
┌─────────────────────────────────┐
│     🛒                          │
│  Your cart is empty             │
│  Start adding items to shop!    │
│                                 │
│  [Start Shopping]               │
└─────────────────────────────────┘
```
- Center-aligned vertically and horizontally
- Shopping cart icon (from Lucide or custom)
- CTA button navigates to `/categories`

**Empty Cart After Clearing:**
- Same as above, but with transition animation
- Items fade out before empty state appears

---

### 5.6 Interactive Feedback

**Quantity Controls:**
- **Hover:** Change background color (light gray)
- **Click:** Show ripple effect (optional)
- **Disabled:** Opacity 50%, cursor not-allowed
- **Max quantity reached:** "+" button disabled, show tooltip "Max stock: X"
- **Min quantity (1):** "-" button disabled

**Remove Item Confirmation:**
```
Dialog/Modal:
┌─────────────────────────────────┐
│  Remove Item?                   │
│  Are you sure you want to       │
│  remove this item from cart?    │
│                                 │
│  [Cancel] [Remove]              │
└─────────────────────────────────┘
```
- Modal overlay with backdrop blur
- Focus trap (keyboard navigation)
- ESC key closes modal (Cancel)

**Clear Cart Confirmation:**
```
Dialog/Modal:
┌─────────────────────────────────┐
│  Clear Cart?                    │
│  This will remove all X items   │
│  from your cart.                │
│                                 │
│  [Cancel] [Clear All]           │
└─────────────────────────────────┘
```

---

### 5.7 Edge Cases & Error Handling

**Edge Case 1: Product Deleted While in Cart**
- Scenario: User added product yesterday, product deleted by admin today
- Behavior: Show gray badge "Product no longer available" + Remove button
- Cart can't proceed to checkout until removed

**Edge Case 2: Price Changed While in Cart**
- Scenario: Product price updated by admin after user added to cart
- Behavior: Cart shows current price (fetch from API on page load)
- Optional: Show "Price updated" notice if different from when added

**Edge Case 3: Variant Deleted/Disabled**
- Scenario: User selected "Size M" variant, admin disabled that variant
- Behavior: Show error "This variant is unavailable" + Remove button
- Suggest alternative variants if available (optional enhancement)

**Edge Case 4: Guest Cart Too Large (>50 items)**
- Scenario: Guest cart in localStorage exceeds reasonable limit
- Behavior: Show warning "Cart has too many items. Please login to save all items."
- Limit guest cart to 50 items max

**Edge Case 5: Network Offline**
- Scenario: User offline, tries to update cart
- Behavior: Show offline banner at top "You're offline. Changes won't be saved."
- Disable "Proceed to Checkout" button
- Guest cart changes still work (localStorage)

**Edge Case 6: Concurrent Cart Updates**
- Scenario: User opens 2 tabs, updates cart in both
- Behavior: Last write wins (API handles conflicts)
- Optional: Show notification "Cart updated in another tab" and refresh

**Edge Case 7: Validation Passes, Then Stock Changes**
- Scenario: Validation passes, user waits 5 min, then clicks checkout again (stock now depleted)
- Behavior: Re-validate on checkout page load
- If failed, redirect back to cart with errors

**Edge Case 8: Quantity Input Edge Cases**
- Input "0" → Reset to 1 (min quantity)
- Input "99999" → Cap to available stock or reasonable max (e.g., 99)
- Input "2.5" → Round down to 2
- Input "abc" → Ignore, keep previous value
- Empty input → Reset to 1 on blur

---

## Section 6: Implementation Notes & Dependencies

### 6.1 File Changes Required

**Files to Modify:**
```
src/routes/cart.tsx
  - Refactor to use useCartStore instead of old logic
  - Add stock validation integration
  - Update UI to match new design specs
```

**New Files to Create:**
```
src/features/cart/hooks/use-checkout-validation.ts
  - Hook for stock validation API call
  - Returns validation state and errors

src/features/cart/hooks/use-checkout-validation.test.ts
  - Unit tests for validation hook

src/features/cart/components/cart-item-card.tsx
  - Extract cart item display logic
  - Include quantity controls, remove button
  - Display stock validation errors

src/features/cart/components/cart-item-card.test.tsx
  - Unit tests for cart item card

src/features/cart/components/order-summary.tsx
  - Sticky order summary sidebar
  - Subtotal, total items, checkout button

src/features/cart/components/order-summary.test.tsx
  - Unit tests for order summary

src/features/cart/components/stock-validation-error.tsx
  - Display stock error badges and messages
  - Auto-fix suggestions

src/features/cart/components/stock-validation-error.test.tsx
  - Unit tests for error display
```

---

### 6.2 API Dependencies

**Required Backend Endpoints:**

**Cart Validation Endpoint:**
```
POST /api/cart/validate
Request: {
  items: Array<{
    productId: string
    variantId: string
    quantity: number
  }>
}

Response: {
  valid: boolean
  errors: Array<{
    productId: string
    variantId: string
    productName: string
    requestedQty: number
    availableQty: number
    error: 'out_of_stock' | 'insufficient_stock' | 'product_inactive'
  }>
}
```

**Existing Endpoints (Already Available):**
- `GET /api/cart` - Fetch authenticated user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update item quantity
- `DELETE /api/cart/items/:id` - Remove item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/merge` - Merge guest cart on login

---

### 6.3 Component Dependencies

**Shadcn UI Components Needed:**
```bash
# If not already installed, run:
pnpm dlx shadcn@latest add dialog      # For confirmation modals
pnpm dlx shadcn@latest add badge       # For stock status badges
pnpm dlx shadcn@latest add skeleton    # For loading states
pnpm dlx shadcn@latest add alert       # For error messages
pnpm dlx shadcn@latest add button      # Already installed
```

**Lucide Icons:**
```typescript
import {
  ShoppingCart,    // Empty cart icon
  Trash2,          // Remove item
  Minus,           // Decrease quantity
  Plus,            // Increase quantity
  AlertCircle,     // Error icon
  CheckCircle,     // Success icon
  Loader2          // Loading spinner
} from 'lucide-react'
```

---

### 6.4 State Management Integration

**Zustand Store Usage:**
```typescript
// In cart.tsx component
import { useCartStore } from '@/features/cart'
import { useAuthStore } from '@/features/auth'

const { user, isAuthenticated } = useAuthStore()
const {
  items,           // Authenticated cart items
  guestItems,      // Guest cart items
  addItem,
  updateItem,
  removeItem,
  clearCart,
  updateGuestItem,
  removeGuestItem,
  clearGuestCart
} = useCartStore()

// Determine which cart to display
const displayItems = isAuthenticated ? items : guestItems
```

**TanStack Query Integration:**
```typescript
// For stock validation
const { mutate: validateStock, isPending, error } = useMutation({
  mutationFn: validateCartStock,
  onSuccess: (data) => {
    if (data.valid) {
      router.push('/checkout')
    } else {
      setValidationErrors(data.errors)
    }
  }
})
```

---

### 6.5 Error Handling Strategy

**Error Categories:**

**1. Network Errors (API timeout, offline):**
```typescript
if (error.code === 'NETWORK_ERROR') {
  toast.error('Connection failed. Please check your internet.')
  // Keep UI in current state, allow retry
}
```

**2. Server Errors (500, 503):**
```typescript
if (error.status >= 500) {
  toast.error('Something went wrong. Please try again later.')
  // Log to error tracking service (Sentry, etc.)
}
```

**3. Client Errors (400, 404):**
```typescript
if (error.status === 400) {
  // Show validation error from API response
  toast.error(error.message)
}

if (error.status === 404) {
  // Product not found, remove from cart
  removeItem(itemId)
  toast.info('Item removed (no longer available)')
}
```

**4. Stock Validation Errors:**
```typescript
// Display inline on cart items (not toast)
// Show error badge + action button (Remove/Update)
```

---

### 6.6 Performance Considerations

**Optimization Strategies:**

**1. Debounce Quantity Updates:**
```typescript
const debouncedUpdateQuantity = useDebounce((itemId, quantity) => {
  updateItem(itemId, quantity)
}, 500) // Wait 500ms after user stops typing
```

**2. Optimistic UI Updates:**
```typescript
// Update UI immediately, rollback if API fails
const handleRemove = (itemId) => {
  const previousItems = items
  removeItemFromUI(itemId) // Instant UI update

  removeItem(itemId).catch(() => {
    restoreItems(previousItems) // Rollback on error
    toast.error('Failed to remove item')
  })
}
```

**3. Memoize Cart Calculations:**
```typescript
const cartTotal = useMemo(() => {
  return displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}, [displayItems])
```

**4. Image Lazy Loading:**
```typescript
<img
  src={item.imageUrl}
  loading="lazy"
  alt={item.name}
/>
```

---

### 6.7 Accessibility Requirements

**Keyboard Navigation:**
- [ ] All interactive elements focusable (Tab order logical)
- [ ] Quantity controls accessible via keyboard (Arrow keys ±1)
- [ ] Enter key on "Proceed to Checkout" triggers validation
- [ ] ESC key closes confirmation modals
- [ ] Screen reader announces cart total changes

**ARIA Labels:**
```typescript
<button
  aria-label={`Remove ${item.name} from cart`}
  onClick={() => handleRemove(item.id)}
>
  <Trash2 />
</button>

<input
  type="number"
  aria-label={`Quantity for ${item.name}`}
  aria-valuemin="1"
  aria-valuemax={item.availableStock}
  value={item.quantity}
/>
```

**Focus Management:**
- After removing item, focus moves to next item (or "Continue Shopping" if last)
- After closing modal, focus returns to trigger button
- Validation errors announce via `role="alert"`

---

### 6.8 Browser Compatibility

**Supported Browsers:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**localStorage Requirements:**
- Guest cart requires localStorage support
- Fallback: Show message "Please enable cookies/storage to use cart"
- Test: Private/Incognito mode (localStorage may be restricted)

---

### 6.9 Migration from Old Cart Logic

**Before Starting Implementation:**
1. [ ] Backup current `cart.tsx` to `cart.tsx.backup`
2. [ ] Document any custom logic in old implementation
3. [ ] Identify if any existing cart data needs migration

**Data Migration (if needed):**
- Old localStorage key: Check if different from new cart store
- If users have items in old cart format, write migration script:
  ```typescript
  const migrateOldCart = () => {
    const oldCart = localStorage.getItem('old-cart-key')
    if (oldCart) {
      const items = JSON.parse(oldCart)
      items.forEach(item => addGuestItem(item))
      localStorage.removeItem('old-cart-key')
    }
  }
  ```

---

## Section 7: Definition of Done & Sign-off Criteria

### 7.1 Feature Completion Checklist

**Cart Page UI Refactor - DONE when:**
- [ ] All components migrated to use `useCartStore`
- [ ] Guest cart and authenticated cart both functional
- [ ] All UI components match design specifications
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Empty state displays correctly
- [ ] All loading states implemented
- [ ] All error states implemented
- [ ] Quantity controls work correctly (increment, decrement, direct input)
- [ ] Remove item with confirmation works
- [ ] Clear cart with confirmation works
- [ ] Cart total calculates correctly
- [ ] Cart badge in header shows correct item count
- [ ] All unit tests written and passing (100% coverage for new components)
- [ ] No console errors or warnings
- [ ] Code reviewed and approved

**Stock Validation & Checkout Prep - DONE when:**
- [ ] `useCheckoutValidation` hook implemented and tested
- [ ] Stock validation API integration working
- [ ] Out-of-stock items display error badges
- [ ] Insufficient stock items show warnings with auto-adjust option
- [ ] Inactive products display errors
- [ ] "Fix Issues" auto-fix functionality working
- [ ] Validation prevents checkout when errors exist
- [ ] Successful validation navigates to `/checkout`
- [ ] All validation error messages are user-friendly
- [ ] Loading states during validation implemented
- [ ] Retry validation after errors works correctly
- [ ] All unit tests written and passing
- [ ] Code reviewed and approved

**Integration & E2E Testing - DONE when:**
- [ ] All 5 E2E flows tested manually and passing
- [ ] All feature-based test checklists completed (100% pass rate)
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] Mobile device testing completed (iOS Safari, Chrome Mobile)
- [ ] Guest cart → login → merge flow verified
- [ ] Cart persistence across page refreshes verified
- [ ] API error scenarios tested and handled gracefully
- [ ] Performance benchmarks met (see below)
- [ ] Accessibility audit passed (keyboard nav, ARIA labels, screen reader)

---

### 7.2 Quality Gates

**Code Quality:**
- [ ] Biome linting passes (`bun run lint`)
- [ ] Biome formatting passes (`bun run format`)
- [ ] TypeScript compilation with no errors (`bun run build`)
- [ ] No `@ts-ignore` or `any` types (unless absolutely necessary with comment)
- [ ] All components follow feature-based architecture (CLAUDE.md)
- [ ] All imports use barrel exports (`@/features/cart`, not direct paths)

**Test Coverage:**
- [ ] Unit tests: Minimum 90% coverage for new code
- [ ] All new components have `.test.tsx` files
- [ ] All new hooks have `.test.ts` files
- [ ] All new utilities have `.test.ts` files
- [ ] Tests run in CI/CD pipeline

**Performance Benchmarks:**
- [ ] Cart page load time < 1.5s (with 20 items)
- [ ] Quantity update response < 300ms
- [ ] Stock validation API call < 500ms
- [ ] No layout shifts (CLS score < 0.1)
- [ ] No memory leaks (test with 100+ quantity updates)

**Accessibility Standards:**
- [ ] WCAG 2.1 AA compliance
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader friendly (tested with VoiceOver/NVDA)
- [ ] Focus indicators visible

---

### 7.3 User Acceptance Criteria

**Must Support These User Stories:**

**Story 1: Guest Shopping**
```
As a guest user,
I want to add items to my cart without logging in,
So that I can browse freely before committing to an account.

Acceptance:
- Guest can add/remove/update cart items
- Guest cart persists across page refreshes
- Guest cart shows correct totals
```

**Story 2: Seamless Login**
```
As a guest user with items in my cart,
I want my cart to merge when I log in,
So that I don't lose my selections.

Acceptance:
- Login preserves all guest cart items
- Duplicate items combine quantities
- No items lost during merge
```

**Story 3: Stock Awareness**
```
As a shopper,
I want to know if items are out of stock before checkout,
So that I don't waste time on unavailable products.

Acceptance:
- Out-of-stock items clearly marked
- Cannot proceed to checkout with stock issues
- Easy way to fix stock problems
```

**Story 4: Quick Fixes**
```
As a shopper with stock errors,
I want an easy way to fix all issues at once,
So that I can quickly proceed to checkout.

Acceptance:
- "Fix Issues" button resolves all fixable problems
- Auto-adjusts quantities to available stock
- Removes unavailable items
- One-click solution
```

---

### 7.4 Known Limitations & Future Enhancements

**Current Phase 2 Limitations:**
- Stock validation only happens at checkout (not real-time during browsing)
- Price changes in cart require page refresh to reflect
- No "Save for Later" functionality
- Guest cart limited to localStorage (no cross-device sync)
- No cart expiration/cleanup logic

**Post-Phase 2 Enhancements (Deferred):**
- Real-time stock updates via WebSocket
- "Save for Later" feature
- Cart abandonment recovery (email reminders)
- Estimated delivery date display
- Gift wrapping options
- Bulk actions (select multiple items to remove)

---

### 7.5 Deployment Checklist

**Pre-Deployment:**
- [ ] All Definition of Done criteria met
- [ ] Feature flag created (if using feature flags)
- [ ] Backend API endpoints deployed and tested in staging
- [ ] Database migrations run (if any)
- [ ] Environment variables configured
- [ ] Analytics events configured (cart actions tracking)

**Deployment:**
- [ ] Deploy to staging environment
- [ ] Smoke test all critical flows in staging
- [ ] QA team sign-off
- [ ] Product owner sign-off
- [ ] Deploy to production (off-peak hours recommended)

**Post-Deployment:**
- [ ] Monitor error logs for 24 hours
- [ ] Check analytics for cart abandonment rate
- [ ] Verify API success rates (>99%)
- [ ] User feedback collection
- [ ] Hotfix plan ready (rollback strategy)

---

### 7.6 Sign-off & Approval

**Required Approvals:**

| Role | Name | Approval | Date |
|------|------|----------|------|
| Developer | [Name] | [ ] | ____ |
| QA Engineer | [Name] | [ ] | ____ |
| Product Owner | [Name] | [ ] | ____ |
| Tech Lead | [Name] | [ ] | ____ |

**Sign-off Criteria:**
- All features implemented per requirements
- All tests passing (unit + integration + E2E)
- All quality gates passed
- No critical or high-priority bugs
- Performance benchmarks met
- Accessibility audit passed
- Documentation complete

**Post-Implementation Review:**
- Schedule: Within 1 week after deployment
- Attendees: Dev team, QA, Product Owner
- Agenda:
  - What went well?
  - What could be improved?
  - Lessons learned for Phase 3
  - Technical debt identified

---

## Document Summary

**Phase 2 Day 9-10 Remaining Tasks:**
1. ✅ Cart Page UI Refactor (Section 2)
2. ✅ Stock Validation & Checkout Prep (Section 3)
3. ✅ Integration & E2E Testing (Section 4)
4. ✅ UI/UX Polish (Section 5)

**Estimated Effort:** 2 days (16 hours)
- Cart Page Refactor: 6-8 hours
- Stock Validation: 4-6 hours
- Testing & Polish: 4-6 hours

**Dependencies:**
- Backend: `/api/cart/validate` endpoint must be ready
- Design: All stock error states approved
- QA: Testing environment setup

**Success Metrics:**
- Cart abandonment rate < 70% (industry average)
- Checkout conversion rate > 30%
- Stock validation errors < 5% of checkout attempts
- Zero critical bugs in first week post-launch

---

**Document Status:** Final Draft
**Created By:** Development Team
**Date:** 2025-01-01
**Next Review:** After Phase 2 Day 9-10 completion

---

**End of Requirements Document**
