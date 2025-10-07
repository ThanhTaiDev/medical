/*
  Warnings:

  - You are about to drop the column `majorDoctor` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientMedicalHistory" ADD COLUMN     "extras" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "majorDoctor",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "majorDoctorId" TEXT;

-- CreateTable
CREATE TABLE "MajorDoctorTable" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MajorDoctorTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MajorDoctorTable_code_key" ON "MajorDoctorTable"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_majorDoctorId_fkey" FOREIGN KEY ("majorDoctorId") REFERENCES "MajorDoctorTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
