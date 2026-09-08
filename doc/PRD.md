
# Product Requirements Document — Shopless

**Version:** 1.0 — MVP
**Product Type:** Progressive Web App (PWA)
**Platform:** Mobile-first Web
**Status:** Concept / Pre-development

---

## 1. Product Overview

### Product Name

**Shopless**

### Tagline

> **Shop without spending.**

### One-liner

Shopless is a simulated e-commerce experience designed to help users explore and understand their impulse to shop **without spending real money**.

Users can browse randomized products, add items to cart, checkout using virtual transactions, track a simulated shipment, and reflect on whether they still want the item after a cooling-off period.

---

# 2. Problem Statement

Some users experience an urge to shop despite not having a specific item they actually need.

The pattern can look like:

```text
Receive money
      ↓
"I should buy something"
      ↓
Open e-commerce
      ↓
Browse
      ↓
Find something interesting
      ↓
Add to cart
      ↓
Checkout
      ↓
Temporary satisfaction
```

The problem isn't necessarily a lack of budgeting knowledge.

The user may simply be seeking the **experience of shopping itself**.

Existing budgeting tools generally focus on:

* tracking actual spending
* setting budgets
* restricting spending
* financial goals

Shopless approaches the problem from a different direction:

> **What if the user could experience the shopping process without actually spending money?**

---

# 3. Product Hypothesis

### Hypothesis

If users are given a realistic shopping simulation with no financial consequences, they may be able to:

1. satisfy part of the immediate shopping urge,
2. create distance between impulse and real purchase,
3. observe whether they still want the item later,
4. recognize their personal shopping patterns.

### Core hypothesis

> **The desire to shop and the desire to own something are not always the same thing.**

Shopless exists to help users discover the difference.

---

# 4. Target Users

### Primary

People who:

* frequently browse e-commerce without a specific purchase goal,
* feel compelled to buy something after receiving money,
* spend time browsing shopping platforms despite not needing anything,
* experience impulsive shopping urges,
* want to understand their shopping behavior without using restrictive budgeting tools.

### Secondary

People who simply enjoy:

* browsing products,
* creating carts,
* window shopping,
* discovering random products.

---

# 5. Product Principles

Shopless should follow five principles:

### 1. No shame

The product should never tell users that shopping is morally bad.

### 2. No forced restriction

Users should be allowed to browse and simulate purchases freely.

### 3. Frictionless access

The user should not need an account to start.

### 4. Realistic simulation

The shopping experience should feel sufficiently real to reproduce the browsing/checkout loop.

### 5. Reflection comes after the experience

The app shouldn't interrupt users with constant educational messages.

---

# 6. MVP Scope

The MVP consists of:

### Core

* Landing / entry
* Shopping motivation
* Marketplace
* 5 product categories
* Product listing
* Product detail
* Search
* Cart
* Wishlist
* Simulated checkout
* Simulated order
* Shipment tracking
* Delivery completion
* Post-purchase reflection
* Shopping history
* Basic behavioral statistics

### Technical

* PWA
* Local-first architecture
* IndexedDB
* Static product catalog
* Static product images
* No authentication
* No backend
* No real payments

---

# 7. User Flow

```text
                    ┌──────────────┐
                    │   OPEN APP   │
                    └──────┬───────┘
                           ↓
                ┌─────────────────────┐
                │ Why are you shopping?│
                └──────────┬──────────┘
                           ↓
                   ┌──────────────┐
                   │   MARKETPLACE│
                   └──────┬───────┘
                          ↓
                ┌──────────────────┐
                │ Browse / Search  │
                └────────┬─────────┘
                         ↓
                 ┌──────────────┐
                 │ Product Page │
                 └──────┬───────┘
                        ↓
                   Add to Cart
                        ↓
                  ┌───────────┐
                  │   CART    │
                  └─────┬─────┘
                        ↓
                    CHECKOUT
                        ↓
                 Order Confirmed
                        ↓
                 Shipment Tracking
                        ↓
                     Delivered
                        ↓
                   Reflection
                        ↓
                    Insights
```

---

# 8. Feature Requirements

## 8.1 Shopping Trigger

When opening Shopless, user sees:

> **What brought you here?**

Options:

* I just got some money
* I feel like buying something
* I'm bored
* I saw something I want
* I actually need something
* I don't know

### Requirements

* User can select one option.
* Selection is optional.
* Selection is stored with the shopping session.
* User can skip.

---

# 8.2 Marketplace

The marketplace should visually resemble a modern e-commerce platform.

### Sections

**For You**

**Categories**

**Popular**

**Deals**

**Recently Viewed**

### Product categories

MVP contains exactly five categories:

1. **Tech**
2. **Books & Learning**
3. **Lifestyle**
4. **Fashion**
5. **Hobbies**

Each category should contain approximately **10–20 products**.

### MVP catalog target

