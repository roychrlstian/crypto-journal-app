/*
  Warnings:

  - The `status` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "status",
ADD COLUMN     "status" "TradeStatus" NOT NULL DEFAULT 'OPEN';
