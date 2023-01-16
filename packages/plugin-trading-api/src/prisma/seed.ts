import { PrismaClient } from '@prisma/client';
import { migrationStock } from './seeds/stock';
const prisma = new PrismaClient();
async function seed() {
  if ((await prisma.stock.count()) == 0) {
    let stock: any = migrationStock();
    await prisma.stock.createMany({
      data: stock
    });
  }
}
seed();
