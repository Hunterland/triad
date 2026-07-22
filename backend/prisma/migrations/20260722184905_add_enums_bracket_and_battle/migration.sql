/*
  Warnings:

  - The `status` column on the `Battle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `phase` on the `Battle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Bracket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BracketType" AS ENUM ('TOP8', 'TOP16');

-- CreateEnum
CREATE TYPE "BattlePhase" AS ENUM ('ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('PENDING', 'ONGOING', 'FINISHED');

-- AlterTable
ALTER TABLE "Battle"
ALTER COLUMN "phase"
TYPE "BattlePhase"
USING "phase"::"BattlePhase";

ALTER TABLE "Battle"
ALTER COLUMN "status"
TYPE "BattleStatus"
USING "status"::"BattleStatus";

-- AlterTable
ALTER TABLE "Bracket"
ALTER COLUMN "type"
TYPE "BracketType"
USING "type"::"BracketType";

-- CreateIndex
CREATE INDEX "Battle_phase_idx" ON "Battle"("phase");

-- CreateIndex
CREATE UNIQUE INDEX "Bracket_eventId_categoryId_type_key" ON "Bracket"("eventId", "categoryId", "type");
