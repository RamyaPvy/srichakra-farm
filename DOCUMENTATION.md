# SriChakra Farm - Technical Documentation

**Date**: May 24, 2026  
**Version**: 1.0 (MVP)  
**Status**: Development Complete - Ready for Testing

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Module Documentation](#module-documentation)
6. [API Documentation](#api-documentation)
7. [Setup & Installation](#setup--installation)
8. [Feature Implementation Status](#feature-implementation-status)
9. [Deployment Guide](#deployment-guide)

---

## Project Overview

**SriChakra Farm** is a full-stack mobile e-commerce application enabling customers to browse and order agricultural products (Fish, Sheep/Mutton, Vegetables, Rice) directly from the farm with admin inventory management and delivery tracking.

### Key Features
- ✅ Multi-category product marketplace (Fish, Sheep, Vegetables, Rice)
- ✅ Shopping cart with persistent storage
- ✅ Customer order placement with COD
- ✅ Order status tracking
- ✅ Customer authentication & account management
- ✅ Admin dashboard for inventory & order management
- ✅ Multilingual support (English, Telugu, Hindi)
- ✅ WhatsApp/Call/Maps integration
- ✅ Product variants support (Fish tabs, Mutton services)

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.6 | Full-stack React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Zustand | 5.0.11 | State management (cart) |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | Built-in (Next.js API Routes) | Backend runtime |
| Prisma | 7.4.0 | ORM for database |
| SQLite | Latest | Database (file-based) |
| better-sqlite3 | 12.6.2 | SQLite adapter |
| bcryptjs | 3.0.3 | Password hashing |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| tsx | TypeScript execution |
| PostCSS | CSS processing |

---

## Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Customer App (Browser)                    │
│  ┌──────────────┬────────────────┬──────────────┐            │
│  │ Home Page    │ Category Pages │ Product Pages│            │
│  ├──────────────┼────────────────┼──────────────┤            │
│  │ Cart/Checkout│ Order Tracking │ Account Mgmt │            │
│  └──────────────┴────────────────┴──────────────┘            │
└────────────────────────┬──────────────────────────────────────┘
                         │
                    API Routes
                    /api/...
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼──────┐  ┌──────▼──────┐   ┌────▼──────┐
   │ Auth API  │  │ Products API│   │ Orders API│
   └────┬──────┘  └──────┬──────┘   └────┬──────┘
        │                │               │
        └────────────────┼───────────────┘
                         │
                    ┌────▼───────┐
                    │  Prisma    │
                    │    ORM     │
                    └────┬───────┘
                         │
                    ┌────▼───────┐
                    │  SQLite    │
                    │ (dev.db)   │
                    └────────────┘
```

### Folder Structure
```
srichakra-farm/
├── app/
│   ├── api/                    # Backend API Routes
│   │   ├── auth/              # Authentication
│   │   ├── products/          # Product listing
│   │   └── orders/            # Order management
│   ├── components/            # React components
│   │   ├── home/             # Home page sections
│   │   ├── customer/         # Customer features
│   │   ├── order/            # Order components
│   │   └── ...
│   ├── admin/                # Admin pages
│   ├── account/              # Customer account
│   ├── category/             # Category pages
│   ├── checkout/             # Checkout flow
│   ├── cart/                 # Cart page
│   ├── login/ & register/    # Auth pages
│   ├── i18n/                 # Translations
│   ├── store/                # Zustand stores
│   ├── providers/            # Context providers
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeding
│   └── migrations/           # Database migrations
├── src/
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # Auth helper
│   │   └── prisma.ts        # Prisma client
│   └── generated/            # Generated Prisma types
├── public/                   # Static assets
├── .env                      # Environment variables
├── prisma.config.ts          # Prisma configuration
├── next.config.ts            # Next.js configuration
└── package.json              # Dependencies
```

---

## Database Schema

### Entity-Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│   Customer   │         │  AdminUser   │
├──────────────┤         ├──────────────┤
│ id (PK)      │         │ id (PK)      │
│ email        │         │ email        │
│ password     │         │ password     │
│ createdAt    │         │ role (ADMIN) │
└──────┬───────┘         └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────────┐
│   Order          │
├──────────────────┤
│ id (PK)          │
│ customerId (FK)  │
│ status           │
│ totalAmount      │
│ deliveryType     │
│ address          │
│ createdAt        │
└──────┬───────────┘
       │
       │ 1:N
       ▼
┌──────────────────┐      ┌──────────────┐
│   OrderItem      │      │   Product    │
├──────────────────┤      ├──────────────┤
│ id (PK)          │      │ id (PK)      │
│ orderId (FK)   ──┼──→   │ name_en      │
│ productId (FK) ──┼─────▶│ name_te      │
│ quantity         │      │ price        │
│ price           │      │ stockQty     │
└──────────────────┘      │ category     │
                          │ fishTab      │
                          │ metaJson     │
                          └──────────────┘

┌──────────────────────┐
│  CustomerAddress     │
├──────────────────────┤
│ id (PK)              │
│ customerId (FK)      │
│ street               │
│ city                 │
│ postalCode           │
│ isDefault            │
└──────────────────────┘
```

### Key Tables

#### 1. **Product**
```sql
CREATE TABLE Product (
  id TEXT PRIMARY KEY,
  category ENUM (FISH, SHEEP, VEGETABLES, RICE),
  fishTab ENUM? (TENDER_SEEDS, BULK_LOTS, FAMILY_PACKS),
  name_en TEXT NOT NULL,
  name_te TEXT,
  name_hi TEXT,
  unitLabel TEXT,
  price INT,
  stockQty INT,
  imageUrl TEXT,
  imageSource TEXT,
  isActive BOOLEAN,
  metaJson JSON
);
```

**metaJson Examples**:
- **Fish Tender Seeds**: `{kind: "TENDER_SEEDS", fishType: "Rohu", size: "3-inch", packQty: 5000}`
- **Mutton Service**: `{kind: "MUTTON", services: ["RAW_MIX", "CURRY"], extraCharges: {...}}`

#### 2. **Order**
```sql
CREATE TABLE Order (
  id TEXT PRIMARY KEY,
  customerId UUID,
  status ENUM (PLACED, CONFIRMED, PACKING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED),
  totalAmount INT,
  deliveryType ENUM (PICKUP, DELIVERY),
  paymentMethod ENUM (COD),
  address TEXT,
  customerNotes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### 3. **OrderItem**
```sql
CREATE TABLE OrderItem (
  id TEXT PRIMARY KEY,
  orderId UUID,
  productId TEXT,
  quantity INT,
  price INT,
  variantInfo JSON? -- stores selected variant details
);
```

---

## Module Documentation

### 1. Customer Module (E-Commerce)

#### 1.1 Home Page (`app/page.tsx`)
**Purpose**: Landing page showing categories and farm highlights

**Components**:
- `Hero` - Main banner
- `CategoryTiles` - Fish, Sheep, Vegetables, Rice
- `FarmHighlights` - Photo carousel
- `AboutTrust` - Trust signals
- `ContactActions` - Call, WhatsApp, Maps
- `SupportStrip` - Support info
- `Footer` - Footer links

**Features**:
- ✅ Responsive design
- ✅ Quick category navigation
- ✅ Direct contact buttons
- ✅ Language toggle

---

#### 1.2 Category Pages (`app/category/[type]/page.tsx`)
**Routes**:
- `/category/fish` → Fish products with 3 tabs
- `/category/sheep` → Sheep/Mutton products
- `/category/vegetables` → Vegetables/Fruits
- `/category/rice` → Rice products

**Features**:
- ✅ Filtered product listing
- ✅ Product cards with image, price, stock
- ✅ Add to cart button
- ✅ Tab navigation (Fish: Tender Seeds, Bulk Lots, Family Packs)

**Fish Tabs** (`app/category/[type]/[tab]/page.tsx`):
- Tender Seeds - Fish seed packs
- Bulk Lots - Wholesale fish by weight
- Family Packs - Cut/curry/fry services

---

#### 1.3 Product Details (`app/product/[id]/page.tsx`)
**Shows**:
- Product image(s)
- Full description
- Price & stock status
- Variant selector (if applicable)
- Add to cart with quantity
- Related products

---

#### 1.4 Cart (`app/cart/page.tsx`)
**State Management**: Zustand (`app/store/cart.ts`)

**Features**:
- ✅ Add/remove items
- ✅ Update quantities
- ✅ Persist to localStorage
- ✅ Calculate total
- ✅ Proceed to checkout

**Persisted Data**:
```typescript
{
  items: { productId: quantity },
  lastUpdated: timestamp
}
```

---

#### 1.5 Checkout (`app/checkout/page.tsx`)
**Flow**:
1. Enter/select delivery address
2. Choose delivery type (Pickup/Delivery)
3. Enter preferred delivery date (optional)
4. Add instructions
5. Confirm & place order

**Required Fields**:
- Phone (mandatory)
- Address (if delivery selected)
- Name, Email (optional)

**Payment**: COD only (Phase 1)

---

#### 1.6 Order Tracking (`app/orders/page.tsx`, `/order-success/[id]/page.tsx`)
**Views**:
- Order list with status
- Order details
- Status timeline (Placed → Confirmed → Packing → Out for Delivery → Delivered)
- Customer contact for rider

**Components**:
- `OrderStatusTimeline` - Visual status flow

---

#### 1.7 Customer Account (`app/account/`)

**Routes**:
- `/account` - Dashboard
- `/account/profile` - Edit name, email, phone
- `/account/addresses` - Manage delivery addresses
- `/account/orders` - Order history

**Features**:
- ✅ Login/Register required
- ✅ Profile management
- ✅ Address book
- ✅ Order history

---

### 2. Admin Module

#### 2.1 Admin Login (`app/api/auth/login/route.ts`)
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "admin@srichakrafarm.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "adminId": "uuid",
  "role": "ADMIN"
}
```

---

#### 2.2 Admin Dashboard (`app/admin/page.tsx`)
**Overview**:
- New orders count
- Pending orders count
- Total revenue (today/this week)
- Quick action buttons

---

#### 2.3 Inventory Management (`app/admin/products/page.tsx`)

**Features**:
- ✅ List all products
- ✅ Search/filter by category
- ✅ Edit product details
- ✅ Update stock
- ✅ Enable/disable items
- ✅ Delete items

**Add Product** (`app/admin/products/new/page.tsx`):
```
Form Fields:
- Category (dropdown)
- Name (EN, TE, HI)
- Price
- Stock Quantity
- Unit Label (kg, pack, each)
- Image upload
- Attributes (fish type, size, services, etc.)
- Active status
```

---

#### 2.4 Order Management (`app/admin/orders/page.tsx`)

**Features**:
- ✅ View all orders
- ✅ Filter by status
- ✅ Order details modal
- ✅ Update status
- ✅ Assign delivery (Phase 2)

**Order Details** (`app/admin/orders/[id]/page.tsx`):
- Customer info
- Items list
- Delivery address
- Order notes
- Status timeline
- Action buttons (confirm, pack, out for delivery, delivered)

---

### 3. Authentication Module

#### Endpoints:
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/register` | POST | Customer registration |
| `/api/auth/login` | POST | Customer/Admin login |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/me` | GET | Current user info |

**Password Security**: bcryptjs hashing

---

## API Documentation

### Base URL
```
http://localhost:3000
(Production: https://your-domain.com)
```

### 1. Products API

#### GET `/api/products`
**Query Parameters**:
```
?category=FISH
?search=rohu
?fishTab=TENDER_SEEDS
?limit=20&offset=0
```

**Response**:
```json
{
  "products": [
    {
      "id": "prod-1",
      "category": "FISH",
      "name_en": "Rohu Seeds - 3 Inch",
      "price": 3500,
      "stockQty": 100,
      "imageUrl": "/categories/fish.jpg",
      "fishTab": "TENDER_SEEDS",
      "metaJson": {...}
    }
  ],
  "total": 45
}
```

---

### 2. Orders API

#### POST `/api/orders`
**Request**:
```json
{
  "customerId": "uuid",
  "items": [
    {"productId": "prod-1", "quantity": 5}
  ],
  "deliveryType": "DELIVERY",
  "address": "123 Main St, City",
  "phone": "9999999999",
  "preferredDeliveryDate": "2026-05-30"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "order-123",
  "status": "PLACED",
  "totalAmount": 17500
}
```

#### GET `/api/orders`
**Query**: `?customerId=uuid`

**Response**: List of orders with details

#### GET `/api/orders/[id]`
**Response**: Order details with items and status

#### PATCH `/api/orders/[id]`
**Request** (Admin only):
```json
{
  "status": "CONFIRMED",
  "assignedRiderId": "rider-1"
}
```

---

### 3. Authentication API

#### POST `/api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "John Doe",
  "phone": "9999999999"
}
```

#### POST `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite (included with better-sqlite3)

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/RamyaPvy/srichakra-farm.git
cd srichakra-farm

# 2. Install dependencies
npm install

# 3. Set up environment
# (Already configured in .env)
DATABASE_URL="file:./dev.db"

# 4. Run database migrations
npx prisma migrate deploy

# 5. Seed database with products
npx prisma db seed

# 6. Start development server
npm run dev
```

**Access**:
- Customer App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` (login required)

### Seeded Data
The seed script (`prisma/seed.ts`) creates:
- Admin user: `admin@srichakrafarm.com` / `admin123`
- 50+ products across all categories
- Sample animals and produce

---

## Feature Implementation Status

### MVP - Phase 1 (✅ COMPLETE)
| Feature | Status | Notes |
|---------|--------|-------|
| Home page | ✅ | Categories, highlights, contact |
| Fish module (3 tabs) | ✅ | Tender Seeds, Bulk Lots, Family Packs |
| Sheep/Mutton module | ✅ | Young lambs, Adult sheep, Mutton services |
| Vegetables module | ✅ | Vegetables, Fruits, Leafy |
| Rice module | ✅ | Basic rice products |
| Product pages | ✅ | Detail view with images |
| Shopping cart | ✅ | Persistent via Zustand + localStorage |
| Checkout | ✅ | Address, delivery type, notes |
| COD orders | ✅ | Order placement & confirmation |
| Order tracking | ✅ | Status updates (6 stages) |
| Customer auth | ✅ | Register, login, account |
| Admin inventory | ✅ | Add, edit, delete products |
| Admin orders | ✅ | View, manage, status updates |
| Multilingual (EN/TE/HI) | ✅ | Language toggle in header |
| WhatsApp/Call/Maps | ✅ | Contact buttons on home |

### Phase 2 (Planned)
- [ ] Rider delivery module
- [ ] Stock reservation in real-time
- [ ] SMS/WhatsApp notifications
- [ ] Delivery timesheet
- [ ] Video call integration (sheep)

### Phase 3 (Future)
- [ ] Online payments (UPI/Cards)
- [ ] Coupons & discounts
- [ ] Ratings & reviews
- [ ] Subscriptions (weekly orders)
- [ ] Multi-location support

---

## Deployment Guide

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

**Environment Variables Required**:
```
DATABASE_URL=file:./dev.db (or cloud DB connection string)
NODE_ENV=production
```

**Recommended Hosting**:
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Database**: SQLite on server OR migrate to PostgreSQL/MySQL
- **Media**: AWS S3, Cloudinary (for product images)

---

## Performance Optimization

### Current
- ✅ Image optimization via Next.js Image component
- ✅ Static generation of category pages
- ✅ API route caching
- ✅ Client-side state with Zustand (no re-renders)

### Recommended Improvements
- Add ISR (Incremental Static Regeneration) for products
- Implement API response caching (Redis)
- Optimize images with WebP format
- Implement lazy loading for product lists

---

## Security Checklist

- ✅ Password hashing (bcryptjs)
- ✅ SQL injection prevention (Prisma)
- ⚠️ TODO: Rate limiting on auth endpoints
- ⚠️ TODO: CORS configuration
- ⚠️ TODO: Environment variable validation
- ⚠️ TODO: Admin role verification on all admin endpoints

---

## Common Issues & Troubleshooting

### Issue: Database connection error
```
Error: Failed to open SQLite database
```
**Solution**: Ensure `.env` file has correct `DATABASE_URL="file:./dev.db"`

### Issue: Prisma migrations fail
```
Solution: npx prisma migrate reset
```

### Issue: Products not showing after deploy
```
Solution: Run npx prisma db seed after deployment
```

---

## Support & Contact
- **Admin Email**: admin@srichakrafarm.com
- **Farm Contact**: [From home page]
- **GitHub**: https://github.com/RamyaPvy/srichakra-farm

---

**Document Version**: 1.0  
**Last Updated**: May 24, 2026  
**Author**: SriChakra Farm Development Team
