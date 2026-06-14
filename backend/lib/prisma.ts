import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalThis.prisma) {
    const adapter = new PrismaPg({ connectionString });
    globalThis.prisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.prisma;
}

export { prisma };