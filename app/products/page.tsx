import Link from "next/link";
import { Suspense } from "react";

import { ProductCard, ProductCatalogFilters, ProductCatalogViewToggle } from "@/components/catalog";
import {
  parseCatalogViewParam,
  parseCategorySlugsParam,
  parsePriceMaxParam,
  parseSortParam,
} from "@/lib/catalog/query-params";
import { listCategories } from "@/lib/services/categories.service";
import { listProducts } from "@/lib/services/products.service";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstQueryValue(
  value: string | string[] | undefined
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const q = await searchParams;
  const categorySlugs = parseCategorySlugsParam(q.categories);
  const priceMax = parsePriceMaxParam(firstQueryValue(q.priceMax));
  const sort = parseSortParam(firstQueryValue(q.sort));
  const view = parseCatalogViewParam(firstQueryValue(q.view));

  let categories;
  let data;
  try {
    [categories, data] = await Promise.all([
      listCategories(),
      listProducts({
        categorySlugs:
          categorySlugs.length > 0 ? categorySlugs : undefined,
        limit: 100,
        offset: 0,
        priceMax,
        sort,
      }),
    ]);
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-on-surface-variant">
          Nie udało się załadować katalogu. Spróbuj ponownie później.
        </p>
      </div>
    );
  }

  const { products, total } = data;
  const shown = products.length;

  const filtersFallback = (
    <aside className="hidden w-72 shrink-0 lg:block" aria-hidden />
  );

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 pt-4 lg:px-8">
      <Suspense fallback={filtersFallback}>
        <ProductCatalogFilters
          key={`${[...categorySlugs].sort().join(",")}-${priceMax ?? "all"}-${sort}`}
          categories={categories}
          selectedSlugs={categorySlugs}
          priceMaxFilter={priceMax}
          sort={sort}
        />
      </Suspense>
      <section className="flex-1 pb-20">
        <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <h1 className="headline-font mb-2 text-5xl font-extrabold tracking-tighter text-on-surface">
              KATALOG
            </h1>
            <p className="font-medium text-on-surface-variant">
              {total === 0
                ? "Brak produktów w bazie"
                : `Wyświetlanie ${shown} z ${total} ${total === 1 ? "przedmiotu" : "przedmiotów"}`}
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex h-9 gap-2" aria-hidden>
                <div className="size-9 rounded-md border border-border bg-muted" />
                <div className="size-9 rounded-md border border-border bg-muted" />
              </div>
            }
          >
            <ProductCatalogViewToggle view={view} />
          </Suspense>
        </div>
        {products.length === 0 ? (
          <p className="text-on-surface-variant">
            Brak produktów dla wybranych filtrów. Zmień kryteria lub{" "}
            <Link href="/products" className="text-primary underline">
              wyczyść filtry
            </Link>
            .
          </p>
        ) : (
          <div
            className={
              view === "list"
                ? "flex flex-col gap-4"
                : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            }
          >
            {products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                description={p.description}
                price={p.price}
                imageUrl={p.imageUrl}
                stock={p.stock}
                categoryName={p.category?.name ?? null}
                layout={view}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
