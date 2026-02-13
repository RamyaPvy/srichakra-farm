-- CreateTable
CREATE TABLE "FishType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FishVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fishTypeId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "sizeLabel" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "prepTimeMins" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FishVariant_fishTypeId_fkey" FOREIGN KEY ("fishTypeId") REFERENCES "FishType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FishType_name_key" ON "FishType"("name");

-- CreateIndex
CREATE INDEX "FishVariant_fishTypeId_serviceType_idx" ON "FishVariant"("fishTypeId", "serviceType");
