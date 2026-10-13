-- CreateEnum
CREATE TYPE "Position" AS ENUM ('LONG', 'SHORT');

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "position" "Position" NOT NULL DEFAULT 'LONG';
