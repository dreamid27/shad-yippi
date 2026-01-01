# Phase 3 Frontend Design - Checkout & Payment System

**Date:** 2026-01-01
**Project:** shad-yippi (Frontend)
**Phase:** 3 - Checkout & Payment (Week 5-6)
**Status:** Design Document

---

## Executive Summary

This document details the technical design for Phase 3 frontend implementation, covering:
- **Multi-step Checkout Flow** with address, shipping, payment, review
- **Address Management** with create, edit, delete, default selection
- **Shipping Cost Calculator** with real-time RajaOngkir API integration
- **Payment Integration** with Midtrans Snap popup
- **Order Management** with success, failed, and history pages
- **Voucher Code Input** for discount application (user-facing only)

**Key Design Decisions:**
1. ✅ **4-step wizard checkout** - Progressive disclosure, clear flow
2. ✅ **Auto-save progress** - Persist draft order across steps
3. ✅ **Real-time validation** - Immediate feedback on form inputs
4. ✅ **Midtrans Snap popup** - Secure payment without redirecting
5. ✅ **Polling for payment status** - Auto-refresh after payment initiation
6. ✅ **Mobile-first design** - Optimized for mobile checkout (critical conversion)
7. ✅ **Guest checkout** - Require login only before payment

---

## Feature Checklist (Detailed Implementation)

### Feature 1: Multi-Step Checkout Flow

**Component:** `src/features/checkout/components/checkout-wizard.tsx`

**Sub-components Required:**
- Step 1: `AddressSelectionStep`
- Step 2: `ShippingMethodStep`
- Step 3: `PaymentMethodStep`
- Step 4: `OrderReviewStep`

**Step 1: Address Selection**
- **Address List Display:**
  - Show all user addresses (from `/api/addresses`)
  - Highlight default address with badge
  - Each address card shows: recipient name, phone, full address
  - Radio button for selection
  - "Edit" button per address
  - "Delete" button per address (with confirmation)

- **Create New Address:**
  - Button "Add New Address"
  - Opens modal/dialog with address form
  - Fields: label, recipient name, phone, address line 1, address line 2 (optional), province, city, district (optional), postal code
  - Province dropdown (fetch from `/api/shipping/provinces`)
  - City dropdown (fetch from `/api/shipping/cities?province_id=XXX`)
  - "Set as default address" checkbox
  - Validation: phone format, postal code format (5 digits), required fields

- **Address Form Validation:**
  - Real-time validation on blur
  - Error messages below each field
  - Submit button disabled until valid
  - Loading state during API call

**Step 2: Shipping Method Selection**
- **Shipping Cost Calculation:**
  - Auto-calculate on step entry (using selected address + cart weight)
  - Fetch from `/api/shipping/cost` with origin: warehouse city, destination: selected address city
  - Show loading skeleton during API call

- **Courier Options Display:**
  - Group by courier (JNE, J&T, SiCepat, Anteraja)
  - Each service displayed as card: Service name, description, cost, ETA
  - Radio button for selection
  - Show cost formatted in IDR (e.g., "Rp 32.000")
  - Show ETA (e.g., "1-2 hari")

- **Default Selection:**
  - Auto-select JNE REG (or cheapest option)
  - Or remember user's last selection

**Step 3: Payment Method Selection**
- **Payment Methods Display:**
  - Grid of payment method cards with icons
  - Supported methods:
    * Virtual Accounts: BCA, Mandiri, BNI, BRI
    * E-wallets: GoPay, OVO, Dana, ShopeePay
    * QRIS (with QR code icon)
    * Credit/Debit Card
    * Cash on Delivery (COD)

- **Voucher Code Input:**
  - Input field: "Voucher Code"
  - "Apply" button
  - API call to validate voucher
  - On success: Show discount amount, update order summary
  - On error: Show error message below input
  - Support multiple voucher attempts

- **Payment Method Selection:**
  - Click on payment method card selects it
  - Selected card highlighted with border
  - Show payment-specific details (e.g., VA number, bank logo)

**Step 4: Order Review & Confirmation**
- **Order Summary Display:**
  - Items list: product name, variant, quantity, price, subtotal
  - Subtotal: Sum of all items
  - Shipping cost: Selected shipping method cost
  - Discount: Applied voucher amount (if any)
  - Tax: 11% PPN (calculate from subtotal - discount)
  - **Total:** Bold, large font, sum of all
  - Order total must match Step 3 calculation

- **Shipping Address Review:**
  - Display selected address (read-only)
  - "Edit" button to go back to Step 1

- **Payment Method Review:**
  - Display selected payment method (read-only)
  - Show payment instructions (e.g., "Transfer to BCA account: 1234567890")
  - "Edit" button to go back to Step 3

- **Terms & Conditions:**
  - Checkbox: "I agree to the Terms & Conditions and Privacy Policy"
  - Link to T&C page
  - Submit button disabled until checked

- **Place Order Button:**
  - Large, prominent button at bottom
  - Text: "Place Order & Pay" or "Confirm Order" (for COD)
  - Loading state during API call
  - Disabled until: address selected, shipping selected, payment selected, T&C checked

- **Error Handling:**
  - Stock validation errors: Show which items out of stock, suggest reducing quantity
  - Shipping cost mismatch: Recalculate, show updated cost
  - Payment initialization failed: Show error, allow retry

---

### Feature 2: Address Management Page

**Route:** `/addresses` or `/profile/addresses`

**Page Components:**
- **Page Header:**
  - Title: "Shipping Addresses"
  - Button: "Add New Address" (top right)

- **Address List:**
  - Grid layout (desktop) or list (mobile)
  - Each address card:
    * Label badge (Home, Office, etc.) - colored
    * Default badge if `is_default = true` - highlighted
    * Recipient name and phone
    * Full address (multi-line)
    * "Edit" button
    * "Delete" button (with confirmation dialog)
    * "Set as Default" button (if not default)

- **Empty State:**
  - Message: "No addresses yet"
  - CTA: "Add your first address"
  - Illustration/icon

- **Add/Edit Address Modal:**
  - Reuse from checkout Step 1
  - Fields: label, recipient name, phone, address line 1, address line 2, province dropdown, city dropdown, district (optional), postal code
  - Province/city cascading dropdowns (city options update when province changes)
  - Validation: real-time
  - Save button with loading state
  - Cancel button to close modal

---

### Feature 3: Shipping Cost Calculator

**Component:** `src/features/checkout/components/shipping-calculator.tsx`

**Features:**
- **Real-time Cost Calculation:**
  - Triggered when: Address selected, cart changes, courier selection changes
  - Fetch from `/api/shipping/cost`
  - Request body: origin_city_id (warehouse), destination_city_id (address), weight (cart total), courier (optional)

- **Loading State:**
  - Skeleton animation for shipping options
  - Show "Calculating shipping costs..." text

- **Cost Display:**
  - Group by courier
  - Show cheapest option highlighted
  - Format: "Rp 32.000 (1-2 hari)"
  - Show ETA for each service

- **Error Handling:**
  - Failed to calculate: Show error message, retry button
  - No shipping options: "Shipping not available to this address"
  - Rate limit exceeded: Show message, try again later

---

### Feature 4: Payment Integration

**Component:** `src/features/checkout/components/payment-method-selector.tsx`

