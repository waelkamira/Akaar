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
    "lng" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "link" TEXT DEFAULT '',
    "hearts" INTEGER NOT NULL DEFAULT 0,
    "userName" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "price" DOUBLE PRECISION,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "image4" TEXT,
    "image5" TEXT,
    "forSell" BOOLEAN NOT NULL DEFAULT false,
    "forRent" BOOLEAN NOT NULL DEFAULT false,
    "forRentDaily" BOOLEAN NOT NULL DEFAULT false,
    "forRentMonthly" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT,
    "town" TEXT,
    "licensePlateNumber" TEXT,
    "new" BOOLEAN NOT NULL DEFAULT false,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "distance" DOUBLE PRECISION,
    "phoneNumber" TEXT,
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
