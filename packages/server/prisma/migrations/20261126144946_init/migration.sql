-- CreateTable
CREATE TABLE "Discussion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "expertCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "consensus" TEXT,
    "summary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discussionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "stance" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "systemPrompt" TEXT,
    CONSTRAINT "Participant_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discussionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Participant_discussionId_idx" ON "Participant"("discussionId");

-- CreateIndex
CREATE INDEX "Event_discussionId_id_idx" ON "Event"("discussionId", "id");