**Payment Methods Display:**
- **Grid Layout:** 2-3 columns on desktop, 1 column on mobile
- **Payment Method Cards:**
  * Icon/badge for each method (VA bank logo, e-wallet logo, QRIS icon, CC icon, COD icon)
  * Method name: "BCA Virtual Account", "GoPay", "Credit Card", "COD"
  * Selected state: Highlighted border, checkmark icon
  * Click to select

- **Payment Method Details:**
  * **VA Payments:** Show bank logo, "Transfer to: 1234567890", "Account name: COMPANY NAME"
  * **E-wallets:** Show wallet logo, redirect instruction
  * **QRIS:** QR code display (if needed), scan instruction
  * **Credit Card:** Card number input, expiry, CVV, cardholder name
  * **COD:** No extra details, "Pay on delivery" message

- **Midtrans Snap Integration:**
  * **Popup Trigger:** On "Place Order & Pay" click
  * **Open Snap:** Call `window.snap.pay(paymentUrl, options)`
  * **Handle Close:**
    - User closes popup → Stay on checkout, show "Payment cancelled" message
    - Payment success → Redirect to `/orders/success/:orderId`
    - Payment failed → Redirect to `/orders/failed/:orderId`
  * **Fallback:** If Snap popup blocked, open in new tab with "Open Payment Page" button

**Payment Status Polling:**
- **Polling Component:** `src/features/checkout/hooks/use-payment-polling.ts`
- **Polling Logic:**
  * Start polling after payment initiation (every 3 seconds)
  * Call `GET /api/payments/:id/status`
  * Stop polling when:
    - Status = "success" → Redirect to success page
    - Status = "failed" → Redirect to failed page
    - Status = "expired" → Redirect to failed page
    - Timeout after 5 minutes
  * Show "Checking payment status..." spinner during polling

---

### Feature 5: Order Success Page

**Route:** `/orders/success/:orderId`

**Page Components:**
- **Success Header:**
  * Large checkmark icon (green, animated)
  * Heading: "Order Placed Successfully!"
  * Subheading: "Thank you for your order"

- **Order Details Card:**
  * Order number: "ORD-20260101-12345"
  * Order date: "January 1, 2026"
  * Order status: "Waiting for payment" (or "Payment Confirmed" if already paid)
  * Estimated delivery: "3-5 business days"

- **Order Summary:**
  * Items: Collapsible list (show first 3, "View all items" toggle)
  * Subtotal, shipping, discount, tax, total (same as checkout review)

- **Next Steps:**
  * Checklist of what happens next:
    1. "Payment verification in progress"
    2. "You'll receive confirmation email"
    3. "We'll process your order within 24 hours"
    4. "You'll receive tracking number when shipped"

- **Call-to-Action Buttons:**
  * "View Order Details" → Link to `/orders/:orderId`
  * "Continue Shopping" → Link to `/categories`
  * "Contact Support" → Link to FAQ or WhatsApp

- **Email Verification Note:**
  * Message: "Check your email for order confirmation and payment instructions"
  * Resend email button (optional)

---

### Feature 6: Order Failed Page

**Route:** `/orders/failed/:orderId`

**Page Components:**
- **Error Header:**
  * X icon (red)
  * Heading: "Payment Failed"
  * Subheading: "Your order could not be completed"

- **Error Details:**
  * Error message from backend (e.g., "Payment expired", "Card declined")
  * Order number: "ORD-20260101-12345"

- **Order Actions:**
  * "Try Again" → Redirect back to checkout with cart preserved
  * "Change Payment Method" → Link to checkout Step 3
  * "Cancel Order" → Call `POST /api/orders/:id/cancel` with reason

- **Support Section:**
  * "Need help?"
  * "Contact customer support" (WhatsApp button)
  * "Check FAQ" link

---

### Feature 7: Order History Page

**Route:** `/orders` or `/profile/orders`

**Page Components:**
- **Page Header:**
  * Title: "My Orders"
  * Search input: "Search by order number"
  * Filter dropdown: "All Orders", "Pending Payment", "Processing", "Shipped", "Delivered", "Cancelled"

- **Order List:**
  * Grid layout: Cards or list items
  * Each order card:
    * Order number: "ORD-20260101-12345"
    * Order date: "Jan 1, 2026"
    * Order status badge: Color-coded
      * Pending Payment: Yellow
      * Processing: Blue
      * Shipped: Purple
      * Delivered: Green
      * Cancelled: Red
    * Total: "Rp 532.000"
    * Action buttons: "View Details", "Track Order" (if shipped)

- **Empty State:**
  * Message: "No orders yet"
  * CTA: "Start Shopping"
  * Illustration/icon

- **Loading State:**
  * Skeleton animation for order cards

- **Pagination:**
  * "Load More" button or infinite scroll
  * Page number indicator: "Page 1 of 5"

---

### Feature 8: Order Detail Page

**Route:** `/orders/:orderId`

**Page Components:**
- **Page Header:**
  * Breadcrumb: Home → My Orders → Order Details
  * Back button: "← Back to Orders"

- **Order Status Section:**
  * **Status Badge:** Large, color-coded
  * **Status Timeline:** Vertical timeline showing order journey
    * Pending Payment: Created → Payment Verified → Processing
    * Shipped: Processing → Shipped (with tracking number) → Delivered
    * Cancelled: Pending Payment → Cancelled
  * Each timeline item: Icon, label, timestamp

- **Order Actions:**
  * "Cancel Order" button (if status = "Pending Payment")
    * Opens confirmation dialog
    * Input: "Reason for cancellation"
    * Calls `POST /api/orders/:id/cancel`
    * On success: Update status to "Cancelled"
  * "Track Order" button (if status = "Shipped" or "Delivered")
    * Shows tracking number in modal or external link
  * "Download Invoice" button (if status = "Completed")
    * Links to PDF invoice or opens preview

- **Shipping Address:**
  * Card showing selected address
  * Recipient name, phone, full address

- **Order Summary:**
  * Items list:
    * Product thumbnail (clickable → product page)
    * Product name, variant attributes, SKU
    * Quantity: "x2"
    * Price: "Rp 200.000"
    * Subtotal: "Rp 400.000"
  * Totals: Subtotal, shipping cost, discount, tax, **Total** (bold)

- **Payment Information:**
  * Payment method: "BCA Virtual Account", "GoPay", etc.
  * Payment status: "Success", "Failed", "Pending"
  * Paid date: "January 1, 2026 11:30 AM"
  * Transaction ID: "MTX-123456" (if available)

---

### Feature 9: Voucher Code Application

**Component:** `src/features/checkout/components/voucher-input.tsx`

**Location:** Checkout Step 3 (Payment Method Selection)

**Features:**
- **Input Field:**
  * Text input: "Enter voucher code"
  * Placeholder: "e.g., SAVE10"
  * Uppercase only
  * Max length: 20 characters

- **Apply Button:**
  * "Apply Voucher" button
  * Loading state during API call

- **Voucher Status Display:**
  * **Success:** Green checkmark + "Voucher applied! You save Rp 20.000"
  * **Error:** Red X + "Invalid voucher code" / "Voucher expired" / "Minimum purchase not met"
  * **Applied Voucher Badge:** Show in order summary with discount amount

