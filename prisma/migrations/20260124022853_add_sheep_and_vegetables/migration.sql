/*
  Warnings:

  - You are about to drop the `VegItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `code` on the `SheepItem` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `SheepItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `SheepItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VegItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VegetableItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "availableQty" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Available',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SheepItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "weightKg" TEXT NOT NULL,
    "ageMonths" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SheepItem" ("ageMonths", "createdAt", "id", "price", "status", "weightKg") SELECT "ageMonths", "createdAt", "id", "price", "status", "weightKg" FROM "SheepItem";
DROP TABLE "SheepItem";
ALTER TABLE "new_SheepItem" RENAME TO "SheepItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
