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
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = Number(req.query.limit) || 20;
        const category = typeof req.query.category === "string" ? req.query.category : undefined;
        const snapshotTime = typeof req.query.snapshotTime === "string"
            ? new Date(req.query.snapshotTime)
            : new Date();
        const cursorUpdatedAt = typeof req.query.cursorUpdatedAt === "string"
            ? new Date(req.query.cursorUpdatedAt)
            : undefined;
        const cursorId = typeof req.query.cursorId === "string"
            ? Number(req.query.cursorId)
            : undefined;
        const where = {
            updatedAt: {
                lte: snapshotTime,
            },
        };
        if (category) {
            where.category = category;
        }
        if (cursorUpdatedAt && cursorId) {
            where.OR = [
                {
                    updatedAt: {
                        lt: cursorUpdatedAt,
                    },
                },
                {
                    AND: [
                        {
                            updatedAt: cursorUpdatedAt,
                        },
                        {
                            id: {
                                lt: cursorId,
                            },
                        },
                    ],
                },
            ];
        }
        const products = yield db_1.prisma.product.findMany({
            where,
            orderBy: [
                {
                    updatedAt: "desc",
                },
                {
                    id: "desc",
                },
            ],
            take: limit,
        });
        const lastProduct = products[products.length - 1];
        return res.json({
            products,
            snapshotTime: snapshotTime.toISOString(),
            nextCursor: lastProduct
                ? {
                    updatedAt: lastProduct.updatedAt.toISOString(),
                    id: lastProduct.id,
                }
                : null,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
exports.default = router;
