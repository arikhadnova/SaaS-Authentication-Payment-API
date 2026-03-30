const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Starter Plan',
        description: 'Perfect for individuals',
        price: 50000
      },
      {
        name: 'Pro Plan',
        description: 'Perfect for small teams',
        price: 150000
      },
      {
        name: 'Enterprise Plan',
        description: 'Perfect for large teams',
        price: 500000
      }
    ]
  });

  console.log('Products seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());