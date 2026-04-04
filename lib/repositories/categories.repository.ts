import { prisma } from "@/lib/db";

export async function findAllOrderedByName() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}
