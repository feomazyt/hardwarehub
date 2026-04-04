import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function findManyWithCategory(
  where: Prisma.ProductWhereInput,
  skip: number,
  take: number,
  orderBy:
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[]
) {
  return prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    skip,
    take,
  });
}

export async function count(where: Prisma.ProductWhereInput) {
  return prisma.product.count({ where });
}

export async function findBySlugWithCategory(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}
