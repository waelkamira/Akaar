-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "propertyCategory" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "propertyRoomsNumber" TEXT,
    "propertyPrice" INTEGER NOT NULL,
    "propertyArea" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "propertyTown" TEXT NOT NULL,
    "contactPhoneNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lng" REAL,
    "lat" REAL,
    "link" TEXT DEFAULT '',
    "hearts" INTEGER NOT NULL DEFAULT 0,
    "userName" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Property_propertyCategory_idx" ON "Property"("propertyCategory");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_propertyRoomsNumber_idx" ON "Property"("propertyRoomsNumber");

-- CreateIndex
CREATE INDEX "Property_propertyPrice_idx" ON "Property"("propertyPrice");

-- CreateIndex
CREATE INDEX "Property_propertyCity_idx" ON "Property"("propertyCity");

-- CreateIndex
CREATE INDEX "Property_propertyTown_idx" ON "Property"("propertyTown");
