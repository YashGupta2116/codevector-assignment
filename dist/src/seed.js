"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const categories = ["Electronics", "Books", "Clothing", "Sports", "Home"];
const TOTAL = 200000;
const BATCH_SIZE = 5000;
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Deleting old data...");
        yield db_1.prisma.product.deleteMany();
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
            yield db_1.prisma.product.createMany({
                data: batch,
            });
            created += BATCH_SIZE;
            console.log(`${created}/${TOTAL}`);
        }
        console.log("Done");
    });
}
seed()
    .catch(console.error)
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.prisma.$disconnect();
}));
