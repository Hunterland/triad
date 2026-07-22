-- CreateEnum
CREATE TYPE "BracketType" AS ENUM ('TOP8', 'TOP16');

-- CreateEnum
CREATE TYPE "BattlePhase" AS ENUM ('ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('PENDING', 'ONGOING', 'FINISHED');

-- CreateTable
CREATE TABLE "Bracket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" "BracketType" NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bracket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "phase" "BattlePhase" NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "BattleStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bracket_eventId_idx" ON "Bracket"("eventId");

-- CreateIndex
CREATE INDEX "Bracket_categoryId_idx" ON "Bracket"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Bracket_eventId_categoryId_type_key" ON "Bracket"("eventId", "categoryId", "type");

-- CreateIndex
CREATE INDEX "Battle_bracketId_idx" ON "Battle"("bracketId");

-- CreateIndex
CREATE INDEX "Battle_phase_idx" ON "Battle"("phase");

-- AddForeignKey
ALTER TABLE "Bracket" ADD CONSTRAINT "Bracket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bracket" ADD CONSTRAINT "Bracket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "Bracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
