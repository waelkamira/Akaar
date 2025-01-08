-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "propertyName" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "propertyPrice" TEXT NOT NULL,
    "propertyArea" TEXT NOT NULL,
    "propertyCity" TEXT NOT NULL,
    "contactPhoneNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT DEFAULT '',
    "hearts" INTEGER NOT NULL DEFAULT 0,
    "userName" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
