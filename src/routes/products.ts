import { Router } from "express";
import { prisma } from "../db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    const snapshotTime =
      typeof req.query.snapshotTime === "string"
        ? new Date(req.query.snapshotTime)
        : new Date();

    const cursorUpdatedAt =
      typeof req.query.cursorUpdatedAt === "string"
        ? new Date(req.query.cursorUpdatedAt)
        : undefined;

    const cursorId =
      typeof req.query.cursorId === "string"
        ? Number(req.query.cursorId)
        : undefined;

    const where: any = {
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

    const products = await prisma.product.findMany({
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
