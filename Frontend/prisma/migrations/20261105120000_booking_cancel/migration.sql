-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "cancelReason" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Booking_cancelledAt_idx" ON "Booking"("cancelledAt");
