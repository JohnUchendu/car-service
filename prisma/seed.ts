// prisma/seed.ts
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.service.createMany({
    data: [
      {
        name: "Oil Change + Filter",
        description: "Full synthetic oil + filter replacement",
        price: 35000,
        duration: 45,
        active: true,
      },
      {
        name: "Full Car Wash & Wax",
        description: "Exterior wash, clay bar, wax polish",
        price: 15000,
        duration: 60,
        active: true,
      },
      {
        name: "Engine Bay Cleaning",
        description: "Degrease + steam clean engine compartment",
        price: 25000,
        duration: 90,
        active: true,
      },
    ],
  });
  console.log("🌱 Seeded 3 services!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());