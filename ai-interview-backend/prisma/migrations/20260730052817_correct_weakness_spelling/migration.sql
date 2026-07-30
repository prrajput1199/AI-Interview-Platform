/*
  Warnings:

  - You are about to drop the column `weekness` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "weekness",
ADD COLUMN     "weaknesses" TEXT[];
