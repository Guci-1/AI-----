import { PrismaClient } from "@prisma/client";

// PrismaClient 单例（全进程共享一个连接池）
export const prisma = new PrismaClient();
