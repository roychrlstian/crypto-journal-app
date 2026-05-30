/*
  Warnings:

  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Trade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `portfolioId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pkey",
ADD COLUMN     "portfolioId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
