-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "image5" TEXT,
    "propertyCategory" TEXT,
    "propertyName" TEXT,
    "propertyType" TEXT,
    "propertyRoomsNumber" TEXT,
    "propertyPrice" INTEGER,
    "propertyArea" TEXT,
    "propertyCity" TEXT,
    "propertyTown" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT,
    "lng" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "link" TEXT DEFAULT '',
    "hearts" INTEGER DEFAULT 0,
    "userName" TEXT,
    "userImage" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "userName" TEXT,
    "userImage" TEXT,
    "adType" TEXT,
    "title" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "usedNew" TEXT,
    "year" INTEGER,
    "price" INTEGER,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "image5" TEXT,
    "city" TEXT,
    "town" TEXT,
    "description" TEXT,
    "distance" INTEGER,
    "phoneNumber" TEXT,
    "lng" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "link" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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

-- CreateIndex
CREATE INDEX "Car_brand_idx" ON "Car"("brand");

-- CreateIndex
CREATE INDEX "Car_model_idx" ON "Car"("model");

-- CreateIndex
CREATE INDEX "Car_year_idx" ON "Car"("year");

-- CreateIndex
CREATE INDEX "Car_price_idx" ON "Car"("price");

-- CreateIndex
CREATE INDEX "Car_city_idx" ON "Car"("city");

-- CreateIndex
CREATE INDEX "Car_town_idx" ON "Car"("town");
