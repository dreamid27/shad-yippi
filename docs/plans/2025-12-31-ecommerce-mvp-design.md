# E-Commerce Fashion Web App - MVP Design Document

**Date:** 2025-12-31
**Project:** shad-yippi (Frontend) + go-yippi (Backend)
**Target:** Pasar Lokal Indonesia, Mass Market
**Timeline:** 8 Weeks (Standard MVP)

---

## Executive Summary

Building a full-stack e-commerce fashion application targeting Indonesian mass market. The system integrates:
- **Frontend:** TanStack Start + React + Shadcn UI (shad-yippi)
- **Backend:** Go + Fiber + Huma + Ent + PostgreSQL (go-yippi)
- **Payment:** Midtrans (VA, e-wallet, QRIS, CC, COD)
- **Shipping:** RajaOngkir API integration
- **Storage:** MinIO for product images

**Key Priorities:**
1. Customer Experience & Product Discovery
2. Smooth Transaction & Payment Flow

---

## Current State Analysis

### Frontend (shad-yippi) - What Exists ✅

**Infrastructure:**
- TanStack Start (SSR-capable React framework)
- TanStack Router (file-based routing)
- TanStack Query for data fetching
- Shadcn UI components (20+ components installed)
- Tailwind CSS v4
- Zustand for client state
- Vitest for testing

**Pages Implemented:**
- Homepage with hero, collections, featured products
- Categories page with filters & search UI
- Product detail page
- Cart page with quantity controls
- Dark theme design system (black/white aesthetic)

**Missing:**
- No backend integration (all mock data)
- No authentication
- No real search/filter functionality
- Cart not persisted (client-side only)
- No checkout flow
- Not following feature-based architecture (CLAUDE.md)

### Backend (go-yippi) - What Exists ✅

**Infrastructure:**
- GoFiber + Huma v2 (OpenAPI + auto-validation)
- PostgreSQL + Ent ORM
- Hexagonal Architecture (production-ready)
- MinIO for file storage
- Auto-migration support

**Entities Available:**
- User (basic CRUD)
- Product (SKU, slug, status workflow, dimensions, weight, ImageURLs)
- Category (hierarchical)
- Brand

**APIs Available:**
- Product CRUD + publish/archive
- Category management
- Brand management
- User CRUD
- File upload (MinIO)

**Missing:**
- Authentication & JWT
- Cart system
- Order management
- Payment integration
- Shipping integration
- Reviews & ratings
- Wishlist
- Voucher system
- Email notifications

---

## Target Features (Standard MVP)

### A. Customer Experience & Discovery

1. **Smart Product Search & Filtering**
   - Real-time search with debouncing
   - Multi-select filters (category, brand, price, size, color)
   - Sort options (best seller, newest, price, ratings)
   - Search suggestions & history

2. **Product Discovery**
   - Product reviews & ratings (star ratings, verified purchase badge)
   - Related products
   - Recently viewed
   - Wishlist/favorites
   - Quick view modal

3. **Enhanced Product Pages**
   - Image gallery with zoom
   - Size guide (interactive chart)
   - Real-time stock availability
   - Product variants (color/size)
   - Share product (WhatsApp, Instagram, copy link)

4. **Personalization**
   - New arrivals section
   - Best sellers tracking
   - Flash sales with countdown

### B. Transaction & Payment Flow

5. **User Authentication & Profile**
   - Register/Login (email + password)
   - Optional Google OAuth
   - User profile management
   - Multiple shipping addresses
   - Order history
   - Guest checkout option

6. **Enhanced Cart**
   - Database-backed cart persistence
   - Stock validation before checkout
   - Saved for later
   - Cart abandonment recovery

7. **Checkout Process**
   - Multi-step checkout:
     1. Shipping address
     2. Shipping method (with cost calculator)
     3. Payment method
     4. Order review
   - Address management
   - RajaOngkir integration (JNE, J&T, SiCepat, Anteraja)
   - Voucher/promo code application
   - Clear order summary (subtotal, shipping, discount, tax 11%, total)

8. **Payment Integration (Midtrans)**
   - Multiple payment methods:
     - Virtual Account (BCA, Mandiri, BNI, BRI)
     - E-wallet (GoPay, OVO, Dana, ShopeePay)
     - QRIS
     - Credit/Debit Card
     - COD (Cash on Delivery)
   - Payment status tracking
   - Auto-cancel after 24h
   - Payment webhook handler

