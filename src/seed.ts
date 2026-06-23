import { prisma } from "./db";

const categories = ["Electronics", "Books", "Clothing", "Sports", "Home"];

const TOTAL = 200000;
const BATCH_SIZE = 5000;

async function seed() {
  console.log("Deleting old data...");

  await prisma.product.deleteMany();

  let created = 0;

  while (created < TOTAL) {
    const batch = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const randomDay = Math.floor(Math.random() * 365);

      const date = new Date(Date.now() - randomDay * 24 * 60 * 60 * 1000);

      batch.push({
        name: `Product ${created + i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Number((Math.random() * 10000).toFixed(2)),
        createdAt: date,
        updatedAt: date,
      });
    }

    await prisma.product.createMany({
      data: batch,
    });

    created += BATCH_SIZE;

    console.log(`${created}/${TOTAL}`);
  }

  console.log("Done");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
