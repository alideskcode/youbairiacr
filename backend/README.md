# Youbairia External-Link Marketplace Backend

Express backend for shops, digital products, purchases, and secure access to external product links such as Google Drive or Dropbox.

## Setup

1. Run `backend/db/schema.sql` in the Supabase SQL editor.
2. Add these environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BACKEND_PORT=4000
BACKEND_CORS_ORIGIN=http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also accepted for URL/anon key compatibility with the existing Next app.

3. Start the backend:

```bash
npm run backend
```

## Auth

Protected routes require a Supabase access token:

```http
Authorization: Bearer <supabase_access_token>
```

The middleware verifies the token with `supabase.auth.getUser()` and attaches `req.user`.

## Routes

### Shops

`POST /create-shop`

```json
{
  "shop_name": "Creator Lab",
  "description": "Courses and tools for creators",
  "logo_upload": "https://example.com/logo.png"
}
```

Rules:
- Auth required.
- Max 5 shops per user.
- `shop_slug` is generated automatically.
- `shop_name` is unique.

`GET /shop?shop_slug=creator-lab`

`GET /my-shop`

### Products

`POST /products/create`

```json
{
  "shop_id": "00000000-0000-0000-0000-000000000000",
  "title": "AI Automation Kit",
  "description": "Templates and workflows for automation.",
  "price": 49,
  "content_link": "https://drive.google.com/file/d/example/view",
  "thumbnail": "https://example.com/thumb.jpg"
}
```

Rules:
- Auth required.
- User must own the shop.
- `content_link` is stored in the database but never returned by product listing APIs.

`GET /products?shop_id=<shop_id>`

`GET /product?product_id=<product_id>`

Public product responses return only:
- `product_id`
- `shop_id`
- `title`
- `description`
- `price`
- `thumbnail`
- `created_at`

### Purchases

`POST /buy`

```json
{
  "product_id": "00000000-0000-0000-0000-000000000000",
  "payment_status": "paid"
}
```

For a real payment provider, create the purchase as `pending` and update to `paid` or `completed` from a verified payment webhook.

`GET /my-purchases`

### Secure Access

`GET /download?product_id=<product_id>`

Flow:
1. Verify Supabase JWT.
2. Check that the user has a `paid` or `completed` purchase for the product.
3. Redirect to the original external `content_link`.

`GET /access-link?product_id=<product_id>` returns `{ "content_link": "..." }` after the same verification. Prefer `/download` for frontend flows.

## Security Notes

- Public product APIs never select or return `content_link`.
- `/download` and `/access-link` verify purchase before reading `content_link`.
- Product creation verifies shop ownership.
- Shop creation enforces 5 shops per user.
- Inputs are validated with Zod.
- Supabase service role key is used only server-side.