9. **Order Management**
   - Order confirmation (email notification)
   - Order tracking: Pending → Processing → Shipped → Delivered → Completed
   - Shipping tracking (resi number)
   - Cancel order (before shipped)
   - PDF invoice generation

### C. Supporting Features

10. **Notifications**
    - Email notifications (order confirmation, shipping updates, payment reminders)
    - In-app notification center

11. **Customer Support**
    - WhatsApp chat button
    - FAQ section
    - Contact form

### D. Admin Features

12. **Admin Dashboard**
    - Product management (CRUD, bulk upload, stock alerts)
    - Order management (update status, print labels, resi input)
    - Customer management (view, order history)
    - Voucher/promo management
    - Reports & analytics (sales, best sellers, revenue)
    - Settings (store info, shipping, tax, payment methods)

---

## Technical Architecture

### Backend Stack (go-yippi)

```
Runtime:       Go 1.23+
Framework:     GoFiber + Huma v2
Database:      PostgreSQL
ORM:           Ent
Architecture:  Hexagonal (Ports & Adapters)
Storage:       MinIO (product images)
Payment:       Midtrans SDK
Shipping:      RajaOngkir API
Email:         SMTP (Gmail/Resend)
Auth:          JWT + bcrypt
```

### Frontend Stack (shad-yippi)

```
Framework:     TanStack Start (SSR)
Router:        TanStack Router
State:         TanStack Query (server) + Zustand (client)
UI:            Shadcn UI + Tailwind CSS v4
Testing:       Vitest
API Client:    Axios/Fetch wrapper
```

### Database Schema (New Entities Needed)

**Authentication:**
- `users` - Enhanced with password_hash, refresh_token, role

**Cart:**
- `carts` - user_id, created_at, updated_at
- `cart_items` - cart_id, product_id, variant_id, quantity, price_snapshot

**Orders:**
- `orders` - user_id, shipping_address_id, courier, shipping_cost, subtotal, tax, discount, total, status
- `order_items` - order_id, product_id, variant_id, quantity, price, subtotal

**Payment:**
- `payments` - order_id, method, amount, status, midtrans_transaction_id, expires_at

**Shipping:**
- `addresses` - user_id, label, full_address, city, province, postal_code, is_default

**Reviews:**
- `reviews` - product_id, user_id, order_id, rating, comment, verified_purchase, created_at

**Wishlist:**
- `wishlists` - user_id, product_id, created_at

**Vouchers:**
- `vouchers` - code, discount_type, amount, min_purchase, max_uses, used_count, expires_at

**Product Enhancements:**
- `product_variants` - product_id, sku, size, color, stock_quantity, price_adjustment
- Enhance `products` table with stock_quantity, low_stock_threshold

### API Endpoints (New)

**Authentication:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

**Cart:**
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`
- `DELETE /api/cart`

**Orders:**
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders/{id}/cancel`
- `GET /api/orders/{id}/invoice`

**Payment:**
- `POST /api/payments`
- `POST /api/payments/webhook`
- `GET /api/payments/{id}/status`

**Shipping:**
- `GET /api/shipping/provinces`
- `GET /api/shipping/cities?province_id=...`
- `POST /api/shipping/cost`

**Addresses:**
- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/{id}`
- `DELETE /api/addresses/{id}`

**Reviews:**
- `POST /api/reviews`
- `GET /api/products/{id}/reviews`
- `PUT /api/reviews/{id}`
- `DELETE /api/reviews/{id}`

**Vouchers:**
- `POST /api/vouchers/validate`
- `GET /api/admin/vouchers`
- `POST /api/admin/vouchers`

**Admin:**
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`
- `POST /api/admin/products/bulk-upload`

### Frontend Architecture Refactoring

