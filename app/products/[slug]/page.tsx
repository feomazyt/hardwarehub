import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/services/products.service";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function formatPrice(value: string) {
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const currentPrice = formatPrice(product.price);
  const previousPrice = formatPrice((Number.parseFloat(product.price) + 800).toFixed(2));
  const categoryName = product.category?.name ?? "Komponenty";
  const categorySlug = product.category?.slug;
  const mainImage =
    product.imageUrl ??
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAEIyVeA4wNwoO8_F2BmacWo9vL6YWrlNNPR3mn1gXmrDHsAClMU0E-fThj5Py9mpdXBkqeYnsRu9Supd1A7_QT8AvurTaPW8QamVlg-ZsqvyD4cg53OMVrZ8Tsm6kE4kzzll4-69UgmxlxXTsE0G4-VduNLTC9OwuQSM94a2K1NpFylXBpmf6QrRxUnBiXvlU7KVaW5fQyVV_YBkCjXUw-d-r_9HCqFGqBy_bnYjwy7uvf-nOa0wRtx0es4JpDPD6gAXmya5WjuA0";

  const galleryThumbs = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDuLJQykM3A4xeiCx2crGX2qRKxQuI5YHHuqeTL1F4cgbKApxXsU7C2McQyf-a2UyBvI0C3ia7tPA5v81dQLOS399j9lQnPAPEoXpb87Cpiomg_Fiy4nDQ_yhU3fuDxl9mmDLdDdg-3TdCGzQxEDek0rzxWLF5HJDxiuVQIteWV9_djpZo2QCeXHc4x-KsuuUFm4WDkFefMWY5n-rtyX2CmWQc5dI8QOGOn2cNNlbK3a0do1FovkbiHBiF_JR0JyCxLNhACLPCXx_g",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDB_NY2ukRfTzqklYUfyU1ImwkvsqugnIqOlFac0t0sRgmpXILy5wL6DuBiq-Ue-BOynEk23swdiHR6CdqHIm7ewKVN6MGcPMKofBVmYaXMi0cso5qCZ6KBRRAJkOtsHi4l0vs0m69gQg-qJ1ebtuwrv_8czq0EHjAAa5jVFs7EL4PWsxdQcoGzCL7qow1OUFtL-Y-daMhX67BrckUa6xwg4FHE-2uNEzbcfDWRQa2U3qU_ED-C0b879ncB5I3UwyEkx8o00o-Lm_U",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDO0z2xc-Z8ginX3DhkUqpBV0Rceq3uRqVUMsBmnRladODNkpVRQ3DVaIZ4OciQ_wC-PBYpeqpmaHiYwXir5UyCDQzr6vBATK3shhqaxc8mmMK9T9TonZOsitWtiQguqUA05ifqYlI3qaEfBq2wZwiGYINcY6bEqGdP25wOD5bXucM2eqDhkriTZAYRQoMcrOjkU1D_P3tjv8qEbe4aHQSM2gRSfNxB4sUwg7llDj1X8BwHlhytRficdR6Rxm_sLO47RZ7X4A-79Yo",
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 md:px-8">
      <nav className="mb-12 flex items-center gap-2 text-xs font-medium tracking-widest text-on-surface-variant uppercase">
        <Link href="/products" className="transition-colors hover:text-primary">
          Katalog
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/products" className="transition-colors hover:text-primary">
          Komponenty
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface">{categoryName}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="group aspect-[4/3] cursor-crosshair overflow-hidden bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={product.name}
              src={mainImage}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryThumbs.map((src, i) => (
              <div
                key={src}
                className={
                  i === 0
                    ? "aspect-square cursor-pointer border-2 border-primary-dim bg-surface-container p-1"
                    : "aspect-square cursor-pointer bg-surface-container transition-colors hover:bg-surface-container-high"
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`Podglad ${i + 1}`}
                  src={src}
                  className={`h-full w-full object-cover ${i === 2 ? "opacity-60" : ""}`}
                />
              </div>
            ))}
            <div className="group flex aspect-square cursor-pointer items-center justify-center bg-surface-container transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                play_circle
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-tertiary">
                {[0, 1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                ))}
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="ml-2 text-xs font-bold text-on-surface">
                  4.8 (124 opinii)
                </span>
              </div>
            </div>

            <h1 className="headline-font mb-4 text-4xl leading-none font-bold tracking-tighter text-on-surface md:text-5xl">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="headline-font text-3xl font-bold text-primary">
                {currentPrice}
              </span>
              <span className="text-lg text-on-surface-variant line-through decoration-error/50">
                {previousPrice}
              </span>
            </div>
          </div>

          <div className="space-y-4 border-y border-outline-variant/15 py-6">
            <p className="text-sm leading-relaxed text-on-surface-variant">
              {product.description ??
                "Szczytowe osiagniecie inzynierii. Karta wyposazona w architekture najnowszej generacji, oferujaca bezprecedensowa wydajnosc w ray tracingu i zadaniach AI."}
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-on-surface">24GB pamieci GDDR6X</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-on-surface">System chlodzenia Vapor Chamber 2.0</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-on-surface">Technologia DLSS 3 Frame Generation</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(142,255,113,0.5)]" />
                <span className="text-sm font-medium text-tertiary">
                  {product.stock > 0 ? "Dostepny w magazynie" : "Niedostepny"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span className="text-xs font-medium">Wysylka w 24h</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-14 items-center rounded-md border border-outline-variant/10 bg-surface-container">
                <button type="button" className="px-4 text-on-surface transition-colors hover:text-primary">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="headline-font w-10 text-center font-bold">1</span>
                <button type="button" className="px-4 text-on-surface transition-colors hover:text-primary">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <button
                type="button"
                className="headline-font flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-dim text-sm font-bold tracking-wide text-on-primary-fixed shadow-[0_0_20px_rgba(0,212,236,0.2)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">shopping_basket</span>
                DODAJ DO KOSZYKA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 border-t border-outline-variant/15 pt-4 text-xs">
            <div>
              <span className="mb-1 block text-on-surface-variant">Kategoria</span>
              <span className="font-medium text-on-surface">{categoryName}</span>
            </div>
            <div>
              <span className="mb-1 block text-on-surface-variant">SKU</span>
              <span className="font-medium text-on-surface">
                {`MONO-${product.id.slice(0, 8).toUpperCase()}`}
              </span>
            </div>
            <div className="col-span-2 mt-4 flex items-center gap-4 rounded-lg border border-primary/5 bg-surface-container-low px-6 py-4">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <div>
                <span className="block text-[10px] font-bold tracking-widest text-on-surface uppercase">
                  Gwarancja 36 Miesiecy
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  Door-to-door premium service
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-10 md:col-span-2">
          <div className="absolute top-0 right-0 rotate-12 scale-150 p-8 opacity-10 transition-transform duration-700 group-hover:rotate-0">
            <span className="material-symbols-outlined text-[120px] text-primary">reviews</span>
          </div>
          <h3 className="headline-font mb-8 text-2xl font-bold">Opinie Uzytkownikow</h3>
          <div className="relative z-10 space-y-8">
            <div className="border-b border-outline-variant/15 pb-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold">Tomasz K.</span>
                <span className="text-xs text-on-surface-variant">2 dni temu</span>
              </div>
              <div className="mb-3 flex text-tertiary">
                {[0, 1, 2, 3, 4].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-xs"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-on-surface-variant italic">
                &quot;Karta jest niesamowicie cicha nawet pod pelnym obciazeniem.
                Renderowanie 3D skrocilo sie o polowe. Warto bylo kazdej zlotowki.&quot;
              </p>
            </div>
            <button type="button" className="group/btn flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
              Pokaz wszystkie opinie
              <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-surface-container p-10">
          <div>
            <h3 className="headline-font mb-4 text-2xl font-bold text-primary">4.8 / 5</h3>
            <div className="space-y-3">
              {[85, 12, 3, 0, 0].map((v, idx) => (
                <div className="flex items-center gap-4" key={v + idx}>
                  <span className="w-4 text-[10px] text-on-surface-variant">
                    {5 - idx}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                    <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="mt-8 border border-outline-variant/30 py-4 text-xs font-bold tracking-widest uppercase transition-colors hover:bg-surface-container-highest"
          >
            Napisz opinie
          </button>
        </div>
      </div>

      {categorySlug ? (
        <div className="mt-8">
          <Link
            href={`/products?categories=${categorySlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Wroc do listy kategorii
          </Link>
        </div>
      ) : null}
    </main>
  );
}