- **API Integration:**
  * On "Apply" click → Call `POST /api/vouchers/validate`
  * Request body: `{ code: "SAVE10", subtotal: 500000 }`
  * Response: `{ valid: true, discount: 50000, discount_type: "fixed" }`
  * Update order summary with discount

- **Remove Voucher:**
  * "Remove" button (x icon) if voucher applied
  * Clears discount from order summary
  * Allows re-entering different voucher

---

### Feature 10: Cart Integration for Checkout

**Component:** `src/features/cart/hooks/use-checkout-cart.ts`

**Features:**
- **Cart Validation:**
  * Check cart not empty before checkout
  * Redirect to `/cart` if empty
  * Show error toast: "Your cart is empty"

- **Stock Re-validation:**
  * On checkout entry, validate all cart items still in stock
  * Call `POST /api/cart/validate` (backend stock validation)
  * If any items out of stock:
    * Show modal: "Some items are out of stock"
    * List items with current availability
    * Buttons: "Remove out-of-stock items", "Update quantities"

- **Cart Persistence:**
  * Store checkout draft in localStorage (progress saved)
  * On page refresh, restore selected address, shipping method, payment method
  * Clear draft after order placed successfully

---

## UI/UX Design Guidelines

### Design Principles

1. **Mobile-First Checkout**
   - Optimize for mobile (60%+ users on mobile)
   - Single column layout, minimal scrolling
   - Large touch targets (44px minimum)
   - Sticky "Place Order" button at bottom (visible always)

2. **Progressive Disclosure**
   - Show only current step information
   - Hide completed steps (summary in review step)
   - Clear visual indication of progress

3. **Real-time Feedback**
   - Validate on blur (not just on submit)
   - Show loading states for all async actions
   - Display errors inline, not as alerts
   - Success toasts/notifications

4. **Trust & Security**
   - Show secure payment badges (Midtrans, bank logos)
   - Display order total prominently
   - Show contact support prominently
   - HTTPS indicators visible

5. **Accessibility (WCAG 2.1 AA)**
   - Keyboard navigation support
   - Screen reader labels for all inputs
   - Color contrast minimum 4.5:1
   - Focus indicators visible
   - Error announcements to screen readers

---

### Checkout Flow UI Layout

#### Desktop Layout (1280px+)

```
┌─────────────────────────────────────────────────────────┐
│  Breadcrumb: Home → Cart → Checkout                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────┐  ┌─────────────────────────┐       │
│  │               │  │                         │       │
│  │   STEP 1     │  │   CHECKOUT PROGRESS     │       │
│  │   Address     │  │   ●●●○○ (3/5)          │       │
│  │               │  │                         │       │
│  └───────────────┘  └─────────────────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │   [Address List Grid]                          │   │
│  │                                                 │   │
│  │   ┌──────────────┐  ┌──────────────┐         │   │
│  │   │ Home (Def)  │  │ Office       │         │   │
│  │   │             │  │              │         │   │
│  │   │ John Doe    │  │ Jane Smith   │         │   │
│  │   │ Jakarta...   │  │ Bandung...   │         │   │
│  │   │ [Edit][Del] │  │ [Edit][Del]  │         │   │
│  │   └──────────────┘  └──────────────┘         │   │
│  │                                                 │   │
│  │   [+ Add New Address]                          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │   Previous   │  │    Next      │                 │
│  │   Step       │  │    Step      │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Progress Bar:** Visual indicator of current step (1-4)
- **Two-Column Layout:** Form content (left) + order summary (right, sticky)
- **Address Grid:** 2 columns, responsive cards
- **Navigation Buttons:** Previous (left), Next (right, primary)

---

#### Mobile Layout (375px - 428px)

```
┌──────────────────────────────┐
│  ←  Checkout (3/4)           │
├──────────────────────────────┤
│                              │
│  STEP 3: PAYMENT METHOD      │
│                              │
│  ┌────────────────────────┐  │
│  │ Voucher Code           │  │
│  │ [SAVE10] [ Apply ]     │  │
│  │ ✓ Applied! Save        │  │
│  │   Rp 20.000            │  │
│  └────────────────────────┘  │
│                              │
│  Select Payment Method:      │
│                              │
│  ┌────────────────────┐    │
│  │ [BCA VA]           │    │
│  │ Transfer to:        │    │
│  │ 1234567890          │    │
│  │ [Account: COMP]     │    │
│  │ ●                  │    │
│  └────────────────────┘    │
│                              │
│  ┌────────────────────┐    │
│  │ [GoPay]            │    │
│  │ E-wallet            │    │
│  └────────────────────┘    │
│                              │
│  [ Terms & Conditions ✓ ]   │
│                              │
├──────────────────────────────┤
│  Order Summary: Rp 532.000  │
│  [ Place Order & Pay ]      │
└──────────────────────────────┘
```

**Key Elements:**
- **Single Column:** Vertical stacking
- **Sticky Footer:** Order summary + CTA always visible
- **Large Touch Targets:** Buttons 44px+ height
- **Progress Indicator:** Top bar with step number
- **Back Button:** Top left (←)

---

### Component-Level UI Specifications

#### Address Card Component

**Layout:**
```
┌──────────────────────────────────────┐
│  HOME ●                             │  ← Default badge (blue)
│                                    │
│  John Doe                           │
│  +62 812 3456 7890                  │
│                                    │
│  Jl. Sudirman No. 123              │
│  Apt. ABC, Lt. 5                   │
│  Kebayoran Baru, Jakarta Selatan    │
│  12190                              │
│                                    │
│  [Edit]  [Delete]                   │
└──────────────────────────────────────┘
```

**States:**
- **Default:** Blue badge "DEFAULT" (top right), slightly larger border
- **Selected:** Green border (2px), checkmark icon (top left)
- **Normal:** Gray border (1px), no badge
- **Hover:** Gray border (2px), shadow

**Color Palette:**
- Default badge: `bg-blue-500`, `text-white`
- Selected border: `border-green-500`
- Hover state: `shadow-lg`

---

#### Shipping Method Card Component

**Layout:**
```
┌──────────────────────────────────────┐
│  ●  JNE - REG                       │  ← Radio selected (green)
│      Regular Shipping               │
│      Rp 32.000                      │
│      🚚 1-2 days                   │  ← ETA icon + text
└──────────────────────────────────────┘
```

**States:**
- **Selected:** Green radio (●), border highlight
- **Cheapest:** "BEST VALUE" badge (gold)
- **Normal:** Gray radio (○)
- **Hover:** Slight lift (+2px y-offset)

**Typography:**
- Courier name: Bold, 16px
- Description: Regular, 14px, gray-600
- Price: Bold, 18px, black
- ETA: Regular, 12px, gray-500

---

#### Payment Method Grid Component

**Layout (Desktop):**
```
┌──────────┬──────────┬──────────┬──────────┐
│          │          │          │          │
│  [BCA]   │ [GoPay]  │ [QRIS]   │ [CC]     │
│   VA     │          │          │          │
│          │          │          │          │
│ [Mandiri]│ [OVO]    │ [COD]    │          │
│   VA     │          │          │          │
└──────────┴──────────┴──────────┴──────────┘
```

**Payment Method Card:**
```
┌────────────────┐
│                │
│  [Bank Logo]   │  ← 48x48px icon
│                │
│ BCA VA         │  ← 16px bold
│                │
│ Transfer to:   │  ← 12px gray
│ 1234567890     │
│                │
│   ●            │  ← Selection indicator
└────────────────┘
```

**States:**
- **Selected:** Green border (2px), green radio (●)
- **Normal:** Gray border (1px), gray radio (○)
- **Hover:** Blue border (2px), shadow
- **Disabled:** Gray opacity (50%), no cursor

---

#### Order Summary Component

**Layout (Sticky on Right/Bottom):**
```
┌──────────────────────────────────────┐
│  ORDER SUMMARY                       │
├──────────────────────────────────────┤
│  Items (3)            Rp 500.000    │
│  Shipping (JNE REG)   Rp 32.000     │
│  Discount (SAVE10)    -Rp 20.000    │  ← Red, strikethrough
│  Tax (11%)            Rp 52.800      │
├──────────────────────────────────────┤
│  TOTAL                Rp 564.800    │  ← Bold, 24px, black
└──────────────────────────────────────┘
```

**Typography:**
- Section labels: Bold, 14px, uppercase, gray-500
- Item labels: Regular, 14px, gray-700
- Prices: Semi-bold, 14px, right-aligned
- Total: Extra-bold, 24px, black

**Discount Styling:**
- Green background (green-100) + green text (green-700)
- Strikethrough on original price if discount applied

---

#### Order Status Timeline Component

**Layout:**
```
┌─────────────────────────────────────────┐
│  ORDER STATUS: PROCESSING              │
├─────────────────────────────────────────┤
│                                         │
│  ●  Order Created                       │
│     Jan 1, 2026 10:00 AM               │
│                                         │
│  ●  Payment Confirmed                   │
│     Jan 1, 2026 11:30 AM               │
│                                         │
│  ●  Order Confirmed                     │
│     Jan 1, 2026 02:00 PM               │
│                                         │
│  ○  Shipped                            │  ← Current step (gray)
│     Waiting for tracking number         │
│                                         │
│  ○  Delivered                          │  ← Future step (gray)
│                                         │
└─────────────────────────────────────────┘
```

**Timeline States:**
- **Completed (●):** Green, filled circle
- **Current (●):** Blue, filled circle + pulsing animation
- **Future (○):** Gray, outlined circle
- **Failed (✗):** Red, X icon

**Connecting Line:**
- Vertical line connecting circles
- Green (up to current), Gray (after current)
- Animated dash if current

---

### Color System

**Primary Colors:**
- Primary Action: `#000000` (black) - Main buttons, links
- Success: `#10B981` (green-600) - Success states, confirmations
- Error: `#EF4444` (red-500) - Error messages, cancel buttons
- Warning: `#F59E0B` (amber-500) - Warnings, pending states
- Info: `#3B82F6` (blue-500) - Info messages, processing

