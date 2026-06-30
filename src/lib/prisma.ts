import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    console.warn("No database connection string configured; Prisma client will be unavailable at runtime.");
    return new PrismaClient({ log: ["error"] });
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: ["error"],
    });
  } catch (error) {
    console.error("Failed to initialize Prisma adapter:", error);
    return new PrismaClient({ log: ["error"] });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED);
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}