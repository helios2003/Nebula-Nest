-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "dir" VARCHAR(255) NOT NULL,
    "install" VARCHAR(255) NOT NULL,
    "build" VARCHAR(255) NOT NULL,
    "output" VARCHAR(255) NOT NULL,
    "logs" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_id_key" ON "Projects"("id");
