-- Schema fixes: ParticipantAlias, ImportSession->User FK, Settlement import link

-- CreateTable
CREATE TABLE "ParticipantAlias" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantAlias_pkey" PRIMARY KEY ("id")
);

-- AlterTable ImportSession: importedBy -> importedById with User FK
ALTER TABLE "ImportSession" DROP COLUMN "importedBy";
ALTER TABLE "ImportSession" ADD COLUMN "importedById" TEXT NOT NULL;

-- AlterTable Settlement: optional import session link
ALTER TABLE "Settlement" ADD COLUMN "importSessionId" TEXT;

-- CreateIndex
CREATE INDEX "ParticipantAlias_alias_idx" ON "ParticipantAlias"("alias");
CREATE UNIQUE INDEX "ParticipantAlias_participantId_alias_key" ON "ParticipantAlias"("participantId", "alias");

-- AddForeignKey
ALTER TABLE "ParticipantAlias" ADD CONSTRAINT "ParticipantAlias_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImportSession" ADD CONSTRAINT "ImportSession_importedById_fkey" FOREIGN KEY ("importedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_importSessionId_fkey" FOREIGN KEY ("importSessionId") REFERENCES "ImportSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
