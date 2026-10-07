# SriChakra Farm

SriChakra Farm is a Next.js e-commerce app for farm products, with customer shopping, admin inventory management, and order tracking.

## Quick start

```bash
npm ci
npx prisma db push
npx prisma db seed
npm run dev
```

Then open:
- http://localhost:3000

## Reopen and sync

After a break, open this folder in VS Code and run `npm ci` if dependencies need restoring. VS Code is configured to offer starting the local app when this workspace opens. The repository also enables Git fetch in the background and pushes commits made through VS Code automatically. Saving a file is not a Git commit, so review and commit your changes in Source Control; the push happens after that commit.

`http://localhost:3000` is a development address on this computer and is available only while the dev server is running. An always-available customer URL requires deploying the app and migrating the local SQLite database to a managed PostgreSQL database, with product photos in persistent hosted storage. The repository does not yet have hosting credentials or a production database configured, so no public deployment has been created.

Copy `.env.example` to `.env` for local configuration. Seeding is now non-destructive: it adds starter products only to an empty catalog and never deletes orders or resets an existing admin password. For production, set a strong `ADMIN_INITIAL_PASSWORD` before the first seed. To enable camera/gallery product photos, create a Cloudinary unsigned upload preset restricted to images with a 10 MB maximum, then set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Uploaded product images are stored by Cloudinary and their URLs are saved with inventory records.

## Owner and admin access

Owners sign in at `/admin/login`; inventory and order management are under `/admin/products` and `/admin/orders`. These routes and inventory write APIs require an admin session. Customer profile, addresses, and orders are available after customer login at `/account`.

The seed admin credentials are for local development only. Change the password before exposing any deployment publicly; never reuse the documented seed password in production.

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
