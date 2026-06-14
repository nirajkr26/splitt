/*
  Warnings:

  - You are about to drop the column `importedBy` on the `ImportSession` table. All the data in the column will be lost.
  - Added the required column `importedById` to the `ImportSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportSession" DROP COLUMN "importedBy",
ADD COLUMN     "importedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Settlement" ADD COLUMN     "importSessionId" TEXT;

-- CreateTable
CREATE TABLE "ParticipantAlias" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantAlias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParticipantAlias_alias_idx" ON "ParticipantAlias"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantAlias_participantId_alias_key" ON "ParticipantAlias"("participantId", "alias");

-- AddForeignKey
ALTER TABLE "ParticipantAlias" ADD CONSTRAINT "ParticipantAlias_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_importSessionId_fkey" FOREIGN KEY ("importSessionId") REFERENCES "ImportSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportSession" ADD CONSTRAINT "ImportSession_importedById_fkey" FOREIGN KEY ("importedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
