-- CreateTable
CREATE TABLE "judge_assignments" (
    "id" TEXT NOT NULL,
    "eventStaffId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "judge_assignments_eventStaffId_idx" ON "judge_assignments"("eventStaffId");

-- CreateIndex
CREATE INDEX "judge_assignments_categoryId_idx" ON "judge_assignments"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "judge_assignments_eventStaffId_categoryId_key" ON "judge_assignments"("eventStaffId", "categoryId");

-- AddForeignKey
ALTER TABLE "judge_assignments" ADD CONSTRAINT "judge_assignments_eventStaffId_fkey" FOREIGN KEY ("eventStaffId") REFERENCES "event_staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_assignments" ADD CONSTRAINT "judge_assignments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
