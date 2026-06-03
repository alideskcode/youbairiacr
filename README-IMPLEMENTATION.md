# Implementation Guide for Platform Updates

This file documents the exact steps and targeted files needed to implement the requested changes in your project.

## 1. Authenticated User Flow & Logged-In Layout

### Goal
When a user logs in or signs up, the platform must show a consistent authenticated layout with:
- existing header
- authenticated main content area
- creator CTA for campaign creation
- list/grid of all created campaigns
- existing footer

### Files to update
- `app/products/page.tsx`
- `app/layout.tsx` (verify container layout)
- `components/navbar.tsx` (header already exists)
- `components/footer.tsx` (footer already exists)

### Implementation Steps
1. Keep `Navbar` and `Footer` inside `app/layout.tsx` as the global layout.
2. Update `app/products/page.tsx` to act as the authenticated home dashboard after login.
3. Add a hero section in `app/products/page.tsx` that clearly states the authenticated home view and includes a "Make Your Campaigns" CTA.
4. Keep the existing campaign grid/list display as the main content section.
5. Use `AuthGuard` on `app/products/page.tsx` to protect the dashboard and redirect unauthenticated users.
6. Use the existing component structure and Tailwind classes for continuity.

---

## 2. Product Card & Registration Integration

### Goal
Create a dynamic `Product Card` component and ensure it works with product registration flow.

### Files to update
- `app/components/product-card.tsx`
- `app/sell/product/page.tsx`
- `app/products/page.tsx`
- `app/products/category/[id]/page.tsx` (if needed)
- `app/shop/[shopUrl]/page.tsx`
- `app/api/products/route.ts`

### Implementation Steps
1. Update `app/components/product-card.tsx`:
   - Accept props for `id`, `title`, `price`, `image`, `category`, `seller`, and optionally `currency`.
   - Remove hard-coded currency symbol and use a shared formatter.
   - Keep dynamic routing for `Link`.
2. Verify `app/sell/product/page.tsx` product registration flow:
   - form fields must map to `title`, `description`, `category`, `price`, `thumbnail`.
   - create `FormData` with `sellerId`, file uploads, and thumbnail.
   - route response on success should redirect to seller/shop or products listing.
3. Confirm persistence in `app/api/products/route.ts` and placeholder image assignment.
4. Validate `app/products/page.tsx` passes correct data to `ProductCard` and uses calculated price.

---

## 3. Currency Conflict Resolution

### Goal
Resolve inconsistent currency display between INR and USD across the app. Use one unified currency display strategy.

### Files to inspect and update
- `app/components/product-card.tsx`
- `app/sell/product/page.tsx`
- `app/shop/[shopUrl]/page.tsx`
- `app/cart/page.tsx`
- `app/checkout/page.tsx`
- `components/upi-payment.tsx`
- `components/upi-qr-code.tsx`
- `app/admin/payment-settings/page.tsx`
- `lib/payment-config.ts`
- `app/components/product-list.tsx`
- `app/products/[id]/page.tsx`

### Implementation Steps
1. Establish a shared currency helper in `lib/currency.ts`:
   - define `DEFAULT_CURRENCY = 'INR'`
   - function `formatCurrency(amount: number, currency?: string): string`
   - normalize on both `INR` and `USD` if needed, but prefer `INR` by default.
2. Update display components to use `formatCurrency(...)` instead of hard-coded `₹` or `$`.
3. Ensure the product form label matches the accepted display currency.
4. Fix any components where both symbols appear or overlap.
5. Preserve UPI integration as INR-only but keep currency formatting consistent in product listings.

---

## 4. `/create-shop` Redesign + AI Prompt Placeholder

### Goal
Redesign the `/create-shop` page with a modern layout and include a placeholder "tell AI" prompt component.

### Files to update
- `app/create-shop/page.tsx`
- `app/components/seller-form.tsx`
- optionally add `app/components/ai-prompt-card.tsx`

