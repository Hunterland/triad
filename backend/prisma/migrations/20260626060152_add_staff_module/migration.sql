-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('JUDGE', 'MC', 'DJ', 'ORGANIZER', 'STAFF_SUPPORT');

-- CreateTable
CREATE TABLE "staff_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stageName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "documentId" TEXT,
    "defaultRole" "StaffRole" NOT NULL,
    "specialty" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_staff" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "staffMemberId" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "area" TEXT,
    "order" INTEGER,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_members_email_key" ON "staff_members"("email");

-- CreateIndex
CREATE INDEX "event_staff_eventId_idx" ON "event_staff"("eventId");

-- CreateIndex
CREATE INDEX "event_staff_staffMemberId_idx" ON "event_staff"("staffMemberId");

-- CreateIndex
CREATE INDEX "event_staff_role_idx" ON "event_staff"("role");

-- CreateIndex
CREATE UNIQUE INDEX "event_staff_eventId_staffMemberId_role_key" ON "event_staff"("eventId", "staffMemberId", "role");

-- AddForeignKey
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_staff" ADD CONSTRAINT "event_staff_staffMemberId_fkey" FOREIGN KEY ("staffMemberId") REFERENCES "staff_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
