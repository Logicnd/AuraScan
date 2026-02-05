-- Add userNumber for Roblox-style numeric IDs
PRAGMA foreign_keys=OFF;

ALTER TABLE "User" ADD COLUMN "userNumber" INTEGER;
CREATE UNIQUE INDEX "User_userNumber_key" ON "User"("userNumber");

PRAGMA foreign_keys=ON;
