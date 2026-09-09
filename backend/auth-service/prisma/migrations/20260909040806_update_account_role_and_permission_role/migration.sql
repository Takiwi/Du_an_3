/*
  Warnings:

  - The primary key for the `AccountRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AccountRole` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RolePermission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountRole" DROP CONSTRAINT "AccountRole_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AccountRole_pkey" PRIMARY KEY ("accountId", "roleId");

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("permissionId", "roleId");
