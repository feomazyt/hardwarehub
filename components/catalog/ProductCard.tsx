"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogView } from "@/types/catalog";

export type ProductCardProps = {
  slug: string;
  name: string;
  description?: string | null;
  /** Prisma `Decimal` serializes to string; number też OK */
  price: number | string;
  imageUrl?: string | null;
  stock?: number;
  categoryName?: string | null;
  className?: string;
  onAddToCart?: () => void;
  layout?: CatalogView;
};

function formatPrice(value: number | string) {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProductCard({
  slug,
  name,
  description,
  price,
  imageUrl,
  stock = 0,
  categoryName,
  className,
  onAddToCart,
  layout = "grid",
}: ProductCardProps) {
  const outOfStock = stock <= 0;
  const href = `/products/${slug}`;
  const isList = layout === "list";

  const imageBlock = (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-container",
        isList ? "aspect-square rounded-lg" : "aspect-square"
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- zdjęcia z DB (dowolny host)
        <img
          src={imageUrl}
          alt={name}
          className={cn(
            "h-full w-full object-cover opacity-90 transition-transform duration-700",
            !isList && "group-hover:scale-110"
          )}
        />
      ) : (
        <div
          className="flex h-full items-center justify-center text-on-surface-variant"
          aria-hidden
        >
          <span
            className={cn(
              "material-symbols-outlined opacity-30",
              isList ? "text-4xl" : "text-5xl"
            )}
          >
            inventory_2
          </span>
        </div>
      )}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-tertiary/10 px-3 py-1 backdrop-blur-md sm:top-4 sm:left-4">
        <div
          className={cn(
            "size-2 rounded-full shadow-[0_0_8px_var(--color-tertiary)]",
            outOfStock ? "bg-error shadow-[0_0_8px_var(--color-error)]" : "bg-tertiary"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
            outOfStock ? "text-error" : "text-tertiary"
          )}
        >
          {outOfStock ? "Niedostępny" : "Dostępny"}
        </span>
      </div>
    </div>
  );

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container",
        isList
          ? "flex flex-col gap-5 p-4 sm:flex-row sm:items-stretch sm:gap-6"
          : "flex h-full min-h-0 flex-col",
        className
      )}
    >
      <Link
        href={href}
        className={cn(
          "block shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isList ? "w-full sm:w-44 md:w-52" : ""
        )}
      >
        {imageBlock}
      </Link>

      <div
        className={cn(
          "flex min-h-0 flex-col",
          isList
            ? "min-w-0 flex-1 justify-between gap-4 py-0 sm:py-1"
            : "min-h-0 flex-1 p-6"
        )}
      >
        <Link
          href={href}
          className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {categoryName ? (
            <p className="mb-1 text-xs font-medium tracking-wide text-on-surface-variant uppercase">
              {categoryName}
            </p>
          ) : null}
          <h3
            className={cn(
              "headline-font mb-1 font-bold text-on-surface transition-colors group-hover:text-primary",
              isList ? "text-lg sm:text-xl" : "text-xl"
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "text-sm text-on-surface-variant",
              isList ? "line-clamp-3 sm:line-clamp-2" : "line-clamp-2"
            )}
          >
            {description?.trim() ? description.trim() : "\u00A0"}
          </p>
        </Link>

        <div
          className={cn(
            "flex shrink-0 items-center justify-between gap-3",
            isList ? "pt-2 sm:pt-4" : "mt-auto pt-4"
          )}
        >
          <Link
            href={href}
            className={cn(
              "headline-font font-bold text-on-surface tabular-nums transition-colors hover:text-primary",
              isList ? "text-xl sm:text-2xl" : "text-2xl"
            )}
          >
            {formatPrice(price)}
          </Link>
          <Button
            type="button"
            disabled={outOfStock}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.();
            }}
            className="h-auto shrink-0 gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-sm text-on-primary-fixed hover:bg-primary-dim active:scale-95"
          >
            <span className="material-symbols-outlined text-sm leading-none">
              shopping_cart
            </span>
            Dodaj
          </Button>
        </div>
      </div>
    </article>
  );
}
