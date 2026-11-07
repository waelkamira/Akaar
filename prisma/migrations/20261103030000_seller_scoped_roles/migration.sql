DROP INDEX "roles_name_key";

ALTER TABLE "roles"
  ADD COLUMN "sellerId" UUID;

CREATE UNIQUE INDEX "roles_sellerId_name_key" ON "roles"("sellerId", "name");
CREATE INDEX "roles_sellerId_idx" ON "roles"("sellerId");

ALTER TABLE "roles"
  ADD CONSTRAINT "roles_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "sellers"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
