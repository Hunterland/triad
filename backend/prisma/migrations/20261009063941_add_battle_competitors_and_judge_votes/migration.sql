-- CreateEnum
CREATE TYPE "BattleSide" AS ENUM ('RED', 'BLUE');

-- CreateEnum
CREATE TYPE "JudgeScorecardStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateTable
CREATE TABLE "battle_competitors" (
    "id" TEXT NOT NULL,
    "battleId" TEXT NOT NULL,
    "eventParticipantId" TEXT NOT NULL,
    "side" "BattleSide" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battle_competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_scorecards" (
    "id" TEXT NOT NULL,
    "judgeAssignmentId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "judgingConfigurationId" TEXT NOT NULL,
    "status" "JudgeScorecardStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_scorecards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_criterion_scores" (
    "id" TEXT NOT NULL,
    "judgeScorecardId" TEXT NOT NULL,
    "battleCompetitorId" TEXT NOT NULL,
    "judgeCriterionId" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_criterion_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "battle_competitors_battleId_idx" ON "battle_competitors"("battleId");

-- CreateIndex
CREATE INDEX "battle_competitors_eventParticipantId_idx" ON "battle_competitors"("eventParticipantId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_competitors_battleId_side_key" ON "battle_competitors"("battleId", "side");

-- CreateIndex
CREATE UNIQUE INDEX "battle_competitors_battleId_eventParticipantId_key" ON "battle_competitors"("battleId", "eventParticipantId");

-- CreateIndex
CREATE INDEX "judge_scorecards_judgeAssignmentId_idx" ON "judge_scorecards"("judgeAssignmentId");

-- CreateIndex
CREATE INDEX "judge_scorecards_roundId_idx" ON "judge_scorecards"("roundId");

-- CreateIndex
CREATE INDEX "judge_scorecards_judgingConfigurationId_idx" ON "judge_scorecards"("judgingConfigurationId");

-- CreateIndex
CREATE INDEX "judge_scorecards_status_idx" ON "judge_scorecards"("status");

-- CreateIndex
CREATE UNIQUE INDEX "judge_scorecards_judgeAssignmentId_roundId_key" ON "judge_scorecards"("judgeAssignmentId", "roundId");

-- CreateIndex
CREATE INDEX "judge_criterion_scores_judgeScorecardId_idx" ON "judge_criterion_scores"("judgeScorecardId");

-- CreateIndex
CREATE INDEX "judge_criterion_scores_battleCompetitorId_idx" ON "judge_criterion_scores"("battleCompetitorId");

-- CreateIndex
CREATE INDEX "judge_criterion_scores_judgeCriterionId_idx" ON "judge_criterion_scores"("judgeCriterionId");

-- CreateIndex
CREATE UNIQUE INDEX "judge_criterion_scores_judgeScorecardId_battleCompetitorId__key" ON "judge_criterion_scores"("judgeScorecardId", "battleCompetitorId", "judgeCriterionId");

-- AddForeignKey
ALTER TABLE "battle_competitors" ADD CONSTRAINT "battle_competitors_battleId_fkey" FOREIGN KEY ("battleId") REFERENCES "Battle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_competitors" ADD CONSTRAINT "battle_competitors_eventParticipantId_fkey" FOREIGN KEY ("eventParticipantId") REFERENCES "EventParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_scorecards" ADD CONSTRAINT "judge_scorecards_judgeAssignmentId_fkey" FOREIGN KEY ("judgeAssignmentId") REFERENCES "judge_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_scorecards" ADD CONSTRAINT "judge_scorecards_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_scorecards" ADD CONSTRAINT "judge_scorecards_judgingConfigurationId_fkey" FOREIGN KEY ("judgingConfigurationId") REFERENCES "judging_configurations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_criterion_scores" ADD CONSTRAINT "judge_criterion_scores_judgeScorecardId_fkey" FOREIGN KEY ("judgeScorecardId") REFERENCES "judge_scorecards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_criterion_scores" ADD CONSTRAINT "judge_criterion_scores_battleCompetitorId_fkey" FOREIGN KEY ("battleCompetitorId") REFERENCES "battle_competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_criterion_scores" ADD CONSTRAINT "judge_criterion_scores_judgeCriterionId_fkey" FOREIGN KEY ("judgeCriterionId") REFERENCES "judge_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