### Implementation Steps
1. Update `app/create-shop/page.tsx` with a refreshed hero section.
2. Add a new section for the AI prompt, labeled like "Tell AI what kind of shop you want".
3. Keep the seller form visible and the page easy to scan.
4. The AI component may be a text area plus a CTA button, with a note such as "AI shop generator coming soon".
5. Make this placeholder visually prominent but non-blocking.

---

## 5. `Create-Shop` Form & Main Details

### Goal
Make sure shop creation collects all required details and shows photo upload/preview.

### Files to update
- `app/components/seller-form.tsx`
- `app/create-shop/page.tsx`
- `app/api/seller/route.ts`

### Required fields
- Shop Name
- Description
- Photo / thumbnail upload
- Category
- Contact Email
- Website (optional but recommended)
- Social links (Twitter, Facebook, Instagram)
- Shop URL preview

### Implementation Steps
1. Add photo upload input with preview.
2. Ensure form uses `supabase.auth.getUser()` to get the current user ID.
3. Submit to `POST /api/seller` with a structured payload.
4. Validate required fields and show toast or inline messages.
5. Keep the data model aligned with Prisma `Seller` fields.
6. On success, redirect to `/seller` or `/products`.

---

## 6. Seller Panel Scaffold

### Goal
Create a scalable seller panel route where sellers can expand into shop management later.

### Files to create/update
- `app/seller/page.tsx`
- `app/seller/layout.tsx` (optional advanced layout)
- `app/components/auth-guard.tsx` (already exists)

### Implementation Steps
1. Create `app/seller/page.tsx` as an authenticated seller dashboard.
2. Scaffold a layout with cards or tiles for:
   - My Shop
   - Products
   - Campaigns
   - Analytics
3. Add links to `/create-shop`, `/sell/product`, `/products`, and `/shop/[shopUrl]`.
4. Use the existing `Navbar` and `Footer`.
5. Make the panel easily extendable with subsections and placeholder cards.

---

## Project-Specific Notes

### Existing Design System
- The app uses Tailwind CSS and ShadCN UI components.
- Keep styling consistent with existing `Card`, `Button`, `Input`, `Label`, `Textarea`, `Select`, `Tabs`, and `Badge` components.

### Existing Auth Flow
- User session is managed through Supabase auth client.
- Protect pages using `AuthGuard` and `supabase.auth.getSession()`.

### Existing Data Model
- Seller/shop registration is backed by `prisma/schema.prisma`.
- Product registration uses `app/api/products/route.ts` and stores products in the `products` table.
- Seller metadata is stored in `sellers` table with fields matching the seller form.

### Recommended Redirects
- After successful login/signup → `/products`
- After successful shop creation → `/seller`
- After successful product registration → `/shop/[shopUrl]`

---

## Recommended File Change Sequence

1. Add shared currency helper: `lib/currency.ts`
2. Update `app/components/product-card.tsx`
3. Update product registration page: `app/sell/product/page.tsx`
4. Update `app/products/page.tsx` to be the authenticated home dashboard
5. Update shop page `app/shop/[shopUrl]/page.tsx` for unified currency and product cards
6. Update `app/create-shop/page.tsx` and `app/components/seller-form.tsx`
7. Create seller panel scaffold: `app/seller/page.tsx`
8. Validate auth flow and redirects across login/signup routes

---

## Optional Enhancements

- Add a reusable `CurrencyTag` component for consistent price labels.
- Add `app/components/ai-prompt-card.tsx` for future AI integration.
- Add `app/seller/layout.tsx` to isolate seller panel layout from the rest of the app.
- Add `app/components/shop-card.tsx` if the shop dashboard needs multiple cards.

---

## Summary
This guide is built specifically for your existing Next.js / Tailwind / Prisma project. Follow the file list and step sequence above, keeping your current layout and style conventions.

If you want, I can now apply these updates directly to the project files in the order listed above.