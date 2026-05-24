# SriChakra Farm - Complete App Management & Workflow Guide

**Version**: 1.0  
**Date**: May 24, 2026  
**Purpose**: Complete operational guide for managing the farm-to-consumer marketplace

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Customer User Journey](#customer-user-journey)
3. [Admin Management Guide](#admin-management-guide)
4. [Order Processing Workflow](#order-processing-workflow)
5. [Daily Operations Manual](#daily-operations-manual)
6. [Best Practices & Tips](#best-practices--tips)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

```
┌────────────────────────────────────────────────────────────┐
│                    SRICHAKRA FARM APP ECOSYSTEM             │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  CUSTOMER SIDE              ADMIN SIDE        OPERATIONS    │
│  ─────────────              ──────────        ──────────    │
│  • Browse Products          • Login           • Phone/Email │
│  • Add to Cart              • Add Products    • Pickup      │
│  • Checkout                 • Manage Stock    • Delivery    │
│  • Track Orders             • View Orders     • Payments    │
│  • View History             • Update Status   • Reports     │
│                                                              │
│                    ↓                ↓                        │
│              ┌─────────────────────────┐                    │
│              │   DATABASE (SQLite)     │                    │
│              │  ┌──────────────────┐   │                    │
│              │  │ Products         │   │                    │
│              │  │ Orders           │   │                    │
│              │  │ Customers        │   │                    │
│              │  │ Admin Users      │   │                    │
│              │  │ Addresses        │   │                    │
│              │  └──────────────────┘   │                    │
│              └─────────────────────────┘                    │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## Customer User Journey

### 🏠 Part 1: Discovery & Browsing

#### Step 1: Open App
```
Customer opens SriChakra Farm on phone/browser
↓
Lands on HOME PAGE showing:
  ✓ Brand name & logo
  ✓ 4 Category tiles (Fish, Sheep, Vegetables, Rice)
  ✓ Farm highlights (carousel of farm photos)
  ✓ Contact buttons (Call, WhatsApp, Get Directions)
  ✓ About section (farm info)
```

**What Customer Sees**:
- Professional layout
- Clear category buttons
- Farm photos building trust
- Easy contact options

**Customer Action**: Clicks on a category (e.g., "Fish")

---

#### Step 2: Browse Products
```
Customer navigates to category page
↓
FISH Category Shows 3 TABS:

1️⃣ TENDER SEEDS (Fish Seed Packs)
   - Rohu Seeds (3-inch, 5,000 qty) - ₹3,500
   - Catla Seeds (5-inch, 10,000 qty) - ₹7,000
   - Each item shows: image, price, quantity, "Add to Cart" button
   
2️⃣ BULK LOTS (Wholesale by weight)
   - Rohu Fish (1-2 kg) - ₹800/kg, Min order 10kg
   - Catla Fish (0.5-1 kg) - ₹1,200/kg
   
3️⃣ FAMILY PACKS (Services)
   - Raw Fish - ₹650/kg
   - Cut Pieces - ₹750/kg
   - Curry Ready - ₹950/kg
   - Fry Ready - ₹900/kg
   - Pickle - ₹1,100/kg

Similarly for:
  • SHEEP (Young lambs, Adult sheep, Mutton services)
  • VEGETABLES (Leafy, Seasonal, Fruits)
  • RICE (Different varieties)
```

**Customer Actions**:
- Browse products with filters
- View full details (image, description)
- Check stock availability
- Read reviews (future)

---

#### Step 3: Add to Cart
```
Customer clicks "Add to Cart" button
↓
Dialog appears:
  Enter Quantity: ___
  Select Variant (if applicable):
    ☐ Service type (Raw/Cut/Curry/etc)
    ☐ Size/Pack size
  [ADD TO CART] button
↓
Toast message: "✓ Added 1 item to cart"
↓
Cart icon shows badge: [🛒 1]
```

**Cart Behavior**:
- Persistent (stored in localStorage)
- Survives browser refresh
- Can hold multiple products
- Shows running total

---

### 💳 Part 2: Checkout & Order Placement

#### Step 4: Proceed to Checkout
```
Customer clicks Cart Icon or "Checkout" button
↓
CART PAGE shows:
  Product 1: Rohu Seeds × 5     ₹3,500 × 5 = ₹17,500
  Product 2: Vegetables × 2 kg  ₹45/kg × 2 = ₹90
  
  [Edit] [Remove] for each item
  
  SUBTOTAL: ₹17,590
  [PROCEED TO CHECKOUT]
```

---

#### Step 5: Enter Delivery Details
```
Checkout page opens with form:

PERSONAL INFORMATION:
  Name: [John Sharma        ]  (prefilled if logged in)
  Phone: [9999999999        ]  ✓ Mandatory
  Email: [john@example.com  ]  (optional)

DELIVERY OPTION:
  ☐ Pickup at Farm
  ☐ Home Delivery  ← Selected
  
ADDRESS:
  Street: [123 Main Street      ]  ✓ Mandatory if delivery
  City: [Hyderabad              ]
  Postal Code: [500061          ]
  Landmark: [Near Park          ]  (optional)
  
  [📍 Set Current Location] (uses GPS)

PREFERRED DELIVERY DATE:
  📅 [May 30, 2026] at [10:00 AM - 2:00 PM]  (optional)

SPECIAL INSTRUCTIONS:
  [Customer instructions about the order...]
  (important for bulk orders)

PAYMENT METHOD:
  ◉ Cash on Delivery (COD)
  ○ Online Payment (coming soon)

ORDER SUMMARY:
  Items Total: ₹17,590
  Delivery Fee: ₹50 (if applicable)
  Tax: ₹0
  ──────────────────
  TOTAL: ₹17,640
  
  [⬅ Back] [Place Order 📦]
```

---

#### Step 6: Order Confirmation
```
After clicking "Place Order":
↓
Validation checks:
  ✓ Phone is valid
  ✓ Address is provided (if delivery)
  ✓ Cart isn't empty
  ✓ Items are still in stock
↓
Order is created in database:
  Order ID: ORDER-20260525-001234
  Status: PLACED
  Created time: 2026-05-25 10:30 AM
↓
Confirmation Page displays:

  ✓ ORDER CONFIRMED!
  
  Order ID: ORDER-20260525-001234
  
  Items:
    • Rohu Seeds × 5
    • Vegetables × 2 kg
  
  Total: ₹17,640
  Delivery: May 30, 10:00 AM
  
  "Your order has been placed successfully!
   We will confirm within 2 hours via WhatsApp/Call.
   
   Order ID: ORDER-20260525-001234"
  
  [📋 View Order] [🏠 Back Home] [📱 Share]
  
  WhatsApp message sent:
  "SriChakra Farm: Your order #ORDER-20260525-001234
   for ₹17,640 confirmed! We'll deliver by May 30.
   Reply to confirm details. Thank you!"
```

---

### 📍 Part 3: Order Tracking

#### Step 7: Track Order Status
```
Customer clicks "View Order" or navigates to Orders page
↓
ORDER DETAILS PAGE shows:

Order #ORDER-20260525-001234
Status Last Updated: May 25, 10:45 AM

TIMELINE:
  ✓ PLACED
     May 25, 10:30 AM
     Order successfully placed
  
  📞 CONFIRMED
     May 25, 11:00 AM (expected)
     Will call to confirm
  
  📦 PACKING
     May 26, 2:00 PM (expected)
     Preparing your order
  
  🚗 OUT FOR DELIVERY
     May 30, 9:30 AM (expected)
     Driver is on the way
  
  ✓ DELIVERED
     May 30, 11:00 AM (expected)
     Order at your doorstep

CURRENT STATUS: PLACED

Items:
  Rohu Seeds (5 packs) - ₹17,500
  Vegetables (2 kg) - ₹90
  
Delivery Address:
  123 Main Street, Hyderabad 500061
  John Sharma | 9999999999
  📍 Get Directions
  
💬 CONTACT:
  [☎️ Call] [💬 WhatsApp] [📧 Email]
```

**What Happens When Status Changes**:
1. Admin updates status in admin panel
2. Customer automatically receives:
   - In-app notification
   - WhatsApp message (Phase 2)
   - SMS notification (Phase 2)

---

### 👤 Part 4: Account Management

#### Customer Account Features
```
LOGIN / ACCOUNT PAGE:

🔐 LOGIN (if new customer):
  Email: [user@example.com]
  Password: [••••••••]
  [LOGIN] [Create Account]

DASHBOARD (if logged in):
  👤 Hi, John Sharma!
  
  MENU:
    ├─ 📋 My Orders (5 total)
    ├─ 👤 My Profile
    ├─ 📍 Saved Addresses (3)
    └─ ⚙️ Settings

MY ORDERS:
  Order #1: ✓ Delivered - May 25
  Order #2: 📦 Packing - May 26
  Order #3: 🚗 Out for Delivery - May 30
  [View all]

My PROFILE:
  Name: John Sharma
  Email: john@example.com
  Phone: 9999999999
  [Edit Profile]

SAVED ADDRESSES:
  Address 1: 123 Main Street (Default)
  Address 2: 456 Office Blvd
  Address 3: 789 Farm Road
  [Add Address] [Edit] [Delete]

SETTINGS:
  Language: English ▼
  Notifications: ON/OFF
  Newsletter: ON/OFF
  [Logout]
```

---

## Admin Management Guide

### 🔐 Part 1: Admin Login & Dashboard

#### Accessing Admin Panel
```
URL: https://your-domain.com/admin

1. Enter Credentials:
   Email: admin@srichakrafarm.com
   Password: [admin password]
   ☐ Remember me
   [LOGIN]

2. Dashboard opens showing:

   ╔════════════════════════════════════════╗
   ║  ADMIN DASHBOARD - SriChakra Farm      ║
   ║  Logged in as: Admin                   ║
   ║  Last login: Today 9:30 AM             ║
   ╚════════════════════════════════════════╝

   QUICK STATS (Today):
   ┌──────────────────────────────┐
   │ New Orders: 5                │
   │ Revenue: ₹87,500             │
   │ Pending Orders: 8            │
   │ Out of Stock Items: 1        │
   └──────────────────────────────┘

   NAVIGATION MENU:
   ├─ 📊 Dashboard (current)
   ├─ 📦 Products Management
   │  ├─ View All Products
   │  ├─ Add New Product
   │  └─ By Category
   │     ├─ Fish
   │     ├─ Sheep/Mutton
   │     ├─ Vegetables
   │     └─ Rice
   ├─ 🛒 Orders
   │  ├─ New Orders (5)
   │  ├─ Confirmed (8)
   │  ├─ Packing (3)
   │  ├─ Out for Delivery (2)
   │  └─ Delivered (45)
   ├─ 👥 Customers
   ├─ 📊 Analytics & Reports
   ├─ ⚙️ Settings
   └─ 🚪 Logout
```

---

### 📦 Part 2: Inventory Management

#### 2.1 View All Products
```
PRODUCTS PAGE:

Filter & Search:
  Category: [All ▼]
  Search: [Type product name...]
  Stock Status: [All ▼]
  Status: [Active ▼]
  [🔍 Search]

Showing 45 products (Page 1 of 3):

┌─ PRODUCT LISTING TABLE ─────────────────────────────┐
│ Image │ Name            │ Price  │ Stock │ Category │
├───────┼─────────────────┼────────┼───────┼──────────┤
│ [IMG] │ Rohu Seeds 3in  │ ₹3,500 │  45   │ Fish     │
│ [IMG] │ Catla Seeds 5in │ ₹7,000 │  12   │ Fish     │
│ [IMG] │ Tomatoes        │  ₹45   │ 200   │ Veg      │
│ [IMG] │ Mutton Curry    │ ₹950   │ 115   │ Sheep    │
│ [IMG] │ Basmati Rice    │ ₹120   │  50   │ Rice     │
└───────┴─────────────────┴────────┴───────┴──────────┘

[Previous] 1 2 3 [Next]

📌 LOW STOCK ALERTS:
  ⚠️ Catla Seeds (12 units) - Low stock!
  ⚠️ Golden Seeds (5 units) - Very low!
```

---

#### 2.2 Add New Product
```
ADD NEW PRODUCT FORM:

BASIC DETAILS:
  Product Name (English): [Rohu Fish - Cut Pieces]
  Product Name (Telugu):  [రోహు చేపలు - కట్ పీసెస్]
  Product Name (Hindi):   [रोहू मछली - कट पीसेज़]
  
  Category: [Select ▼]
    ○ Fish
    ○ Sheep/Mutton
    ○ Vegetables
    ○ Rice
  
  (If Fish selected, show tabs):
  Fish Tab: [Select ▼]
    ○ Tender Seeds
    ○ Bulk Lots
    ○ Family Packs

PRICING & STOCK:
  Price: [₹ 750      ]
  Unit Label: [kg ▼]
  Stock Quantity: [100]
  Unit: [pcs/kg ▼]

IMAGES:
  [Upload Image] [📸 Take Photo]
  Preview: [image or 📁 placeholder]
  Image Source: Farm Photo / Placeholder

DESCRIPTION:
  [Product description and details...]
  (Optional - for customer info)

ATTRIBUTES (Dynamic based on category):
  
  IF FISH - TENDER SEEDS:
    Fish Type: [Rohu ▼]
    Size: [3-inch ▼]
    Pack Quantity: [5000]
  
  IF FISH - FAMILY PACKS:
    Service Type: [Cut Pieces ▼]
    Extra Charges:
      ☐ Boneless (+₹120)
      ☐ Curry Preparation (+₹200)
      Prep Time (hrs): [2]
  
  IF SHEEP:
    Type: [Adult Sheep ▼]
    Age (months): [18]
    Weight (kg): [25]

AVAILABILITY:
  ☐ Active (Available for purchase)
  Discount: [0%]

[💾 Save Product] [❌ Cancel]
```

**What Gets Saved**:
```javascript
{
  id: "prod-12345",
  name_en: "Rohu Fish - Cut Pieces",
  name_te: "రోహు చేపలు - కట్ పీసెస్",
  name_hi: "रोहू मछली - कट पीसेज़",
  category: "FISH",
  fishTab: "FAMILY_PACKS",
  price: 750,
  unitLabel: "kg",
  stockQty: 100,
  imageUrl: "/categories/fish.jpg",
  isActive: true,
  metaJson: {
    kind: "FISH_FAMILY_PACK",
    serviceType: "CUT_PIECES",
    extraCharges: {
      BONELESS: 120,
      CURRY: 200
    },
    prepTimeHours: 2
  }
}
```

---

#### 2.3 Edit Product
```
EDIT PRODUCT PAGE:

(Same form as Add, but pre-filled)

Product: Rohu Fish - Cut Pieces ✎

[Shows all current details with edit capability]

COMMON UPDATES:
  1. Price Change:
     Price: [₹850] (was ₹750)
     [Save]
  
  2. Stock Update:
     Stock Quantity: [75] (sold 25 units today)
     [Save]
  
  3. Availability:
     ☐ Active → ☑ In Stock
     ☐ Inactive → Out of Stock
     [Save]
  
  4. Image Update:
     [Replace Image]
     [Use Existing]

CHANGELOG:
  ✓ Price updated: ₹750 → ₹850 (May 25, 2:30 PM)
  ✓ Stock updated: 100 → 75 (May 25, 4:15 PM)
  ✓ Created: May 20, 10:00 AM
```

---

### 🛒 Part 3: Order Management

#### 3.1 View All Orders
```
ORDERS PAGE:

Filter Options:
  Status: [All ▼]
    - New Orders (5)
    - Confirmed (8)
    - Packing (3)
    - Out for Delivery (2)
    - Delivered (45)
    - Cancelled (1)
  
  Date Range: [Last 30 Days ▼]
  Search by Order ID: [ORDER-________]
  Search by Phone: [________]
  [🔍 Filter]

ORDERS TABLE:
┌─────────────────────────────────────────────────────────┐
│ Order ID           │ Customer    │ Total  │ Status     │
├────────────────────┼─────────────┼────────┼────────────┤
│ ORDER-20260525-001 │ John Sharma │₹17,640│ ⏳ Placed   │
│ ORDER-20260524-890 │ Priya Verma │₹5,200 │ ✓ Confirmed│
│ ORDER-20260524-889 │ Rajesh      │₹12,500│ 📦 Packing │
│ ORDER-20260523-888 │ Anita Devi  │₹8,900 │ 🚗 On Route│
│ ORDER-20260523-887 │ Amit Singh  │₹3,450 │ ✓ Delivered│
└─────────────────────────────────────────────────────────┘

[Previous] 1 2 3 4 5 [Next]
```

---

#### 3.2 Order Management Workflow
```
DETAILED ORDER VIEW:

ORDER #ORDER-20260525-001
Status: PLACED

TIMELINE & ACTIONS:
┌────────────────────────────────────────┐
│ 1️⃣ PLACED (Currently Here)             │
│    Time: May 25, 10:30 AM              │
│    Customer placed order                │
│    [Next: Confirm Order →]              │
│                                         │
│    ACTION: [✏️ Edit] [🔍 Details]       │
│    [📞 Call Customer] [💬 Message]      │
│    [❌ Cancel Order]                    │
├────────────────────────────────────────┤
│ 2️⃣ CONFIRMED (Pending)                 │
│    Expected: May 25, 11:00 AM          │
│    Will confirm after calling           │
│    [Click to continue →]                │
├────────────────────────────────────────┤
│ 3️⃣ PACKING (Greyed out)                │
│    Expected: May 26, 2:00 PM           │
│    Preparing items                      │
├────────────────────────────────────────┤
│ 4️⃣ OUT FOR DELIVERY (Greyed out)       │
│    Expected: May 30, 9:00 AM           │
│    Assigned to: [Select Driver ▼]      │
├────────────────────────────────────────┤
│ 5️⃣ DELIVERED (Greyed out)              │
│    Waiting for confirmation             │
└────────────────────────────────────────┘

CUSTOMER DETAILS:
  Name: John Sharma
  Phone: 9999999999
  Email: john@example.com
  
  [☎️ Call] [💬 WhatsApp] [📧 Email]

DELIVERY ADDRESS:
  123 Main Street
  Hyderabad, 500061
  Landmark: Near Park
  
  [📍 View on Map]

ORDER ITEMS:
┌────────────────────────────────────┐
│ Item             │ Qty │ Price    │
├──────────────────┼─────┼──────────┤
│ Rohu Seeds 3in   │  5  │₹17,500   │
│ Tomatoes 2kg     │  1  │₹90       │
│ Mutton Curry 1kg │  1  │₹950      │
├──────────────────┼─────┼──────────┤
│ SUBTOTAL         │     │₹18,540   │
│ Delivery Fee     │     │    ₹100   │
│ TOTAL            │     │₹18,640   │
└────────────────────────────────────┘

SPECIAL INSTRUCTIONS:
  "Please pack in separate bags for easy handling"

[✅ CONFIRM ORDER] [📝 Add Note] [❌ CANCEL]
```

---

#### 3.3 Status Update Actions

**Scenario 1: Confirming Order**
```
Admin confirms receipt of order:

BEFORE:
Status: PLACED
Action Required: [✅ CONFIRM ORDER]

AFTER clicking [CONFIRM ORDER]:
┌─────────────────────────────────────┐
│ Confirming Order...                 │
│ 📞 [Select how to confirm]:         │
│                                      │
│ ○ I'll call customer (will message) │
│ ○ Customer will call us              │
│ ○ Auto-confirm (send message)        │
│                                      │
│ Confirm by: [Choose time ▼]         │
│ Message: [Optional special note] ... │
│                                      │
│ [Confirm] [Cancel]                  │
└─────────────────────────────────────┘

RESULT:
✓ Order Status: CONFIRMED
✓ Customer Notification sent: WhatsApp/Call
✓ Timestamp: May 25, 11:15 AM
✓ Next Step: Start Packing
```

**Scenario 2: Packing Items**
```
Admin marks order as being packed:

ACTION REQUIRED:
  □ Confirm all items are available
  □ Check expiry dates (if applicable)
  □ Pack items properly
  □ Generate invoice
  □ Prepare for shipment

CLICK: [📦 MARK AS PACKING]

RESULT:
✓ Status: PACKING
✓ Expected ready time: May 26, 2:00 PM
✓ Customer notified: "Your order is being prepared"
```

**Scenario 3: Assign Delivery**
```
When order is ready to ship:

ASSIGN DRIVER:
  [Select Rider ▼]
    - Driver A: Available
    - Driver B: On Route (1 delivery)
    - Driver C: Unavailable
  
  Delivery Date: [May 30 ▼]
  Delivery Slot: [10:00 AM - 2:00 PM ▼]
  
  [Assign]

RESULT:
✓ Driver assigned: Driver A
✓ Status: OUT_FOR_DELIVERY
✓ Driver receives notification
✓ Customer receives tracking link
```

**Scenario 4: Mark as Delivered**
```
When driver confirms delivery:

DELIVERY CONFIRMATION:
  Driver: Driver A
  Delivered Time: May 30, 11:30 AM
  Customer Confirmed: ✓ Yes
  ☐ Photo Proof Attached
  ☐ OTP Verified
  
  Notes: "Delivered successfully, customer satisfied"

[MARK AS DELIVERED]

RESULT:
✓ Status: DELIVERED
✓ Order Complete
✓ Customer notified
✓ Revenue recorded: ₹18,640
```

---

## Order Processing Workflow

### Complete Order Lifecycle

```
                    ┌─────────────────────┐
                    │  CUSTOMER PLACES    │
                    │  ORDER ONLINE       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  DATABASE STORES    │
                    │  Status: PLACED     │
                    └──────────┬──────────┘
                               │
                    ✉️ NOTIFICATION SENT
                    WhatsApp: "Order received"
                               │
                               ▼
                    ┌─────────────────────┐
        ┌─────────▶ │ ADMIN REVIEWS ORDER │ ◀─────────┐
        │           ├─────────────────────┤           │
        │           │ - Check stock       │           │
        │           │ - Verify payment    │           │
        │           │ - Check address     │           │
        │           └──────────┬──────────┘           │
        │                      │                      │
        │                      ▼                      │
        │           ┌─────────────────────┐          │
        │           │ APPROVE OR REJECT   │          │
        │           └──────────┬──────────┘          │
        │                      │                     │
        │         [APPROVE]    │   [REJECT]          │
        │            │         │      │              │
        │            ▼         ▼      └──────────────┘
        │      CONFIRMED    CANCELLED
        │            │
        │     [CALL CUSTOMER
        │      TO CONFIRM]
        │            │
        │            ▼
        │      ┌──────────────────┐
        └──────│  CUSTOMER ACCEPTS │ ──────┐
               │  DELIVERY DATE    │       │
               └──────┬───────────┘       │
                      │                  │
                ✉️ CONFIRMATION SENT     │
               WhatsApp: Delivery time  │
                      │                 │
                      ▼                 │
             ┌────────────────────┐    │
             │ TEAM PREPARES ITEMS│    │
             │ Status: PACKING    │    │
             └────────┬───────────┘    │
                      │                │
                ✉️ PACKING STARTED     │
              WhatsApp: "Preparing"   │
                      │               │
                      ▼               │
         ┌────────────────────────┐  │
         │ SELECT & ASSIGN DRIVER │  │
         │ Status: READY FOR      │  │
         │ DELIVERY               │  │
         └────────┬───────────────┘  │
                  │                  │
          ✉️ DRIVER ASSIGNED         │
        WhatsApp: Driver's phone     │
                  │                  │
                  ▼                  │
    ┌─────────────────────────────┐ │
    │ DRIVER PICKS UP ORDER       │ │
    │ Status: OUT_FOR_DELIVERY    │ │
    └────────┬────────────────────┘ │
             │                      │
      ✉️ OUT FOR DELIVERY         │
    WhatsApp: Tracking link,  ────┘
    Estimated time
             │
             ▼
   ┌──────────────────────────┐
   │ DRIVER DELIVERS PACKAGE  │
   │ ✓ Customer confirms      │
   │ ✓ Payment collected      │
   │ ✓ Photo/OTP taken       │
   │ Status: DELIVERED       │
   └────────┬─────────────────┘
            │
     ✉️ DELIVERY COMPLETED
   WhatsApp: "Delivered"
            │
            ▼
   ┌──────────────────────────┐
   │ ORDER CLOSED             │
   │ Revenue: ₹18,640 credited│
   │ Customer can rate/review │
   └──────────────────────────┘
```

### Timeline Examples

**Same-Day Order**:
```
10:30 AM → Customer places order
11:00 AM → Admin confirms
2:00 PM → Packing complete
4:00 PM → Driver assigned
5:00 PM → Out for delivery
6:30 PM → Delivered

Total Time: 8 hours
```

**Next-Day Delivery**:
```
5:00 PM → Customer places order
5:30 PM → Admin confirms
Next morning 9:00 AM → Packing starts
12:00 PM → Packing complete
2:00 PM → Driver assigned
3:00 PM → Out for delivery
5:00 PM → Delivered

Total Time: ~24 hours
```

---

## Daily Operations Manual

### 📅 Morning Routine (9:00 AM - 10:00 AM)

```
1. CHECK OVERNIGHT ORDERS
   Log into admin panel
   Navigate to: Orders → New Orders
   
   Tasks:
   ☐ Review all new orders placed overnight
   ☐ Verify stock availability for each
   ☐ Check addresses are valid
   ☐ Identify problematic orders
   
   Example:
   📊 Overnight Report:
   - 12 new orders
   - Total value: ₹156,750
   - Flagged: 1 order (out of stock item)

2. STOCK CHECK
   Navigate to: Products → Filter by Low Stock
   
   Tasks:
   ☐ Check which items need reordering
   ☐ Update quantities from warehouse
   ☐ Mark items out-of-stock if needed
   ☐ Notify customers if backordered

3. CONFIRM PENDING ORDERS
   Navigate to: Orders → Status: PLACED
   
   For each order:
   ☐ Call customer or send WhatsApp
   ☐ Confirm delivery time
   ☐ Verify address
   ☐ Update status to CONFIRMED
   
   Approximate time: 30-60 mins for 10 orders

4. START PACKING
   Navigate to: Orders → Status: CONFIRMED
   
   For today's confirmed orders:
   ☐ Print order details
   ☐ Gather items from warehouse
   ☐ Quality check items
   ☐ Pack securely
   ☐ Mark as PACKING in system
   ☐ Attach invoice
```

### ☀️ Midday Routine (2:00 PM - 3:00 PM)

```
1. ASSIGN DELIVERIES
   Navigate to: Orders → Status: PACKING
   
   Tasks:
   ☐ Check which orders are packed and ready
   ☐ Assign drivers based on:
      - Location (group nearby deliveries)
      - Driver availability
      - Vehicle capacity
   ☐ Update delivery time slot
   ☐ Mark as OUT_FOR_DELIVERY
   ☐ Send driver WhatsApp with order details

   Example Assignment:
   Driver A (Route: North area):
   - Order 001: John Sharma (₹18,640)
   - Order 004: Raj Kumar (₹5,200)
   - Order 007: Priya Singh (₹12,500)
   Total: 3 orders, ~₹36,340

2. MONITOR DELIVERIES
   Navigate to: Orders → Status: OUT_FOR_DELIVERY
   
   Tasks:
   ☐ Track driver locations (if GPS available)
   ☐ Answer customer calls/WhatsApp
   ☐ Handle delivery issues:
      - Address unclear → call customer
      - Customer not available → reschedule
      - Item missing → contact admin
   ☐ Process returned items (if any)

3. QUICK ORDERS REPORT
   Open Dashboard summary:
   
   KPIs to check:
   ✓ Orders received today: ___
   ✓ Orders confirmed: ___
   ✓ Orders packing: ___
   ✓ Orders delivered: ___
   ✓ Revenue today: ₹ ___,___
   ✓ Pending issues: ___
```

### 🌙 Evening Routine (6:00 PM - 7:00 PM)

```
1. CLOSE OUT DELIVERIES
   Navigate to: Orders → Status: OUT_FOR_DELIVERY
   
   As drivers complete deliveries:
   ☐ Receive delivery confirmation from driver
   ☐ Update status to DELIVERED
   ☐ Confirm payment received
   ☐ Record any customer feedback
   ☐ Update revenue

2. PROBLEM RESOLUTION
   Check for any issues:
   ☐ Undelivered orders (reschedule)
   ☐ Customer complaints
   ☐ Payment issues
   ☐ Product quality issues

   Example Resolution:
   Issue: Customer says item was damaged
   ┌─ Action:
   │  1. Call customer
   │  2. Apologize & offer replacement
   │  3. Arrange pickup of damaged item
   │  4. Send replacement ASAP
   │  5. Document incident
   └─ Mark order: ISSUE_RESOLVED

3. RESTOCK & PREPARE FOR TOMORROW
   Navigate to: Products → All Products
   
   Tasks:
   ☐ Update inventory from today's sales
   ☐ Identify bestsellers & high-demand items
   ☐ Plan tomorrow's stock
   ☐ Note items that need replenishment
   ☐ Update warehouse list
   
   Example:
   Sold Today:
   - Rohu Seeds: 25 units (↓ 25)
   - Tomatoes: 50 kg (↓ 50 kg)
   - Mutton Curry: 30 kg (↓ 30 kg)
   
   Restock Plan:
   - Get 100 units Rohu Seeds
   - Arrange 150 kg Tomatoes
   - Prepare 75 kg Mutton Curry
   - Order ice packs & packaging

4. END-OF-DAY REPORT
   Prepare summary:
   
   DAILY SUMMARY:
   Date: May 25, 2026
   ├─ New Orders: 12
   ├─ Total Revenue: ₹156,750
   ├─ Orders Delivered: 9
   ├─ Pending Delivery: 3
   ├─ Issues Reported: 2
   │  ├─ Damaged item (RESOLVED)
   │  └─ Address unclear (RESCHEDULED)
   ├─ Top Products Sold:
   │  ├─ Rohu Seeds: ₹52,500
   │  ├─ Tomatoes: ₹2,250
   │  └─ Mutton: ₹18,750
   ├─ Inventory Status:
   │  ├─ 3 items low stock
   │  ├─ 0 out of stock
   └─ Next Day Forecast: 15 expected orders
```

---

## Best Practices & Tips

### ✅ Customer Service Excellence

**Rule 1: Respond Quickly**
- Acknowledge order within 30 minutes
- Call/WhatsApp within 1 hour
- Never leave customer hanging

**Rule 2: Clear Communication**
- Always confirm delivery time with customer
- Send updates when status changes
- Be honest about delays or issues

**Rule 3: Quality First**
- Check all items before packing
- Use proper packaging
- Handle with care (especially live fish)

**Rule 4: Problem Resolution**
- Listen to customer issues
- Take responsibility
- Offer immediate solutions
- Follow up

### 📊 Operational Efficiency

**Order Batching**
```
✓ Group orders by delivery location
✓ Optimize driver routes
✓ Reduce delivery time & costs
✓ Improve customer satisfaction

Example:
North Area (Driver A):
- John Sharma, Banjara Hills
- Priya Singh, Jubilee Hills
- Rajesh, Hyderabad Hills

South Area (Driver B):
- Amit, Begumpet
- Anita, Charminar
- Vikram, Falaknuma
```

**Stock Management**
```
✓ Track bestsellers
✓ Restock before running out
✓ Remove slow-moving items
✓ Plan seasonal items

Weekly Review:
Week 1: Which items sold most?
Week 2: Which customers order regularly?
Week 3: Plan inventory accordingly
Week 4: Refine based on patterns
```

**Time Management**
```
Admin to-do checklist:

9:00-10:00  AM: Morning review & planning
10:00-12:00 PM: Confirm orders, start packing
12:00-2:00  PM: Packing continues
2:00-4:00   PM: Deliveries assigned & monitoring
4:00-6:00   PM: Handle customer issues
6:00-7:00   PM: Close deliveries, plan next day

Total: ~7 hours of admin work
```

### 🔧 Technical Best Practices

**Database Maintenance**
```
Weekly:
☐ Backup database (dev.db)
☐ Check for corrupted records
☐ Verify all relationships are intact

Monthly:
☐ Archive old orders (>3 months)
☐ Clean up temporary files
☐ Review database size
☐ Optimize queries
```

**Security**
```
✓ Change admin password monthly
✓ Never share login credentials
✓ Use HTTPS (secure connection)
✓ Keep backups offline
✓ Log all admin actions
```

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: "Out of Stock" Item Ordered

**Problem**: Customer ordered Rohu Seeds but stock is 0

**Solution**:
```
Step 1: Check order status
  Navigate: Orders → Find order
  
Step 2: Contact customer
  "Hello! We're out of Rohu Seeds.
   Would you like:
   A) Catla Seeds instead?
   B) Place order for next week?
   C) Cancel order?"
  
Step 3: Update order
  If cancelling:
    - Mark status: CANCELLED
    - Refund amount: ₹3,500
    - Apology message
  
  If alternative accepted:
    - Update items
    - Recalculate total
    - Confirm with customer
```

#### Issue 2: Customer Not Available for Delivery

**Problem**: Driver at address but customer not home

**Solution**:
```
Step 1: Try calling customer
  "Sir/Madam, we're at your location.
   Are you available for delivery?"
  
Step 2: Options:
  A) Customer coming home (wait 15-30 mins)
  B) Neighbor can receive
  C) Reschedule delivery
  D) Place on porch (if weather-safe)
  
