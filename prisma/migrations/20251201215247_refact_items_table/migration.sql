/*
  Warnings:

  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[orderId,productId]` on the table `items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
ALTER COLUMN "productId" DROP DEFAULT;
DROP SEQUENCE "items_productId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "items_orderId_productId_key" ON "items"("orderId", "productId");
