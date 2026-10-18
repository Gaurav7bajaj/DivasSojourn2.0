-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('UPCOMING', 'DUE', 'PAID', 'WAIVED');

-- CreateTable
CREATE TABLE "Traveler" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Traveler_pkey" PRIMARY KEY ("id")
);

-- AlterTable Booking
ALTER TABLE "Booking" ADD COLUMN "travelerId" TEXT;
ALTER TABLE "Booking" ADD COLUMN "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BookingInstallment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "amountDue" DECIMAL(12,2) NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'UPCOMING',
    "paidAt" TIMESTAMP(3),
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingInstallment_pkey" PRIMARY KEY ("id")
);

-- AlterTable Payment
ALTER TABLE "Payment" ADD COLUMN "installmentId" TEXT;

-- Indexes
CREATE UNIQUE INDEX "Traveler_phone_key" ON "Traveler"("phone");
CREATE INDEX "Traveler_email_idx" ON "Traveler"("email");
CREATE INDEX "Booking_phone_idx" ON "Booking"("phone");
CREATE INDEX "Booking_travelerId_idx" ON "Booking"("travelerId");
CREATE INDEX "BookingInstallment_bookingId_sortOrder_idx" ON "BookingInstallment"("bookingId", "sortOrder");
CREATE INDEX "BookingInstallment_status_dueDate_idx" ON "BookingInstallment"("status", "dueDate");
CREATE INDEX "Payment_installmentId_idx" ON "Payment"("installmentId");

-- ForeignKeys
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "Traveler"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BookingInstallment" ADD CONSTRAINT "BookingInstallment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_installmentId_fkey" FOREIGN KEY ("installmentId") REFERENCES "BookingInstallment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
