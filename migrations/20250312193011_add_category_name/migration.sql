/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "categoryName" TEXT NOT NULL DEFAULT 'غير مصنف';
