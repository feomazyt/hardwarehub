"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import {
  CATALOG_PRICE_SLIDER_MAX,
  PRODUCT_SORT_OPTIONS,
  type ProductSort,
} from "@/types/catalog";

export type CatalogCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type ProductCatalogFiltersProps = {
  categories: CatalogCategoryOption[];
  selectedSlugs: string[];
  /** Z URL: brak = brak filtra po cenie (traktuj jak max) */
  priceMaxFilter?: number;
  sort: ProductSort;
};

export function ProductCatalogFilters({
  categories,
  selectedSlugs,
  priceMaxFilter,
  sort,
}: ProductCatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localPriceMax, setLocalPriceMax] = useState(
    () => priceMaxFilter ?? CATALOG_PRICE_SLIDER_MAX
  );

  const buildParams = useCallback(
    (partial: {
      slugs?: string[];
      priceMax?: number;
      sort?: ProductSort;
    }) => {
      const slugs = partial.slugs ?? selectedSlugs;
      const pm =
        partial.priceMax !== undefined
          ? partial.priceMax
          : (priceMaxFilter ?? CATALOG_PRICE_SLIDER_MAX);
      const s = partial.sort ?? sort;
      const params = new URLSearchParams(searchParams.toString());
      if (slugs.length > 0) params.set("categories", slugs.join(","));
      else params.delete("categories");
      if (pm < CATALOG_PRICE_SLIDER_MAX) params.set("priceMax", String(pm));
      else params.delete("priceMax");
      if (s !== "newest") params.set("sort", s);
      else params.delete("sort");
      return params;
    },
    [priceMaxFilter, searchParams, selectedSlugs, sort]
  );

  const commit = useCallback(
    (params: URLSearchParams) => {
      const q = params.toString();
      startTransition(() => {
        router.push(q ? `${pathname}?${q}` : pathname);
      });
    },
    [pathname, router]
  );

  const toggleSlug = (slug: string) => {
    const next = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((s) => s !== slug)
      : [...selectedSlugs, slug];
    commit(buildParams({ slugs: next }));
  };

  const handleSortChange = (value: ProductSort) => {
    commit(buildParams({ sort: value }));
  };

  const handlePricePointerUp = () => {
    commit(buildParams({ priceMax: localPriceMax }));
  };

  return (
    <aside
      className={`hidden w-72 shrink-0 lg:block ${isPending ? "opacity-70" : ""}`}
    >
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="headline-font mb-6 text-lg font-bold tracking-tight text-primary uppercase">
            Kategorie
          </h3>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Brak kategorii</p>
            ) : (
              categories.map((cat) => (
                <label
                  key={cat.id}
                  className="group flex cursor-pointer items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedSlugs.includes(cat.slug)}
                    onChange={() => toggleSlug(cat.slug)}
                    className="h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <span className="text-on-surface-variant transition-colors group-hover:text-on-surface">
                    {cat.name}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/15 pt-6">
          <h3 className="headline-font mb-6 text-lg font-bold tracking-tight text-primary uppercase">
            Zakres cen
          </h3>
          <div className="space-y-4">
            <input
              type="range"
              min={0}
              max={CATALOG_PRICE_SLIDER_MAX}
              step={100}
              value={localPriceMax}
              onChange={(e) =>
                setLocalPriceMax(Number.parseInt(e.target.value, 10))
              }
              onPointerUp={handlePricePointerUp}
              onKeyUp={(e) => {
                if (e.key === "Enter") handlePricePointerUp();
              }}
              aria-label="Maksymalna cena"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest accent-primary"
            />
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="rounded border border-outline-variant/20 bg-surface-container-low px-3 py-1">
                0 zł
              </span>
              <span className="rounded border border-outline-variant/20 bg-surface-container-low px-3 py-1">
                {CATALOG_PRICE_SLIDER_MAX.toLocaleString("pl-PL")} zł
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/15 pt-6">
          <h3 className="headline-font mb-6 text-lg font-bold tracking-tight text-primary uppercase">
            Sortowanie
          </h3>
          <select
            value={sort}
            onChange={(e) =>
              handleSortChange(e.target.value as ProductSort)
            }
            aria-label="Sortowanie listy produktów"
            className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-low px-4 py-2 text-on-surface-variant focus:border-primary focus:ring-primary"
          >
            {PRODUCT_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
