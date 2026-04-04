"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { CatalogView } from "@/types/catalog";

type ProductCatalogViewToggleProps = {
  view: CatalogView;
};

export function ProductCatalogViewToggle({
  view,
}: ProductCatalogViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setView = useCallback(
    (next: CatalogView) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "grid") {
        params.delete("view");
      } else {
        params.set("view", "list");
      }
      const q = params.toString();
      startTransition(() => {
        router.push(q ? `${pathname}?${q}` : pathname);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className={`flex gap-2 ${isPending ? "opacity-70" : ""}`}>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => setView("grid")}
        className={
          view === "grid"
            ? "border-primary/20 bg-surface-container-high text-primary hover:bg-surface-container-high"
            : "border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest"
        }
        aria-label="Widok siatki"
        aria-pressed={view === "grid"}
      >
        <span className="material-symbols-outlined leading-none">
          grid_view
        </span>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={() => setView("list")}
        className={
          view === "list"
            ? "border-primary/20 bg-surface-container-high text-primary hover:bg-surface-container-high"
            : "border-outline-variant/10 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest"
        }
        aria-label="Widok listy"
        aria-pressed={view === "list"}
      >
        <span className="material-symbols-outlined leading-none">
          view_list
        </span>
      </Button>
    </div>
  );
}
