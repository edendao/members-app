/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD');

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "type",
ADD COLUMN     "type" "TokenType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "Transaction" (
    "hash" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "timeStamp" INTEGER NOT NULL,
    "confirmations" TEXT NOT NULL,
    "isError" BOOLEAN NOT NULL,
    "cumulativeGasUsed" TEXT NOT NULL,
    "gas" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "gasPrice" TEXT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "blockNumber" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL,
    "gCO2" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("hash")
);

-- CreateIndex
CREATE INDEX "Transaction_blockNumber_idx" ON "Transaction"("blockNumber");

-- CreateIndex
CREATE INDEX "Transaction_from_to_idx" ON "Transaction"("from", "to");

-- CreateIndex
CREATE INDEX "Transaction_contractAddress_idx" ON "Transaction"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedToken_type_key" ON "Token"("hashedToken", "type");
