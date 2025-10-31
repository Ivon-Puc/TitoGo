/*
  Warnings:

  - A unique constraint covering the columns `[senacId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senacId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "senacId" TEXT NOT NULL,
ADD COLUMN     "statusVerificacao" TEXT NOT NULL DEFAULT 'PENDENTE';

-- CreateIndex
CREATE UNIQUE INDEX "User_senacId_key" ON "User"("senacId");