**Neutral Colors:**
- Background: `#FFFFFF` (white)
- Surface: `#F9FAFB` (gray-50)
- Border: `#E5E7EB` (gray-200)
- Text Primary: `#111827` (gray-900)
- Text Secondary: `#6B7280` (gray-500)

**Payment Method Colors:**
- BCA: `#005eb8`
- Mandiri: `#ffb81c`
- BNI: `#f57b20`
- BRI: `#005eb8`
- GoPay: `#00AED6`
- OVO: `#4c3494`
- Dana: `#118eea`
- ShopeePay: `#ee4d2d`
- QRIS: `#CC2127`

---

### Typography

**Font Family:** System fonts fallback stack
```
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
```

**Font Sizes:**
- H1 (Page Title): 32px, extra-bold
- H2 (Section Title): 24px, bold
- H3 (Card Title): 18px, semi-bold
- Body (Text): 16px, regular
- Small (Labels): 14px, regular
- X-Small (Meta): 12px, regular

**Font Weights:**
- Extra Bold: 800
- Bold: 700
- Semi-Bold: 600
- Regular: 400

---

### Spacing & Layout

**Spacing Scale (Tailwind):**
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

**Container Widths:**
- Mobile: 100% (full width)
- Tablet: 768px max-width
- Desktop: 1024px max-width
- Large Desktop: 1280px max-width

**Grid Systems:**
- Checkout Steps: Single column (mobile), 2-column desktop (66% form + 33% summary)
- Address Grid: 2 columns (desktop), 1 column (mobile)
- Payment Grid: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)

---

### Icons & Visual Elements

**Icon Library:** Lucide React (already configured in project)

**Icon Usage:**
- Navigation: ChevronLeft, ChevronRight
- Actions: Check, X, Plus, Trash, Edit
- Status: CheckCircle, XCircle, AlertCircle, Clock, Loader2
- Payment: CreditCard, Wallet, QrCode
- Shipping: Truck, Package

**Icon Sizes:**
- Small: 16px (inline icons)
- Medium: 24px (buttons, list items)
- Large: 48px (page headers, status)

**Loading States:**
- Spinner: Loader2 (animated)
- Skeleton: Pulse animation for cards
- Progress: Bar with percentage for multi-step processes

---

### Responsive Breakpoints

**Mobile (≤ 767px):**
- Single column layout
- Sticky footer (order summary + CTA)
- Full-width cards
- Touch-friendly (44px minimum tap targets)

**Tablet (768px - 1023px):**
- 2-column layout where appropriate
- Medium icon sizes (20-24px)
- Moderate padding (16-24px)

**Desktop (≥ 1024px):**
- Multi-column layouts
- Large icons (24-32px)
- Generous padding (24-32px)
- Hover states enabled

---

### Animation & Transitions

**Transition Speeds:**
- Fast: 150ms (button hover, input focus)
- Medium: 300ms (modal open/close, page transitions)
- Slow: 500ms (loading states, skeletons)

**Animation Types:**
- Fade In/Out: Opacity 0→1
- Slide Up/Down: Transform Y-axis
- Scale: Transform (scale 1.05) for hover
- Pulse: Keyframe animation for loading

**Loading Animations:**
- Skeleton: Pulse effect (opacity 0.5→1)
- Spinner: 360deg rotation (1s duration)
- Progress Bar: Width transition (ease-in-out)

---

### Accessibility Requirements

**Keyboard Navigation:**
- Tab order: Logical flow (top to bottom, left to right)
- Focus visible: Outline/border on focused elements
- Skip links: "Skip to main content"
- Enter/Space: Trigger buttons, submit forms

**Screen Reader Support:**
- ARIA labels for all interactive elements
- Live regions for dynamic content (errors, toasts)
- Heading hierarchy (h1→h2→h3)
- Alt text for images (product thumbnails, icons)
- Role attributes (button, link, dialog)

**Color Contrast:**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- No color-only meaning (icons + text labels)
- Focus states clearly visible

**Error States:**
- Inline error messages below inputs
- Announce to screen readers (aria-live="polite")
- Color + icon + text (triple indication)
- Suggestions for resolution (e.g., "Phone must start with 0 or +62")

---

## Testing Strategy

### Test Coverage Requirements

**Target Coverage:**
- Unit Tests: 80%+ coverage for all components and hooks
- Integration Tests: 100% coverage for critical user flows
- E2E Tests: 5+ critical user journeys

