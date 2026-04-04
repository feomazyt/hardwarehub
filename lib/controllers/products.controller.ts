import { NextResponse } from "next/server";

import {
  parseCategorySlugsParam,
  parsePriceMaxParam,
  parseSortParam,
} from "@/lib/catalog/query-params";
import * as productsService from "@/lib/services/products.service";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseLimit(value: string | null): number {
  const n = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(n)) return DEFAULT_LIMIT;
  return Math.min(Math.max(n, 1), MAX_LIMIT);
}

function parseOffset(value: string | null): number {
  const n = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return n;
}

export async function getProductList(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlugs = parseCategorySlugsParam(
      searchParams.get("categories") ?? undefined
    );
    const legacySlug = searchParams.get("categorySlug");

    const data = await productsService.listProducts({
      categorySlugs:
        categorySlugs.length > 0
          ? categorySlugs
          : legacySlug
            ? [legacySlug]
            : undefined,
      categoryId: searchParams.get("categoryId"),
      limit: parseLimit(searchParams.get("limit")),
      offset: parseOffset(searchParams.get("offset")),
      priceMax: parsePriceMaxParam(searchParams.get("priceMax")),
      sort: parseSortParam(searchParams.get("sort")),
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[products.controller getProductList]", e);
    return NextResponse.json(
      { error: "Nie udało się pobrać produktów." },
      { status: 500 }
    );
  }
}
