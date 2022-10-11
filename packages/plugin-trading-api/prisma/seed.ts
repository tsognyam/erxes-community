import { PrismaClient } from "@prisma/client";
import { ordertype } from "./seeds/ordertype";
import { stocktype } from "./seeds/stocktype";
import { migrationStock } from "./seeds/stock";
import { exchange } from "./seeds/exchange";
import { banks } from "./seeds/bank";
const prisma = new PrismaClient();
async function seed() {
    if (await prisma.exchange.count() == 0)
        await prisma.exchange.createMany({
            data: exchange
        })
    if (await prisma.ordertype.count() == 0)
        await prisma.ordertype.createMany({
            data: ordertype
        })
    if (await prisma.stocktype.count() == 0)
        await prisma.stocktype.createMany({
            data: stocktype
        })
    if (await prisma.stock.count() == 0) {
        let stock: any = migrationStock();
        await prisma.stock.createMany({
            data: stock
        })
    }
    if (await prisma.bank.count() == 0) {
        await prisma.bank.createMany({
            data: banks
        })
    }
}
seed()