Step 3: Document
  - Time of call
  - Action taken
  - Status update
```

#### Issue 3: Product Quality Complaint

**Problem**: Customer received damaged fish

**Solution**:
```
Step 1: Apologize immediately
  "We sincerely apologize for the issue.
   We will make it right."
  
Step 2: Get details
  - Photo of damaged item
  - When discovered
  - Impact on customer
  
Step 3: Offer solution
  Option A: Full refund + apology gift
  Option B: Replacement delivery + apology gift
  Option C: Store credit + apology gift
  
Step 4: Prevent recurrence
  - Review packing procedure
  - Check storage temperature
  - Retrain staff if needed

Quality Control Checklist:
☐ Check expiry dates
☐ Check for damage/leaks
☐ Proper packaging
☐ Ice packs for perishables
☐ Temperature maintained
```

#### Issue 4: Wrong Item Delivered

**Problem**: Customer received tomatoes instead of fish

**Solution**:
```
Step 1: Acknowledge error
  "This is our mistake. We apologize."
  
Step 2: Quick resolution
  Same day pickup of wrong item
  Same day delivery of correct item
  + discount on next order
  
Step 3: Root cause analysis
  - Packing label unclear?
  - Warehouse organization issue?
  - Training needed?
  
Step 4: Implement fix
  - Better labeling system
  - Staff retraining
  - Quality check additions
