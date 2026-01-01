// import "dotenv/config"; // Loads .env early
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set");
// }

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// export default prisma;



// // /lib/prisma.ts
// import "dotenv/config"; // Load env vars early if not already
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set in .env");
// }

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     adapter,
//     log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;



// /lib/prisma.ts
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from ".prisma/client";
const { PrismaClient } = require(".prisma/client");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

// Create the connection pool
const pool = new Pool({ 
  connectionString,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Type-safe global variable for Prisma
const globalForPrisma = global as unknown as {
  prisma: typeof PrismaClient | undefined;
};

// Initialize Prisma Client with the adapter
const prismaClientOptions: any = {
  adapter: adapter,
};

// Add logging only in development
if (process.env.NODE_ENV === "development") {
  prismaClientOptions.log = ["query", "error", "warn"];
}

// Create or reuse Prisma Client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions);

// Store in global variable in development to prevent hot-reload issues
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional: Add connection testing
export async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection pool is working');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}