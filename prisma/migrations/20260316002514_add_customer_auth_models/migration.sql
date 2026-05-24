-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "landmark" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLACED',
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "deliveryType" TEXT NOT NULL DEFAULT 'DELIVERY',
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "landmark" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "mapLink" TEXT,
    "preferredSlot" TEXT,
    "notes" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "subtotal" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Order" ("addressLine1", "addressLine2", "city", "createdAt", "customerName", "deliveryFee", "deliveryType", "email", "id", "landmark", "language", "mapLink", "notes", "orderNumber", "paymentMethod", "phone", "pincode", "preferredSlot", "state", "status", "subtotal", "totalAmount", "updatedAt") SELECT "addressLine1", "addressLine2", "city", "createdAt", "customerName", "deliveryFee", "deliveryType", "email", "id", "landmark", "language", "mapLink", "notes", "orderNumber", "paymentMethod", "phone", "pincode", "preferredSlot", "state", "status", "subtotal", "totalAmount", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_phone_createdAt_idx" ON "Order"("phone", "createdAt");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_te" TEXT,
    "name_hi" TEXT,
    "unitLabel" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stockQty" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "imageSource" TEXT NOT NULL DEFAULT 'PLACEHOLDER',
    "imageAttributionText" TEXT,
    "imageAttributionUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "fishTab" TEXT,
    "metaJson" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("category", "createdAt", "fishTab", "id", "imageAttributionText", "imageAttributionUrl", "imageSource", "imageUrl", "isActive", "metaJson", "name_en", "name_hi", "name_te", "price", "stockQty", "unitLabel", "updatedAt") SELECT "category", "createdAt", "fishTab", "id", "imageAttributionText", "imageAttributionUrl", "imageSource", "imageUrl", "isActive", "metaJson", "name_en", "name_hi", "name_te", "price", "stockQty", "unitLabel", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_category_isActive_idx" ON "Product"("category", "isActive");
CREATE INDEX "Product_fishTab_idx" ON "Product"("fishTab");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
