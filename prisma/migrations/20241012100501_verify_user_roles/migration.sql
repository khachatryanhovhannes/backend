/*
  Warnings:

  - You are about to drop the column `permissionId` on the `users` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `permissionId`,
    ADD COLUMN `roleId` INTEGER NOT NULL;