**Testing Tools:**
- **Vitest:** Unit tests for components, hooks, utilities
- **Testing Library:** Component testing
- **Playwright:** E2E testing (or Cypress as alternative)
- **Manual Testing:** UAT checklist with 65+ scenarios

---

### Unit Tests

#### Component Tests (Mandatory for ALL components)

**Test File Naming Convention:**
```
src/features/checkout/components/
├── checkout-wizard.tsx
├── checkout-wizard.test.tsx       # MANDATORY
├── address-selection-step.tsx
├── address-selection-step.test.tsx  # MANDATORY
├── shipping-method-step.tsx
├── shipping-method-step.test.tsx   # MANDATORY
```

**Test Scenarios per Component:**

**CheckoutWizard Component:**
- Renders all 4 steps
- Navigates between steps
- Validates required fields before advancing
- Persists selected data across steps
- Shows progress indicator correctly
- Disables navigation until step complete
- Handles back navigation correctly

**AddressCard Component:**
- Renders address details correctly
- Shows default badge when isDefault=true
- Highlights when selected
- Calls onEdit when Edit button clicked
- Calls onDelete when Delete button clicked
- Calls onSelect when card clicked
- Shows loading state during delete action

**ShippingMethodCard Component:**
- Displays courier, service, cost, ETA
- Shows BEST VALUE badge for cheapest option
- Highlights when selected
- Formats price in IDR correctly
- Calls onSelect when clicked
- Handles loading state
- Shows error state if cost calculation failed

**PaymentMethodSelector Component:**
- Renders all payment methods
- Shows correct icons for each method
- Highlights selected payment method
- Calls onSelect when method clicked
- Shows payment-specific details (VA number, bank)
- Handles Midtrans Snap popup trigger
- Shows loading state during payment initialization

**OrderSummary Component:**
- Displays correct subtotal, shipping, tax, total
- Shows discount when voucher applied
- Formats all prices in IDR
- Expands/collapses items list
- Renders all order items correctly
- Shows loading skeleton during data fetch
- Calculates tax correctly (11% PPN)

**VoucherInput Component:**
- Renders input field and apply button
- Converts input to uppercase
- Validates voucher code format
- Shows success state when voucher applied
- Shows error state for invalid/expired voucher
- Clears input after successful application
- Shows remove button when voucher applied
- Calls onRemove when remove button clicked

**OrderStatusTimeline Component:**
- Renders all status steps
- Shows completed steps with filled circles
- Shows current step with pulsing animation
- Shows future steps with outlined circles
- Displays timestamps for completed steps
- Shows correct order status badge

---

#### Hook Tests

**useCheckoutCart Hook:**
- Fetches cart data on mount
- Validates cart is not empty
- Redirects to cart page if empty
- Re-validates stock on mount
- Shows error if stock validation fails
- Returns cart items and totals

**usePaymentPolling Hook:**
- Starts polling on mount
- Polls every 3 seconds
- Stops polling on success status
- Stops polling on failed status
- Stops polling on expired status
- Times out after 5 minutes
- Calls onSuccess when payment succeeded
- Calls onError when payment failed

**useAddressForm Hook:**
- Validates phone number format
- Validates postal code format (5 digits)
- Validates all required fields
- Shows inline errors for invalid fields
- Clears errors when user starts typing
- Fetches cities when province selected
- Calls onCreate when form submitted successfully

---

### Integration Tests

#### Critical User Flows

**Test 1: Complete Checkout Flow (Happy Path)**
1. Navigate to checkout with items in cart
2. Add new address (fill form, save)
3. Select shipping method
4. Apply voucher code
5. Select payment method
6. Review order (verify totals)
7. Accept terms and place order
8. Verify order success page

**Test 2: Checkout with Existing Address**
1. Navigate to checkout with items in cart
2. Verify default address is pre-selected
3. Select shipping method
4. Select payment method
5. Place order
6. Verify success page

**Test 3: Checkout Flow - Stock Validation Error**
1. Set up cart with out-of-stock item (more items than available stock)
2. Navigate to checkout
3. Wait for stock validation
4. Verify error modal appears
5. Verify error message shows availability
6. Verify buttons to remove items or update quantities

**Test 4: Payment Failed Flow**
1. Mock failed payment from backend
2. Complete checkout flow
3. Verify redirect to failed page
4. Verify error message displayed
5. Verify retry button available

**Test 5: Order Cancellation Flow**
1. Create pending payment order
2. Navigate to order history
3. Click on pending order
4. Click cancel button
5. Enter cancellation reason
6. Verify confirmation
7. Verify order status updated to "Cancelled"

---

### End-to-End (E2E) Tests

#### User Journey Tests (Using Playwright)

**E2E Test 1: New User Complete Purchase Journey**
1. Browse products and add to cart
2. Go to cart (verify items)
3. Proceed to checkout
4. Add shipping address
5. Select shipping method
6. Apply voucher code
7. Select payment method
8. Accept terms and place order
9. Mock Midtrans Snap success
10. Verify success page
11. Verify order appears in history

**E2E Test 2: Guest Cart to Checkout After Login**
1. Add item as guest
2. Login
3. Verify cart merged
4. Complete checkout
5. Verify success

**E2E Test 3: Multiple Payment Methods Test**
1. Test checkout with VA payment
2. Test checkout with e-wallet payment
3. Test checkout with credit card
4. Test checkout with COD
5. Verify all succeed

**E2E Test 4: Order History and Tracking**
1. Create multiple orders with different statuses
2. Navigate to order history
3. Verify all orders displayed
4. Verify status badges
5. Click on shipped order
6. Verify tracking number displayed
7. Click track button
8. Verify external tracking link

**E2E Test 5: Voucher Application Scenarios**
1. Test invalid voucher code
2. Test expired voucher
3. Test minimum purchase not met
4. Test valid voucher
5. Verify discount applied
6. Verify order total updated

---

### Manual Testing Checklist

#### Checkout Flow Testing (20 Scenarios)

**Address Management:**
- [ ] Can add new address with valid data
- [ ] Cannot add address with invalid phone (too short)
- [ ] Cannot add address with invalid postal code (not 5 digits)
- [ ] Can set address as default
- [ ] Only one default address at a time
- [ ] Can edit existing address
- [ ] Can delete address
- [ ] Cannot delete default address without setting another as default
- [ ] Cities load when province selected
- [ ] Address card shows all fields correctly

**Shipping Selection:**
- [ ] Shipping costs calculated automatically
- [ ] Multiple courier options displayed
- [ ] ETA shown for each service
- [ ] Cheapest option highlighted
- [ ] Can select any shipping method
- [ ] Selection persists during navigation
- [ ] Loading state shown during calculation
- [ ] Error state shown if calculation fails
- [ ] Total updates when shipping selected

**Payment Method Selection:**
- [ ] All payment methods displayed
- [ ] Icons/badges shown correctly
- [ ] Can select any payment method
- [ ] Selection highlighted visually
- [ ] Payment-specific details shown (VA number, bank)
- [ ] Midtrans Snap popup opens on "Place Order"
- [ ] Popup handles success, cancel, failure
- [ ] Fallback to new tab if popup blocked

