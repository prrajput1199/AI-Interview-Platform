/*
  Warnings:

  - You are about to drop the column `InterviewId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId]` on the table `answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `interviewId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_InterviewId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "InterviewId",
ADD COLUMN     "interviewId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "confidence" DROP NOT NULL,
ALTER COLUMN "technical" DROP NOT NULL,
ALTER COLUMN "communication" DROP NOT NULL,
ALTER COLUMN "pdfUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "answer" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "feedback" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "answer_questionId_key" ON "answer"("questionId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer" ADD CONSTRAINT "answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