```

#### Issue 5: Database Login Issues

**Problem**: Admin can't log in

**Solution**:
```
Step 1: Check credentials
  Email: admin@srichakrafarm.com
  Password: [Try reset]
  
Step 2: Reset password
  PostgreSQL command:
  UPDATE AdminUser 
  SET password = bcrypt('newpassword')
  WHERE email = 'admin@srichakrafarm.com'
  
Step 3: Clear browser cache
  - Hard refresh (Ctrl+Shift+R)
  - Clear cookies
  - Try different browser
  
Step 4: Database check
  If still failing:
  - Check database connection
  - Verify dev.db file exists
  - Check file permissions
```

---

## Quick Reference Cards

### Order Status Meanings

| Status | Meaning | Action |
|--------|---------|--------|
| 🟡 PLACED | Order received, pending review | Admin to confirm |
| 🟢 CONFIRMED | Order approved, delivery time set | Start packing |
| 📦 PACKING | Items being prepared | Prepare for shipment |
| 🚗 OUT_FOR_DELIVERY | Driver in route | Monitor delivery |
| ✅ DELIVERED | Order delivered to customer | Close order |
| ❌ CANCELLED | Order cancelled | Process refund |

### Quick Admin Actions

```
To Confirm Order:
1. Navigate to Orders
2. Click order
3. Click [✅ CONFIRM ORDER]
4. Select contact method
5. Click Confirm