**Minimum:** 50 products
**Recommended:** 75–100 products

---

# 8.3 Product

Each product contains:

```text
Product ID
Name
Category
Price
Original Price (optional)
Rating
Review Count
Description
Image
Tags
```

Example:

```json
{
  "id": "tech-001",
  "name": "Mechanical Keyboard",
  "category": "Tech",
  "price": 499000,
  "rating": 4.8,
  "reviewCount": 2381
}
```

---

# 8.4 Product Detail

Product page includes:

* Image
* Name
* Price
* Rating
* Description
* Category
* Add to wishlist
* Add to cart
* Quantity selector

Optional:

> **Why do you want this?**

Options:

* I need it
* I like it
* It looks useful
* It's cheap
* I don't know

This should **not block checkout**.

---

# 8.5 Cart

Cart displays:

* Products
* Quantity
* Individual price
* Subtotal
* Total

Example:

> **Your Cart**
>
> Mechanical Keyboard — Rp499,000
> Desk Lamp — Rp129,000
> Notebook — Rp49,000
>
> **Total: Rp677,000**

Then:

### Simulated spending

**Rp677,000**

### Real spending

**Rp0**

CTA:

> **Checkout**

---

# 8.6 Simulated Checkout

The checkout process should mimic an e-commerce experience without collecting unnecessary personal information.

### Example

**Shipping Address**

> Home

**Payment**

> Shopless Simulation

**Total**

> Rp677,000

CTA:

> **Place Order**

No:

* credit card
* bank account
* real address
* payment information

---

# 8.7 Order Creation

After checkout:

> 🎉 **Order placed**

Generate:

* Order ID
* Order timestamp
* Cart snapshot
* Total simulated spending
* Shipping status

Example:

```text
Order #SL-28391

Total
Rp677,000

Placed
September 8, 19:02
```

---

# 8.8 Simulated Shipping

Order progresses automatically according to elapsed time.

### Default timeline

| Elapsed Time | Status           |
| ------------ | ---------------- |
| 0h           | Order Confirmed  |
| 1h           | Preparing        |
| 2h           | Picked Up        |
| 4h           | Sorting Center   |
| 8h           | In Transit       |
| 12h          | Local Facility   |
| 18h          | Out for Delivery |
| 24h          | Delivered        |

The app calculates status based on:

```text
currentTime - orderCreatedAt
```

rather than requiring a backend cron job.

This means shipping continues progressing even when the PWA is closed.

---

# 8.9 Delivery

At approximately 24 hours:

> 📦 **Your package has arrived.**

Then initiate reflection.

---

# 8.10 Post-Purchase Reflection

Primary question:

> **Do you still want this?**

Options:

* **Yes, I still want it**
* **I'd probably buy it**
* **I don't really care anymore**
* **Why did I buy this?**

Secondary:

> **Would you spend real money on this today?**

* Yes
* No

Reflection is stored locally.

---

# 8.11 Shopping History

User can see previous simulated purchases.

Example:

### Shopping History

**September 8**

Mechanical Keyboard
Rp499,000
**Still wanted after 24h**

---

**September 7**

Desk Organizer
Rp75,000
**Didn't want after 24h**

---

# 8.12 Insights

Basic dashboard:

### Your Shopless Week

**Shopping sessions**

12

**Carts created**

8

**Simulated purchases**

5

**Simulated spending**

Rp1,284,000

**Real spending**

Rp0

### Decision persistence

> **2 / 5 purchases were still wanted after 24h.**

Potential insight:

> **60% of your simulated purchases didn't feel necessary after 24 hours.**

Important:

The app should use neutral language.

Avoid:

> ❌ "You are an impulsive shopper."

Prefer:

> ✅ "Most of your recent shopping urges faded within 24 hours."

---

# 9. Data Architecture

## Product Catalog

Static JSON.

```text
/products/products.json
```

Images:

```text
/public/products/
```

### User State

Stored locally using **IndexedDB**.

Entities:

```text
ShoppingSession
Cart
Wishlist
Order
Reflection
UserPreferences
```

---

# 10. Suggested Data Models

### ShoppingSession

```text
id
startedAt
trigger
```

### Cart

```text
id
items[]
updatedAt
```

### Order

```text
id
createdAt
items[]
total
status
deliveredAt
```

### Reflection

```text
orderId
createdAt
stillWanted
wouldBuyReal
reason
```

---

# 11. Technical Architecture

```text
                 ┌─────────────────┐
                 │     Vercel      │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │ Next.js PWA     │
                 └────────┬────────┘
                          ↓
             ┌────────────┴────────────┐
             ↓                         ↓
      Static Catalog               IndexedDB
             │                         │
      Product Images             User State
      Product JSON               Cart
                                 Orders
                                 Wishlist
                                 History
                                 Reflections
```

### Hosting

**Vercel**

### Backend

**None — MVP**

### Database

