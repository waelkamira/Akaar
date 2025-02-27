/*
  Warnings:

  - You are about to drop the column `conutry` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "conutry",
ADD COLUMN     "country" TEXT DEFAULT 'sr';
