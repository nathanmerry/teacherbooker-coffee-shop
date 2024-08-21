import { PrismaClient } from '@prisma/client';
import db from './db';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding coffee types...');

  const coffeeTypes = [
    {
      key: 'latte',
      name: 'Latte',
      price: 4,
      ingredients: {
        sugar: 2,
        milk: 2,
        cream: 0,
        espressoShots: 1,
        foam: 1
      }
    },
    {
      key: 'macchiato',
      name: 'Macchiato',
      price: 4.5,
      ingredients: {
        sugar: 1,
        milk: 1,
        cream: 0,
        espressoShots: 1,
        foam: 1
      }
    },
    {
      key: 'espresso',
      name: 'Espresso',
      price: 3,
      ingredients: {
        sugar: 0,
        milk: 0,
        cream: 0,
        espressoShots: 1
      }
    },
    {
      key: 'americano',
      name: 'Americano',
      price: 3.5,
      ingredients: {
        sugar: 0,
        milk: 0,
        cream: 0,
        espressoShots: 1,
        hotWater: 2
      }
    },
    {
      key: 'flatWhite',
      name: 'Flat White',
      price: 4.2,
      ingredients: {
        sugar: 1,
        milk: 2,
        cream: 0,
        espressoShots: 1,
        foam: 0.5
      }
    }
  ];

  for (const coffee of coffeeTypes) {
    const { name, key, ingredients } = coffee;
    await db.coffeeType.create({ data: coffee });
  }

  console.log('Coffee types seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
