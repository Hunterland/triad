-- CreateEnum
CREATE TYPE "JudgingInterfaceType" AS ENUM ('LEVEL_A', 'LEVEL_B', 'TRIAD', 'CUSTOM');

-- CreateEnum
CREATE TYPE "JudgingConfigurationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JudgingPurpose" AS ENUM ('BATTLE', 'PRESELECTION');

-- CreateTable
CREATE TABLE "judging_configurations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "interfaceType" "JudgingInterfaceType" NOT NULL,
    "purpose" "JudgingPurpose" NOT NULL DEFAULT 'BATTLE',
    "status" "JudgingConfigurationStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judging_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_criteria" (
    "id" TEXT NOT NULL,
    "judgingConfigurationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DECIMAL(5,2) NOT NULL,
    "order" INTEGER NOT NULL,
    "minScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "maxScore" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "judging_configurations_categoryId_purpose_idx" ON "judging_configurations"("categoryId", "purpose");

-- CreateIndex
CREATE INDEX "judging_configurations_status_idx" ON "judging_configurations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "judging_configurations_categoryId_purpose_version_key" ON "judging_configurations"("categoryId", "purpose", "version");

-- CreateIndex
CREATE INDEX "judge_criteria_judgingConfigurationId_idx" ON "judge_criteria"("judgingConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "judge_criteria_judgingConfigurationId_code_key" ON "judge_criteria"("judgingConfigurationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "judge_criteria_judgingConfigurationId_order_key" ON "judge_criteria"("judgingConfigurationId", "order");

-- AddForeignKey
ALTER TABLE "judging_configurations" ADD CONSTRAINT "judging_configurations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_criteria" ADD CONSTRAINT "judge_criteria_judgingConfigurationId_fkey" FOREIGN KEY ("judgingConfigurationId") REFERENCES "judging_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
