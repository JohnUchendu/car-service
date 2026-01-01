import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Neon!");

    const count = await prisma.service.count();
    console.log(`📊 Found ${count} services`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

test();