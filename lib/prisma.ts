


// // /lib/prisma.ts
// import "dotenv/config";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from ".prisma/client";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set in .env");
// }

// // Create the connection pool
// const pool = new Pool({ 
//   connectionString,
//   max: 20, // Maximum number of clients in the pool
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Create the adapter
// const adapter = new PrismaPg(pool);

// // Type-safe global variable for Prisma
// const globalForPrisma = global as unknown as {
//   prisma: PrismaClient | undefined;
// };

// // Initialize Prisma Client with the adapter
// const prismaClientOptions: any = {
//   adapter: adapter,
// };

// // Add logging only in development
// if (process.env.NODE_ENV === "development") {
//   prismaClientOptions.log = ["query", "error", "warn"];
// }

// // Create or reuse Prisma Client instance
// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient(prismaClientOptions);

// // Store in global variable in development to prevent hot-reload issues
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// // Optional: Add connection testing
// export async function testConnection() {
//   try {
//     await pool.query('SELECT 1');
//     console.log('Database connection pool is working');
//     return true;
//   } catch (error) {
//     console.error('Database connection failed:', error);
//     return false;
//   }
// }






// /lib/prisma.ts
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env")
}

// Create the connection pool with better timeout settings
const pool = new Pool({ 
  connectionString,
  max: 10, // Reduced from 20
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2000
  maxUses: 7500,
  allowExitOnIdle: true
})

// Create the adapter
const adapter = new PrismaPg(pool)

// Type-safe global variable for Prisma
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma Client with the adapter
const prismaClientOptions: any = {
  adapter: adapter,
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
}

// Create or reuse Prisma Client instance
export const prisma = globalForPrisma.prisma || new PrismaClient(prismaClientOptions)

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Test connection helper
export async function testConnection() {
  try {
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
  await pool.end()
})