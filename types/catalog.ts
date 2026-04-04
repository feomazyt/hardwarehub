export type ProductSort = "newest" | "price_asc" | "price_desc" | "name_asc";

/** Domyślnie `grid`; `view=list` w query */
export type CatalogView = "grid" | "list";

export const CATALOG_PRICE_SLIDER_MAX = 10000;

export const PRODUCT_SORT_OPTIONS: {
  value: ProductSort;
  label: string;
}[] = [
  { value: "price_asc", label: "Cena: Od najniższej" },
  { value: "price_desc", label: "Cena: Od najwyższej" },
  { value: "newest", label: "Najnowsze" },
  { value: "name_asc", label: "Nazwa: A-Z" },
];