**Voucher Application:**
- [ ] Can enter voucher code
- [ ] Code converted to uppercase
- [ ] "Apply" button triggers validation
- [ ] Success message shown for valid voucher
- [ ] Error message shown for invalid/expired voucher
- [ ] Discount applied to order total
- [ ] Can remove applied voucher
- [ ] Can re-enter different voucher

**Order Review:**
- [ ] All items displayed with correct prices
- [ ] Subtotal calculated correctly
- [ ] Shipping cost displayed
- [ ] Discount shown when applied
- [ ] Tax calculated (11% PPN)
- [ ] Total is sum of all components
- [ ] Shipping address review shown
- [ ] Payment method review shown
- [ ] Terms & conditions checkbox required
- [ ] "Place Order" button disabled until all requirements met

**Order Creation:**
- [ ] Order placed successfully with valid data
- [ ] Loading state shown during submission
- [ ] Redirect to success page on success
- [ ] Redirect to failed page on payment failure
- [ ] Cart cleared after successful order
- [ ] Order confirmation email sent (verify in inbox)
- [ ] Error message shown on stock validation failure

---

#### Order Management Testing (10 Scenarios)

**Order History Page:**
- [ ] All user orders displayed
- [ ] Orders sorted by date (newest first)
- [ ] Status badges color-coded correctly
- [ ] Order totals displayed correctly
- [ ] Filter by status works (all, pending, shipped, etc.)
- [ ] Search by order number works
- [ ] Pagination works (or infinite scroll)
- [ ] Empty state shown when no orders
- [ ] Loading state shown during fetch

**Order Detail Page:**
- [ ] Order details displayed correctly
- [ ] Status timeline shows correct steps
- [ ] Current step highlighted
- [ ] Future steps grayed out
- [ ] Shipping address shown
- [ ] Payment information shown
- [ ] Order items displayed with thumbnails
- [ ] Order summary totals match original
- [ ] "Cancel Order" button visible for pending orders
- [ ] "Track Order" button visible for shipped orders
- [ ] "Download Invoice" button visible for completed orders

**Order Cancellation:**
- [ ] Can cancel pending payment order
- [ ] Confirmation dialog appears before cancel
- [ ] Cancellation reason input shown
- [ ] Order status updated to "Cancelled"
- [ ] Cancellation reason saved
- [ ] Cannot cancel processing/shipped orders
- [ ] Cancel button hidden for completed orders
- [ ] Error message if cancellation fails

---

#### Payment Testing (10 Scenarios)

**Midtrans Snap Integration:**
- [ ] Snap popup opens on "Place Order"
- [ ] Popup shows correct order amount
- [ ] Popup shows correct payment method
- [ ] Success payment redirects to success page
- [ ] Failed payment redirects to failed page
- [ ] Cancelled payment stays on checkout page
- [ ] Expired payment redirects to failed page

**Payment Status Polling:**
- [ ] Polling starts after payment initiation
- [ ] Polls every 3 seconds
- [ ] Stops on success status
- [ ] Stops on failed status
- [ ] Stops after 5 minutes timeout
- [ ] Loading spinner shown during polling
- [ ] Success redirect happens automatically
- [ ] No infinite loops or memory leaks

**Payment Methods:**
- [ ] VA payment shows correct account number
- [ ] E-wallet payment redirects correctly
- [ ] QRIS code displays correctly
- [ ] Credit card form works
- [ ] COD option available
- [ ] All payment method icons display

---

#### Responsive Testing (15 Scenarios)

**Mobile (375px - 428px):**
- [ ] Checkout flow fits within viewport
- [ ] No horizontal scrolling
- [ ] Touch targets minimum 44px
- [ ] Sticky footer (order summary + CTA) works
- [ ] Dropdowns (province/city) usable
- [ ] Keyboard opens without overlay issues
- [ ] Payment method grid collapses to 1 column
- [ ] Address grid collapses to 1 column
- [ ] Back button accessible
- [ ] Loading states visible

**Tablet (768px - 1023px):**
- [ ] Two-column layout works
- [ ] Order summary sticky on right
- [ ] Navigation buttons accessible
- [ ] Forms usable on touch
- [ ] Images load correctly

**Desktop (1024px+):**
- [ ] Full layout displays correctly
- [ ] Hover states work
- [ ] Tooltips (if any) display
- [ ] No broken layouts
- [ ] Large touch targets (48px+)

---

#### Accessibility Testing (WCAG 2.1 AA)

**Keyboard Navigation:**
- [ ] Can navigate entire flow with Tab key
- [ ] Focus order is logical
- [ ] Enter/Space triggers buttons
- [ ] Escape closes modals/dialogs
- [ ] Skip to content link available

**Screen Reader:**
- [ ] All interactive elements have ARIA labels
- [ ] Error messages announced (aria-live)
- [ ] Status changes announced
- [ ] Form errors announced
- [ ] Success toasts announced
- [ ] Image alt text present
- [ ] Headings in correct hierarchy

**Visual Accessibility:**
- [ ] Color contrast minimum 4.5:1
- [ ] No color-only information
- [ ] Focus indicators clearly visible
- [ ] Text resizable (200% zoom)
- [ ] No flashing content

**Assistive Technology:**
- [ ] Screen reader announces current step
- [ ] Screen reader announces order total
- [ ] Screen reader announces errors
- [ ] Voice control commands work

---

### Performance Testing

**Page Load Performance:**
- [ ] Checkout page loads < 2s (3G)
- [ ] Order history page loads < 2s (3G)
- [ ] Order detail page loads < 2s (3G)
- [ ] First contentful paint < 1s
- [ ] Time to interactive < 3s

**Interaction Performance:**
- [ ] Address form submit < 500ms
- [ ] Shipping cost calculation < 1s
- [ ] Voucher validation < 500ms
- [ ] Payment initiation < 1s
- [ ] Order placement < 2s
- [ ] Page transitions < 300ms

**Bundle Size:**
- [ ] Checkout bundle < 200KB (gzipped)
- [ ] No unnecessary dependencies
- [ ] Tree-shaking enabled
- [ ] Code splitting by route

---

### Browser Compatibility Testing

**Test on:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Android (latest)

**Verify:**
- [ ] All features work correctly
- [ ] No console errors
- [ ] Styling consistent
- [ ] Midtrans Snap works
- [ ] LocalStorage works

---

### Error Handling & Edge Cases

**Edge Cases to Test:**
- [ ] Cart empty on checkout entry
- [ ] Single item in cart
- [ ] Large quantity (100+) items
- [ ] Expired session during checkout
- [ ] Network error during address save
- [ ] Network error during payment
- [ ] Payment timeout
- [ ] Browser tab close during payment
- [ ] Refresh during checkout
- [ ] Back navigation during checkout
- [ ] Multiple tabs open with same cart
- [ ] Voucher code with special characters
- [ ] Province/city API failure
- [ ] RajaOngkir rate limit
- [ ] Midtrans service unavailable

**Error Recovery:**
- [ ] Retry mechanism works
- [ ] Clear error messages on retry
- [ ] User can correct input and retry
- [ ] No data loss on refresh
- [ ] Graceful degradation

---

## Implementation Plan

### Project Structure

**New Feature Module:** `src/features/checkout/`

