/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `staff_members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "staff_members" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "staff_members_userId_key" ON "staff_members"("userId");

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
