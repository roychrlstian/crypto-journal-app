-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "coin" TEXT NOT NULL,
    "entry" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);