```
src/features/checkout/
├── components/                  # Checkout components
│   ├── checkout-wizard.tsx
│   ├── checkout-wizard.test.tsx           # MANDATORY
│   ├── address-selection-step.tsx
│   ├── address-selection-step.test.tsx       # MANDATORY
│   ├── shipping-method-step.tsx
│   ├── shipping-method-step.test.tsx         # MANDATORY
│   ├── payment-method-step.tsx
│   ├── payment-method-step.test.tsx          # MANDATORY
│   ├── order-review-step.tsx
│   ├── order-review-step.test.tsx            # MANDATORY
│   ├── address-card.tsx
│   ├── address-card.test.tsx                # MANDATORY
│   ├── shipping-method-card.tsx
│   ├── shipping-method-card.test.tsx          # MANDATORY
│   ├── payment-method-selector.tsx
│   ├── payment-method-selector.test.tsx       # MANDATORY
│   ├── payment-method-grid.tsx
│   ├── payment-method-grid.test.tsx           # MANDATORY
│   ├── voucher-input.tsx
│   ├── voucher-input.test.tsx               # MANDATORY
│   └── order-summary.tsx
│   └── order-summary.test.tsx               # MANDATORY
├── hooks/                      # Checkout hooks
│   ├── use-checkout-cart.ts
│   ├── use-checkout-cart.test.ts            # MANDATORY
│   ├── use-payment-polling.ts
│   ├── use-payment-polling.test.ts          # MANDATORY
│   └── use-address-form.ts
│   └── use-address-form.test.ts             # MANDATORY
├── api/                        # API endpoints
│   ├── checkout-queries.ts
│   ├── checkout-mutations.ts
│   └── endpoints.ts
├── types.ts                    # TypeScript interfaces
└── index.ts                    # Public API exports
```

**New Feature Module:** `src/features/orders/`

```
src/features/orders/
├── components/
│   ├── order-history-page.tsx
│   ├── order-history-page.test.tsx           # MANDATORY
│   ├── order-card.tsx
│   ├── order-card.test.tsx                   # MANDATORY
│   ├── order-detail-page.tsx
│   ├── order-detail-page.test.tsx             # MANDATORY
│   ├── order-status-timeline.tsx
│   ├── order-status-timeline.test.tsx          # MANDATORY
│   ├── order-summary.tsx
│   ├── order-summary.test.tsx                # MANDATORY
│   ├── order-success-page.tsx
│   ├── order-success-page.test.tsx             # MANDATORY
│   └── order-failed-page.tsx
│   └── order-failed-page.test.tsx               # MANDATORY
├── hooks/
│   ├── use-orders.ts
│   └── use-orders.test.ts                   # MANDATORY
├── api/
│   ├── order-queries.ts
│   ├── order-mutations.ts
│   └── endpoints.ts
├── types.ts
└── index.ts
```

**Update Existing Module:** `src/features/cart/`

```
src/features/cart/
├── hooks/
│   └── use-checkout-cart.ts              # NEW - Cart validation for checkout
└── types.ts                             # UPDATE - Add validation types
```

**New Routes:**

```
src/routes/
├── checkout.tsx              # NEW - Multi-step checkout
├── addresses.tsx             # NEW - Address management
├── orders.tsx               # NEW - Order history
├── orders.$id.tsx           # NEW - Order detail
├── orders.success.$id.tsx    # NEW - Order success page
└── orders.failed.$id.tsx     # NEW - Order failed page
```

---

### Implementation Schedule (10 Days)

**Day 1: Setup & Types**
- [ ] Create `src/features/checkout/` folder structure
- [ ] Create `src/features/orders/` folder structure
- [ ] Define TypeScript types
- [ ] Define API endpoint types
- [ ] Create index.ts barrel exports

**Day 2: Checkout Components - Step 1 (Address)**
- [ ] Implement address selection step
- [ ] Implement address card component
- [ ] Implement address form hook
- [ ] Integrate `/api/addresses` API
- [ ] Implement address list, add, edit, delete
- [ ] Implement validation (phone, postal code)
- [ ] Write unit tests for all components

**Day 3: Checkout Components - Step 2 (Shipping)**
- [ ] Implement shipping method step
- [ ] Implement shipping method card
- [ ] Integrate `/api/shipping/cost` API
- [ ] Implement shipping cost calculation
- [ ] Implement shipping options display
- [ ] Add loading states and error handling
- [ ] Write unit tests for all components

**Day 4: Checkout Components - Step 3 (Payment)**
- [ ] Implement payment method step
- [ ] Implement payment method selector
- [ ] Implement payment method grid
- [ ] Implement voucher input
- [ ] Integrate `/api/vouchers/validate` API
- [ ] Implement voucher validation and display
- [ ] Add payment method icons/logos
- [ ] Write unit tests for all components

**Day 5: Checkout Components - Step 4 (Review)**
- [ ] Implement order review step
- [ ] Implement order summary
- [ ] Integrate cart items display
- [ ] Implement order totals calculation
- [ ] Implement shipping/payment review
- [ ] Implement terms & conditions checkbox
- [ ] Implement "Place Order" button
- [ ] Add validation before submission
- [ ] Write unit tests for all components

**Day 6: Checkout Wizard Integration**
- [ ] Implement checkout wizard
- [ ] Implement step navigation
- [ ] Implement progress indicator
- [ ] Implement data persistence (localStorage)
- [ ] Integrate all 4 steps
- [ ] Implement form validation between steps
- [ ] Implement checkout route
- [ ] Implement cart/stock validation
- [ ] Integrate order creation API
- [ ] Integrate Midtrans Snap popup
- [ ] Write unit tests + integration test

**Day 7: Order Management Components**
- [ ] Implement order history page
- [ ] Implement order card
- [ ] Implement order detail page
- [ ] Implement order status timeline
- [ ] Integrate `/api/orders` API
- [ ] Implement filters, pagination
- [ ] Implement cancel order functionality
- [ ] Write unit tests for all components

**Day 8: Order Success & Failed Pages**
- [ ] Implement order success page
- [ ] Implement order failed page
- [ ] Implement success/failed headers
- [ ] Implement order details display
- [ ] Implement CTA buttons
- [ ] Implement retry functionality
- [ ] Write unit tests + integration tests

**Day 9: Address Management Page**
- [ ] Implement address management route
- [ ] Implement address list grid
- [ ] Implement add/edit functionality
- [ ] Reuse address card component
- [ ] Implement empty state
- [ ] Implement mobile responsive layout
- [ ] Write unit tests + integration tests

**Day 10: Testing & Polish**
- [ ] Run all unit tests (80%+ coverage)
- [ ] Fix failing tests
- [ ] Run integration tests (5 E2E flows)
- [ ] Fix failing integration tests
- [ ] Manual testing: Complete all checklists (65+ scenarios)
- [ ] Performance optimization
- [ ] Bug fixes & edge case handling
- [ ] Final code review

---

### Dependencies to Install

**Midtrans Snap SDK:**
```bash
bun add midtrans-node-client
```

**Testing Libraries (if not already installed):**
```bash
bun add -D @testing-library/react @testing-library/jest-dom
bun add -D @playwright/test
```

**Additional Utilities:**
```bash
bun add date-fns  # Date formatting
bun add clsx      # Conditional class names
bun add tailwind-merge  # Tailwind merge utilities
```

---

