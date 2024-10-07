/*
  Warnings:

  - Made the column `enteredById` on table `Entry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statedById` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_enteredById_fkey";

-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_statedById_fkey";

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "enteredById" SET NOT NULL,
ALTER COLUMN "statedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_enteredById_fkey" FOREIGN KEY ("enteredById") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_statedById_fkey" FOREIGN KEY ("statedById") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
