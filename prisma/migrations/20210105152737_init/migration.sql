-- CreateTable
CREATE TABLE "User" (
"id" SERIAL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT E'',
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