### API Endpoints to Integrate

**Address APIs:**
- `GET /api/addresses` - List all addresses
- `POST /api/addresses` - Create new address
- `GET /api/addresses/:id` - Get address details
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/default` - Set as default

**Shipping APIs:**
- `GET /api/shipping/provinces` - List all provinces
- `GET /api/shipping/cities?province_id=XXX` - List cities by province
- `POST /api/shipping/cost` - Calculate shipping costs

**Order APIs:**
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order

**Payment APIs:**
- `POST /api/payments/:order_id` - Initialize payment
- `GET /api/payments/:id/status` - Check payment status
- `POST /api/payments/webhook` - Midtrans webhook (backend only)

**Voucher APIs:**
- `POST /api/vouchers/validate` - Validate voucher code

---

### Environment Variables Required

```bash
# Midtrans Configuration
VITE_MIDTRANS_CLIENT_KEY=your_client_key
VITE_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/v1

# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
```

---

### File Creation Checklist

**Checkout Feature (20 files):**
- [ ] `src/features/checkout/components/checkout-wizard.tsx`
- [ ] `src/features/checkout/components/checkout-wizard.test.tsx`
- [ ] `src/features/checkout/components/address-selection-step.tsx`
- [ ] `src/features/checkout/components/address-selection-step.test.tsx`
- [ ] `src/features/checkout/components/shipping-method-step.tsx`
- [ ] `src/features/checkout/components/shipping-method-step.test.tsx`
- [ ] `src/features/checkout/components/payment-method-step.tsx`
- [ ] `src/features/checkout/components/payment-method-step.test.tsx`
- [ ] `src/features/checkout/components/order-review-step.tsx`
- [ ] `src/features/checkout/components/order-review-step.test.tsx`
- [ ] `src/features/checkout/components/address-card.tsx`
- [ ] `src/features/checkout/components/address-card.test.tsx`
- [ ] `src/features/checkout/components/shipping-method-card.tsx`
- [ ] `src/features/checkout/components/shipping-method-card.test.tsx`
- [ ] `src/features/checkout/components/payment-method-selector.tsx`
- [ ] `src/features/checkout/components/payment-method-selector.test.tsx`
- [ ] `src/features/checkout/components/voucher-input.tsx`
- [ ] `src/features/checkout/components/voucher-input.test.tsx`
- [ ] `src/features/checkout/components/order-summary.tsx`
- [ ] `src/features/checkout/components/order-summary.test.tsx`

**Checkout Hooks (6 files):**
- [ ] `src/features/checkout/hooks/use-checkout-cart.ts`
- [ ] `src/features/checkout/hooks/use-checkout-cart.test.ts`
- [ ] `src/features/checkout/hooks/use-payment-polling.ts`
- [ ] `src/features/checkout/hooks/use-payment-polling.test.ts`
- [ ] `src/features/checkout/hooks/use-address-form.ts`
- [ ] `src/features/checkout/hooks/use-address-form.test.ts`

**Checkout API (3 files):**
- [ ] `src/features/checkout/api/checkout-queries.ts`
- [ ] `src/features/checkout/api/checkout-mutations.ts`
- [ ] `src/features/checkout/api/endpoints.ts`

**Orders Feature (14 files):**
- [ ] `src/features/orders/components/order-history-page.tsx`
- [ ] `src/features/orders/components/order-history-page.test.tsx`
- [ ] `src/features/orders/components/order-card.tsx`
- [ ] `src/features/orders/components/order-card.test.tsx`
- [ ] `src/features/orders/components/order-detail-page.tsx`
- [ ] `src/features/orders/components/order-detail-page.test.tsx`
- [ ] `src/features/orders/components/order-status-timeline.tsx`
- [ ] `src/features/orders/components/order-status-timeline.test.tsx`
- [ ] `src/features/orders/components/order-success-page.tsx`
- [ ] `src/features/orders/components/order-success-page.test.tsx`
- [ ] `src/features/orders/components/order-failed-page.tsx`
- [ ] `src/features/orders/components/order-failed-page.test.tsx`
- [ ] `src/features/orders/hooks/use-orders.ts`
- [ ] `src/features/orders/hooks/use-orders.test.ts`

**Orders API (3 files):**
- [ ] `src/features/orders/api/order-queries.ts`
- [ ] `src/features/orders/api/order-mutations.ts`
- [ ] `src/features/orders/api/endpoints.ts`

**Routes (6 files):**
- [ ] `src/routes/checkout.tsx`
- [ ] `src/routes/addresses.tsx`
- [ ] `src/routes/orders.tsx`
- [ ] `src/routes/orders.$id.tsx`
- [ ] `src/routes/orders.success.$id.tsx`
- [ ] `src/routes/orders.failed.$id.tsx`

**Feature Exports (2 files):**
- [ ] `src/features/checkout/index.ts`
- [ ] `src/features/orders/index.ts`

**Total: 54 new files**

---

### Success Criteria

**Phase 3 Complete When:**
- ✅ Multi-step checkout flow functional
- ✅ Address management (CRUD) working
- ✅ Shipping cost calculation with RajaOngkir
- ✅ Payment method selection with 10 methods
- ✅ Voucher code application working
- ✅ Midtrans Snap integration working
- ✅ Order creation from cart working
- ✅ Payment status polling functional
- ✅ Order success page displays correctly
- ✅ Order failed page with retry working
- ✅ Order history page with filters
- ✅ Order detail page with timeline
- ✅ Order cancellation functional
- ✅ All unit tests passing (80%+ coverage)
- ✅ All integration tests passing (5 E2E flows)
- ✅ Mobile-first design implemented
- ✅ Responsive on tablet and desktop
- ✅ Accessibility (WCAG 2.1 AA) compliant
- ✅ Performance targets met (< 2s load time)
- ✅ Browser compatibility verified
- ✅ Manual testing checklist complete (65+ scenarios)

---

### Next Steps

**After Phase 3:**
1. Frontend deployment to staging
2. Backend integration testing with real APIs
3. User acceptance testing (UAT) with stakeholders
4. Move to Phase 4: Order Tracking & Reviews
5. Consider post-MVP enhancements:
   - Order status tracking with courier API
   - Email notification preferences
   - Order reprint/invoice PDF
   - Bulk order actions
   - Advanced order search/filters

---

## Definition of Done

**Code Quality:**
- [ ] All files follow project code style
- [ ] All components have mandatory tests
- [ ] Test coverage ≥ 80%
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Linting passes

**Functionality:**
- [ ] All features from MVP design implemented
- [ ] All API endpoints integrated
- [ ] All user flows tested (happy path + edge cases)
- [ ] Error handling complete

**UX/UI:**
- [ ] Mobile-first design verified
- [ ] Responsive on all breakpoints
- [ ] Accessibility (WCAG 2.1 AA) verified
- [ ] Loading states implemented everywhere
- [ ] Empty states implemented everywhere
- [ ] Error states implemented everywhere

**Documentation:**
- [ ] Code comments for complex logic
- [ ] Component usage documented (if needed)
- [ ] API integration documented
- [ ] Testing approach documented

---

**Document Status:** ✅ Complete
**Approved By:** [Pending]
**Implementation Start:** [TBD]
**Target Completion:** Week 5-6 (10 days)
