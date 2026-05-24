-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "variantKey" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "variantLabel" TEXT;

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
