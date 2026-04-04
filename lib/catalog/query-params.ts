import type { CatalogView, ProductSort } from "@/types/catalog";
import { CATALOG_PRICE_SLIDER_MAX } from "@/types/catalog";

const SORT_VALUES: ProductSort[] = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
];

/** Next.js searchParams: pojedynczy lub powtórzony klucz */
export function parseCategorySlugsParam(
  value: string | string[] | undefined
): string[] {
  if (value === undefined) return [];
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .flatMap((p) => p.split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parsePriceMaxParam(
  value: string | null | undefined
): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return undefined;
  return Math.min(Math.max(n, 0), CATALOG_PRICE_SLIDER_MAX);
}

export function parseSortParam(value: string | null | undefined): ProductSort {
  if (value && SORT_VALUES.includes(value as ProductSort)) {
    return value as ProductSort;
  }
  return "newest";
}

export function parseCatalogViewParam(
  value: string | null | undefined
): CatalogView {
  if (value === "list") return "list";
  return "grid";
}
