-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLACED',
    "customerId" TEXT,
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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("addressLine1", "addressLine2", "city", "createdAt", "customerName", "deliveryFee", "deliveryType", "email", "id", "landmark", "language", "mapLink", "notes", "orderNumber", "paymentMethod", "phone", "pincode", "preferredSlot", "state", "status", "subtotal", "totalAmount", "updatedAt") SELECT "addressLine1", "addressLine2", "city", "createdAt", "customerName", "deliveryFee", "deliveryType", "email", "id", "landmark", "language", "mapLink", "notes", "orderNumber", "paymentMethod", "phone", "pincode", "preferredSlot", "state", "status", "subtotal", "totalAmount", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_phone_createdAt_idx" ON "Order"("phone", "createdAt");
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
