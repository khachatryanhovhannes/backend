/*
  Warnings:

  - You are about to drop the `role_on_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_on_user` DROP FOREIGN KEY `role_on_user_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `role_on_user` DROP FOREIGN KEY `role_on_user_userId_fkey`;

-- DropTable
DROP TABLE `role_on_user`;