To Update Stock:
1. Navigate to Products
2. Find product
3. Click [Edit]
4. Change "Stock Quantity"
5. Click [Save]

To Assign Delivery:
1. Navigate to Orders
2. Select PACKING status orders
3. Click [Assign Driver]
4. Choose driver
5. Set delivery time
6. Click [Assign]

To Mark Delivered:
1. Navigate to Orders
2. Find OUT_FOR_DELIVERY order
3. Click [Mark Delivered]
4. Confirm details
5. Click [Deliver]
```

---

## Performance Metrics to Track

### Daily KPIs
```
Metric                  Target   Formula
─────────────────────────────────────────
Orders/Day              15+      Total new orders
Revenue/Day             ₹150K+   Sum of order values
Delivery Rate           95%+     Delivered / Total
Order Accuracy          99%+     Correct items / Total
Customer Satisfaction   4.5+     Average rating
Response Time           1 hour   Time to confirm
```

### Weekly KPIs
```
Total Orders            105+     (15 orders × 7)
Total Revenue           ₹1,050K+ (₹150K × 7)
Repeat Customers        30%+     Repeat / Total
Product Bestsellers     Top 5    By units sold
Inventory Turnover      90%+     Sold / Available
Issue Resolution Rate   98%+     Resolved / Issues
```

---

**This guide should be referenced daily for optimal operations!**

**Training**: Ensure all team members understand this workflow before launch.

**Updates**: Review and update this guide quarterly as you scale.