Move from route-based to feature-based:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── profile-form.tsx
│   │   ├── api/
│   │   │   └── queries.ts
│   │   ├── store/
│   │   │   └── auth-store.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── products/
│   │   ├── components/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-filters.tsx
│   │   │   └── product-search.tsx
│   │   ├── api/
│   │   │   └── queries.ts
│   │   ├── hooks/
│   │   │   └── use-product-filters.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── reviews/
│   ├── wishlist/
│   └── admin/
├── components/
│   ├── ui/          # Shadcn components
│   ├── layout/      # Header, Footer, Nav
│   └── common/      # Shared components
├── services/
│   └── api/         # API client, interceptors
├── lib/
│   ├── utils/
│   └── constants/
└── routes/          # Thin route files
```

### Deployment Strategy

```
Frontend:    Vercel/Netlify
Backend:     Railway/Render/DigitalOcean
Database:    Railway PostgreSQL
Storage:     MinIO (self-hosted) or Cloudinary
Domain:      Custom domain + SSL
```

---

## Implementation Roadmap (8 Weeks)

### **PHASE 1: Foundation & Authentication (Week 1-2)**

**Backend Tasks:**
- [x] Setup JWT authentication middleware
- [x] Enhance User entity with password_hash, refresh_token, role
- [x] Auth service: Register, Login, Logout, Refresh Token
- [x] Password hashing with bcrypt
- [x] Auth handlers & routes
- [x] Role-based authorization middleware (customer, admin)

**Frontend Tasks:**
- [x] Refactor to feature-based architecture
- [x] Setup API client (axios with interceptors)
- [x] Create auth feature (login, register, profile)
- [x] Auth store (Zustand) with JWT persistence
- [x] Protected routes HOC
- [x] Auth context for user data

**Deliverables:**
- ✅ User registration & login working
- ✅ JWT token stored & auto-refresh
- ✅ Protected routes (redirect to login)

---

### **PHASE 2: Product Catalog & Cart (Week 3-4)**

**Backend Tasks:**
- [x] Create ProductVariant entity & schema (size, color, stock)
- [x] Enhance Product with stock_quantity field
- [x] Product search & filter endpoints (category, brand, price, sort)
- [x] Create Cart entity & schema
- [x] Create CartItem entity & schema
- [x] Cart service: Add, Update, Remove, Clear, GetCart
- [ ] Cart handlers & routes
- [ ] Stock validation logic

**Frontend Tasks:**
- [ ] Integrate product API (replace mock data)
- [ ] Implement real search & filter
- [ ] Pagination support
- [ ] Product variant selector (size, color)
- [ ] Stock availability indicator
- [ ] Image gallery component
- [ ] Refactor cart to database-backed
- [ ] Cart sync on login
- [ ] Guest cart merge logic

**Deliverables:**
- ✅ Product catalog with functional search & filters
- ✅ Cart persisted to database
- ✅ Real-time stock validation
- ✅ Cart sync across devices

---

### **PHASE 3: Checkout & Payment (Week 5-6)**

**Backend Tasks:**
- [ ] Create Address entity & schema
- [ ] Address CRUD handlers
- [ ] RajaOngkir API integration (province, city, shipping cost)
- [ ] Create Order entity & schema
- [ ] Create OrderItem entity & schema
- [ ] Order service: CreateOrder, Calculate totals
- [ ] Order status workflow implementation
- [ ] Create Payment entity & schema
- [ ] Midtrans SDK integration
- [ ] Payment webhook handler
- [ ] Payment verification & status updates
- [ ] Auto-cancel expired payments (cron job)

**Frontend Tasks:**
- [ ] Multi-step checkout component
  - Step 1: Shipping address selection/creation
  - Step 2: Shipping method (fetch cost from RajaOngkir)
  - Step 3: Payment method selection
  - Step 4: Order review & confirmation
- [ ] Address management page
- [ ] Midtrans Snap integration (payment popup)
- [ ] Payment status polling
- [ ] Order success page
- [ ] Order failed page (retry payment)

**Deliverables:**
- ✅ Complete checkout flow
- ✅ Multiple payment methods working
- ✅ Real shipping cost calculation
- ✅ Order creation & payment processing

---

### **PHASE 4: Order Tracking & Reviews (Week 7)**

**Backend Tasks:**
- [ ] Create Review entity & schema
- [ ] Review service & handlers
- [ ] Review validation (only after order completed)
- [ ] Product rating aggregation
- [ ] Order list & detail endpoints
- [ ] Order status update endpoint (admin)
- [ ] Email notification service setup
- [ ] Email templates (order confirmation, shipping notification)
- [ ] Send email on order events

**Frontend Tasks:**
- [ ] Order history page (list all orders)
- [ ] Order detail modal/page
- [ ] Order status timeline visualization
- [ ] Shipping tracking display (resi number)
- [ ] Cancel order button (if pending payment)
- [ ] Product review form
- [ ] Display reviews on product page
- [ ] Review sorting & filtering

**Deliverables:**
- ✅ Order history & tracking
- ✅ Email notifications working
- ✅ Product reviews & ratings system
- ✅ Review submission after purchase

---

### **PHASE 5: Admin Panel & Polish (Week 8)**

**Backend Tasks:**
- [ ] Admin middleware (role check)
- [ ] Dashboard stats endpoint (sales, orders summary)
- [ ] Admin order management endpoints
- [ ] Update order status & add resi endpoint
- [ ] Create Voucher entity & schema
- [ ] Voucher service (create, validate, apply)
- [ ] Voucher handlers
- [ ] Apply voucher to order logic

**Frontend Tasks:**
- [ ] Admin dashboard page
  - Sales overview cards
  - Recent orders table
  - Stock alerts
- [ ] Admin product management
  - Product list with filters
  - Add/edit product form
  - Image upload (multiple)
  - Stock management
- [ ] Admin order management
  - Order list with filters
  - Order detail & status update
  - Input resi tracking
  - Print invoice button
- [ ] Voucher management (admin)
  - Create/edit voucher form
  - Voucher usage tracking
- [ ] Apply voucher in checkout (user-facing)
- [ ] Bug fixes & performance optimization
- [ ] Final testing

**Deliverables:**
- ✅ Functional admin dashboard
- ✅ Product & order management for admin
- ✅ Voucher/promo system
- ✅ Production-ready application

---

## Post-MVP Features (Optional)

After Week 8, additional features to consider:
- Wishlist functionality
- Flash sales / time-limited deals
- Best seller tracking
- Recently viewed products
- Product recommendations (collaborative filtering)
- WhatsApp notifications (via Fonnte/WABA)
- Advanced analytics dashboard
- Bulk product import (CSV/Excel)
- Return/refund management system
- Loyalty points program
- Gift cards
- Multi-language support (EN/ID)
- Progressive Web App (PWA)

---

## Risk Assessment & Mitigation

### Technical Risks

**Risk 1: Midtrans Integration Complexity**
- Mitigation: Start with Snap (easiest), test webhook thoroughly in sandbox
- Fallback: Manual bank transfer with proof upload

**Risk 2: Cart Sync Between Guest & Logged-in Users**
- Mitigation: Store guest cart in localStorage first, merge on login
- Fallback: Clear guest cart on login (ask user to re-add)

**Risk 3: RajaOngkir API Rate Limits**
- Mitigation: Cache province/city data, implement request debouncing
- Fallback: Fixed shipping costs by region

**Risk 4: Image Upload & Storage**
- Mitigation: MinIO already setup in go-yippi, use presigned URLs
- Fallback: Cloudinary integration (easier but costs money)

### Timeline Risks

**Risk 1: Scope Creep**
- Mitigation: Strictly follow MVP features, defer optional items
- Action: Weekly sprint reviews to stay on track

**Risk 2: Backend/Frontend Integration Issues**
- Mitigation: Define API contracts early (OpenAPI spec)
- Action: Use Huma's auto-generated docs for frontend dev

**Risk 3: Authentication Edge Cases**
- Mitigation: Test thoroughly: token refresh, logout, session expiry
- Action: Implement comprehensive auth tests

---

## Success Metrics (Post-Launch)

**Technical Metrics:**
- API response time < 200ms (p95)
- Page load time < 2s
- Cart abandonment rate < 70%
- Payment success rate > 95%
- Zero critical bugs in first week

**Business Metrics:**
- 100+ registered users in first month
- 50+ completed orders in first month
- Average order value > Rp 200,000
- Customer return rate > 30%

---

## Next Steps

1. **Approve this design document**
2. **Setup project tracking** (GitHub Projects, Jira, or Notion)
3. **Start Phase 1: Week 1-2** (Authentication & Foundation)
4. **Daily standup** to track progress
5. **Weekly demos** to stakeholders

---

**Document Status:** Draft
**Approved By:** [Pending]
**Start Date:** [TBD]
**Target Completion:** [TBD + 8 weeks]
