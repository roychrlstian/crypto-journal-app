/*
  Warnings:

  - Added the required column `status` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "exit" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL;