**None — MVP**

### Storage

**IndexedDB**

### Authentication

**None**

---

# 12. Performance Requirements

The app should:

* load quickly on mobile networks,
* use optimized WebP/AVIF product images,
* lazy-load product images,
* avoid storing images inside IndexedDB,
* support offline access to previously cached app assets where practical.

### Product image target

Aim for approximately:

**50–300 KB/image**

rather than multi-megabyte originals.

50–100 products should therefore remain very manageable.

---

# 13. PWA Requirements

Shopless should support:

* install to home screen
* standalone display
* responsive mobile UI
* service worker
* application manifest
* offline caching
* persistent local data

Example:

```text
Shopless
├── icon
├── splash
├── theme
└── standalone experience
```

---

# 14. Navigation

Bottom navigation:

```text
🏠 Home
🛍️ Shop
♡ Wishlist
📦 Orders
📊 Insights
```

Keep it minimal.

The primary CTA should always be **Shop**.

---

# 15. UX Tone

The UI should feel like a **real marketplace**, not a financial counseling application.

### Before checkout

Minimal intervention.

### During shopping

No guilt messaging.

### After checkout

Subtle reflection.

### After repeated usage

Behavioral insights.

The product should feel:

**playful + realistic + slightly self-aware**

rather than:

**clinical + preachy + educational.**

---

# 16. Random Product System

To prevent the marketplace from becoming predictable, products can be tagged:

```text
desirable
useful
impulsive
weird
cheap
premium
novelty
```

Recommendation logic can mix them.

Example:

```text
40% relevant
30% popular
20% random
10% weird
```

This is intentionally not optimized purely for conversion.

The goal is **simulation**, not maximizing purchases.

---

# 17. Core Metrics

Since this is a behavioral product, traditional e-commerce metrics aren't enough.

### Primary metric

**24h Purchase Persistence Rate**

```text
Purchases still wanted after 24h
---------------------------------
Total simulated purchases
```

### Secondary metrics

* Shopping sessions/user
* Average browsing duration
* Cart creation rate
* Checkout rate
* Reflection completion rate
* Simulated spending/user
* Percentage of purchases abandoned after reflection
* Repeat usage

---

# 18. Success Criteria for MVP

The MVP is successful if users can:

1. open the app without registering,
2. immediately begin browsing,
3. browse at least 50 products,
4. create a cart,
5. complete a fake checkout,
6. return later and see shipment progress,
7. receive a simulated delivery,
8. reflect on the purchase,
9. see their historical behavior.

The most important qualitative question:

> **“Did Shopless make you feel less compelled to actually open a real marketplace?”**

That's arguably more meaningful than raw session count.

---

# 19. Future Monetization

Not part of MVP.

Potential:

### Affiliate links

Only after a cooling-off period.

Example:

> **Still want it?**
>
> Find this product in real life →
> Shopee / Tokopedia / other marketplace

Clearly disclose affiliate relationships.

### Premium

Potential features:

* long-term analytics
* cross-device sync
* advanced insights
* custom product categories
* exportable reports

---

# 20. Future Backend

Only introduce backend when there is a concrete need.

Potential V2:

```text
PWA
 ↓
Supabase Auth
 ↓
PostgreSQL
 ↓
Cross-device sync
```

Potential backend use cases:

* accounts
* cloud sync
* analytics
* product catalog management
* affiliate tracking
* personalized recommendations

---

# 21. Explicitly Out of Scope — MVP

To keep the first version sane:

❌ Real payments
❌ Real shipping
❌ Real marketplace integrations
❌ User accounts
❌ Social features
❌ Chat
❌ Real-time backend
❌ AI shopping assistant
❌ Push notifications
❌ Real affiliate links
❌ Complex financial tracking
❌ Real bank integration

---

# 22. MVP Development Phases

### Phase 1 — Foundation

* Next.js setup
* PWA setup
* design system
* IndexedDB layer
* product schema

### Phase 2 — Marketplace

* Home
* categories
* product cards
* product detail
* search
* wishlist

### Phase 3 — Shopping

* cart
* checkout
* order creation

### Phase 4 — Simulation

* shipment timeline
* time-based status
* delivery state

### Phase 5 — Reflection

* reflection screen
* history
* basic insights

### Phase 6 — Polish

* animations
* responsive design
* offline behavior
* performance
* empty/error states

---

## The actual product loop

Kalau disederhanakan sampai tinggal tulang-belulangnya:

> **Feel the urge → Shop → Cart → Checkout → Wait → Reflect → Understand yourself**

Dan menurutku itu yang harus kita lindungi selama development.

Kalau suatu fitur nggak memperkuat loop itu, **nggak harus masuk V1**. Karena godaan terbesar project seperti ini justru bukan kekurangan fitur—melainkan tiba-tiba kita bikin Shopee versi KW yang punya 38 halaman settings. 😭
