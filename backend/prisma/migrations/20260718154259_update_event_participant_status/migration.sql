-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'CANCELLED';

-- CreateIndex
CREATE INDEX "EventParticipant_eventId_status_idx" ON "EventParticipant"("eventId", "status");
