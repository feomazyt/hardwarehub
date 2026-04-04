import { Prisma } from "@prisma/client";

import * as productsRepository from "@/lib/repositories/products.repository";
import type { ProductSort } from "@/types/catalog";
import type {
  ProductDetailsDTO,
  ProductListItemDTO,
  ProductListResponseDTO,
} from "@/types/products";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type ListProductsParams = {
  /** Wiele slugów — OR (produkt w dowolnej z wybranych kategorii) */
  categorySlugs?: string[];
  /** Pojedynczy slug (np. API) — jeśli brak categorySlugs */
  categorySlug?: string | null;
  categoryId?: string | null;
  limit: number;
  offset: number;
  /** Górny limit ceny (włącznie); brak = bez filtra po cenie */
  priceMax?: number;
  sort?: ProductSort;
};

function buildOrderBy(
  sort: ProductSort | undefined
): Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "name_asc":
      return { name: "asc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

function buildListWhere(params: ListProductsParams): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  const slugs =
    params.categorySlugs && params.categorySlugs.length > 0
      ? params.categorySlugs
      : params.categorySlug
        ? [params.categorySlug]
        : [];

  if (slugs.length > 0) {
    where.category = { slug: { in: slugs } };
  } else if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.priceMax !== undefined) {
    where.price = { lte: new Prisma.Decimal(params.priceMax) };
  }

  return where;
}

function toListItemDTO(row: ProductWithCategory): ProductListItemDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price.toString(),
    imageUrl: row.imageUrl,
    stock: row.stock,
    categoryId: row.categoryId,
    category: row.category
      ? {
          id: row.category.id,
          name: row.category.name,
          slug: row.category.slug,
        }
      : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDetailsDTO | null> {
  const row = await productsRepository.findBySlugWithCategory(slug);
  if (!row) return null;
  return toListItemDTO(row);
}

export async function listProducts(
  params: ListProductsParams
): Promise<ProductListResponseDTO> {
  const where = buildListWhere(params);
  const orderBy = buildOrderBy(params.sort);
  const [rows, total] = await Promise.all([
    productsRepository.findManyWithCategory(
      where,
      params.offset,
      params.limit,
      orderBy
    ),
    productsRepository.count(where),
  ]);

  return {
    products: rows.map(toListItemDTO),
    total,
    limit: params.limit,
    offset: params.offset,
  };
}
