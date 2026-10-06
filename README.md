# SriChakra Farm

SriChakra Farm is a Next.js e-commerce app for farm products, with customer shopping, admin inventory management, and order tracking.

## Quick start

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Then open:
- http://localhost:3000

## Project routes

### Customer routes
- `/` — home page
- `/category/fish` — redirects to `/category/fish/tender-seeds`
- `/category/sheep` — sheep and mutton listings
- `/category/vegetables` — vegetables catalog
- `/category/rice` — rice catalog
- `/product/[id]` — product detail page
- `/cart` — cart
- `/checkout` — checkout flow
- `/login` — customer login
- `/register` — customer registration
- `/account` — customer account dashboard
- `/orders` — customer order list

### Admin routes
- `/admin/login` — admin login
- `/admin` — admin dashboard
- `/admin/products` — product inventory list
- `/admin/products/new` — add product
- `/admin/orders` — order management
- `/admin/orders/[id]` — order details

## Admin credentials

The default seeded admin account is:
- Email: `admin@srichakrafarm.com`
- Password: `admin123`

## Notes

- The app uses Prisma with SQLite for local development.
- Product images are matched automatically from the product name for vegetables, with category fallback images for all other categories.
- Route authentication is handled through session cookies for both customer and admin flows.
