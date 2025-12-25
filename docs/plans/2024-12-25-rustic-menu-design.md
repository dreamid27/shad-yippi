# Rustic Farm-to-Table Menu Page Design

## Overview
A comprehensive design for the `/menus` page featuring a rustic, natural aesthetic with rich menu information and responsive design. This document captures the complete vision for a single-restaurant menu experience.

## Visual Design Philosophy

### Aesthetic Direction
- **Style:** Rustic & Natural with farm-to-table ethos
- **Color Palette:** Earth tones - terracotta (#E2725B), sage green (#8A9A5B), oatmeal (#D6C9B1), deep browns (#4A3428), creamy off-whites (#F5F2E8)
- **Typography:**
  - Headings: Elegant serif (Playfair Display or similar)
  - Body: Clean sans-serif (Inter or similar)
- **Textures:** Subtle wood grain backgrounds, paper-like card textures, natural borders
- **Photography:** Warm, natural lighting showing dishes in authentic farm-to-table settings

### Design Approach
Moving away from the current fashion site's brutalist aesthetic to create a warm, organic experience that feels like holding a beautifully crafted menu at a high-end farm-to-table restaurant.

## Information Architecture

### Category Structure
Traditional sections with custom names matching farm-to-table ethos:
- **From the Garden** (Appetizers & Salads)
- **Fields & Pastures** (Main Courses - meats)
- **Ocean's Bounty** (Seafood mains)
- **Harvest Specials** (Seasonal dishes)
- **Sweet Endings** (Desserts)
- **Artisan Beverages** (Drinks, wines, craft cocktails)

### Page Layout Structure
- **Hero Section:** Beautiful restaurant shot with "Our Story" teaser and current seasonal highlights
- **Category Navigation:** Sticky horizontal scroll with rustic category tabs
- **Menu Cards Grid:** 2-column layout with rich, detailed cards
- **Dietary Filter Bar:** Visual icons for gluten-free, vegan, halal, etc.
- **Footer:** Restaurant info, hours, reservation CTA

## Menu Item Information Architecture

### Core Information per Dish
- Name
- Price
- Description
- Photo (high-quality, multiple angles)
- Spice level indicator
- Allergen warnings
- Halal/Haram certification

### Social Proof & Special Indicators
- "Most Popular" badge
- "Chef's Special" indicator
- "Customer Choice" award
- Pairing suggestions (wine/drinks)
- Customer reviews/ratings

## Responsive Strategy

### Mobile (< 768px)
- Single column layout for menu cards
- Collapsible category navigation (accordion)
- Simplified cards: photo top, essential info below
- Swipeable gallery for pairings and customer photos
- "Tap to expand" for full descriptions

### Tablet (768px - 1024px)
- Two-column layout with more spacing
- Touch-optimized filters with larger tap targets
- Split view option: categories left, items right (landscape)

### Desktop (> 1024px)
- Full rich experience with all details visible
- Hover interactions revealing additional details
- Side panel for detailed dish information
- Print-friendly version available

## Technical Implementation

### Core Features (Phase 1)
- Smart Search: Live search across names, descriptions, ingredients
- Dietary Filters: Visual toggles for vegan, gluten-free, halal, spice level
- Visual Indicators: Icons for popularity and special dishes
- Allergen Warnings: Clear indicators with expandable details
- Pairing Suggestions: Wine/drink recommendations per dish
- Photo Gallery: Multiple angles + customer photos

### Technical Stack Integration
- TanStack Query for caching and performance
- Intersection Observer for lazy-loading images
- Local storage for favorites and dietary preferences
- SEO optimization with structured data

### API Structure Requirements
```
GET /menu-items
- id, name, price, description
- category, subcategory
- photos (array of URLs)
- dietary (vegan, gluten-free, halal, etc.)
- allergens (array)
- spice_level (mild/medium/hot)
- badges (popular, chef_special, customer_choice)
- pairings (drinks, wines)
- reviews (rating, count)
- seasonal_availability
```

## Implementation Phases

### Phase 1 - Foundation
- Beautiful browsing experience with categories
- Rich menu cards with all requested information
- Basic search and dietary filtering
- Responsive design implementation

### Phase 2 - Interactivity
- Favorites/bookmarks system
- Wine/drink pairing suggestions
- Customer reviews integration

### Phase 3 - Commerce Integration
- Add to cart functionality for takeout
- Simple reservation integration

## Design System Components

### Menu Card Structure
```
┌─────────────────────────────────┐
│ [PHOTO]           [BADGE]       │
│                               │
│ Dish Name                       │
│ $XX.XX                         │
│ Description text...             │
│                               │
│ [Icons] [Icons] [Icons]        │
│                               │
│ Pairing suggestions ▸         │
│ Customer reviews ★★★★☆        │
└─────────────────────────────────┘
```

### Icon Set
- Dietary: Leaf (vegan), GF (gluten-free), Crescent (halal)
- Spice: Chili pepper indicators (1-3)
- Badges: Star (popular), Chef hat (special), Heart (customer choice)
- Actions: Bookmark, Share, Info

## Success Criteria
- Users can easily find dishes that match their dietary preferences
- Visual design reinforces farm-to-table brand identity
- Responsive experience works seamlessly across all devices
- Comprehensive information builds trust and drives reservations
- Performance optimized with smooth interactions

## Future Considerations
- Online ordering integration
- Reservation system integration
- Customer photo submissions
- Seasonal menu rotations
- Multilingual support