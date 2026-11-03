CREATE TYPE "BookingRequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

CREATE TABLE "booking_requests" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "quotedPrice" DECIMAL(16,2) NOT NULL,
    "feeAmount" DECIMAL(10,2) NOT NULL,
    "feeCurrency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "status" "BookingRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "booking_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "booking_requests_idempotencyKey_key" ON "booking_requests"("idempotencyKey");
CREATE INDEX "booking_requests_userId_status_createdAt_idx" ON "booking_requests"("userId", "status", "createdAt");
CREATE INDEX "booking_requests_propertyId_status_createdAt_idx" ON "booking_requests"("propertyId", "status", "createdAt");

ALTER TABLE "booking_requests"
ADD CONSTRAINT "booking_requests_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "booking_requests"
ADD CONSTRAINT "booking_requests_propertyId_fkey"
FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
