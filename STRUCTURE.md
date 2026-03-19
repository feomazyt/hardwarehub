# Struktura projektu HardwareHub

Dokument opisuje strukturę folderów i plików oraz uzasadnienie przyjętych decyzji (zgodnie z planem e-commerce i konwencjami Next.js App Router).

---

## Drzewo katalogów

```
hardwarehub/
├── app/                          # App Router – strony i trasy
│   ├── layout.tsx, page.tsx      # (istniejące) strona główna, główny layout
│   ├── products/
│   │   ├── page.tsx              # Katalog produktów
│   │   └── [slug]/page.tsx       # Strona pojedynczego produktu
│   ├── cart/page.tsx             # Koszyk
│   ├── checkout/page.tsx         # Checkout (podsumowanie, płatność)
│   ├── order/
│   │   ├── success/page.tsx       # Sukces płatności (Stripe success_url)
│   │   └── cancel/page.tsx       # Anulowanie (Stripe cancel_url)
│   ├── search/page.tsx           # Wyniki wyszukiwania
│   ├── admin/                    # Panel administracyjny (chroniony)
│   │   ├── layout.tsx            # Layout admina (nawigacja, ochrona)
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx          # Lista produktów
│   │   │   ├── new/page.tsx      # Nowy produkt
│   │   │   └── [id]/edit/page.tsx # Edycja produktu
│   │   ├── orders/page.tsx       # Lista zamówień
│   │   └── reviews/page.tsx      # Kolejka recenzji do zatwierdzenia
│   ├── api/                      # Route Handlers (REST)
│   │   ├── checkout/route.ts     # POST – tworzenie Stripe Checkout Session
│   │   ├── webhooks/stripe/route.ts # POST – webhook Stripe (checkout.session.completed)
│   │   └── products/[id]/reviews/route.ts # POST – dodawanie recenzji
│   ├── sitemap.ts                # Dynamiczny sitemap (SEO)
│   └── robots.ts                 # robots.txt (SEO)
├── components/
│   ├── ui/                       # Komponenty UI (przyciski, inputy, karty)
│   ├── layout/                   # Header, Footer, nawigacja
│   ├── catalog/                  # ProductCard, ProductList, CategoryNav
│   └── cart/                     # CartProvider, CartIcon, CartDrawer
├── lib/
│   ├── db/                       # Prisma client, zapytania
│   ├── stripe/                   # Klient Stripe, helpery płatności
│   ├── redis/                    # Klient Redis (cache, sesja/koszyk)
│   └── auth/                     # Autoryzacja admina, sesja, JWT/cookies
├── types/                        # Typy TypeScript (modele, API)
├── public/                       # (istniejące) assety statyczne
├── middleware.ts                 # Ochrona /admin, ewent. rate limiting
└── STRUCTURE.md                  # Ten plik
```

---

## Dlaczego taka struktura?

### 1. `app/` – App Router (Next.js)

- **Jedna baza dla routingu i layoutów:** W App Router każdy folder z `page.tsx` to trasa; `layout.tsx` dzieli się między dziećmi. Dzięki temu mamy jeden spójny model: strony sklepu, admina i API w jednym drzewie.
- **Strony sklepu (products, cart, checkout, order):** Odzwierciedlają flow użytkownika: katalog → koszyk → checkout → sukces/anulowanie. Trasy typu `products/[slug]` i `order/success` są standardem w Next.js i ułatwiają późniejsze dodanie `generateMetadata` i SEO.
- **`admin/` jako osobna „aplikacja” pod `/admin`:** Wszystko pod jednym prefiksem ułatwia ochronę w **middleware** (jedna reguła dla `/admin/*`). Wspólny `admin/layout.tsx` to miejsce na menu boczne i sprawdzanie sesji admina.
- **`admin/products/new` i `admin/products/[id]/edit`:** Zgodnie z planem: osobne trasy na tworzenie i edycję zamiast jednej strony z parametrem `?mode=edit` – czytelniejsze URL-e i prostsza logika w komponentach.
- **`api/` – Route Handlers:** Next.js nie wymaga osobnego serwera; endpointy REST są w `app/api/.../route.ts`. Struktura `checkout`, `webhooks/stripe`, `products/[id]/reviews` wynika z planu (Stripe Checkout, webhook, recenzje) i ułatwia późniejsze dodanie kolejnych (np. wyszukiwanie, PayPal).
- **`sitemap.ts` i `robots.ts`:** Konwencja Next.js dla plików metadata (SEO). Są w `app/`, żeby framework mógł je automatycznie serwować pod `/sitemap.xml` i `/robots.txt`.

### 2. `components/` – podział po domenie

- **`ui/`:** Komponenty „bez kontekstu” – przyciski, pola formularzy, karty, modale. Reużywalne w całej aplikacji i łatwe do testowania. Często tu trafiają też wrapperki na headless UI (np. Radix).
- **`layout/`:** Elementy szkieletu strony: Header (z nawigacją i ikoną koszyka), Footer, ewent. Sidebar. Rozdzielenie od `ui/` pozwala zmieniać layout bez mieszania z atomami (przycisk, input).
- **`catalog/`:** Komponenty związane z katalogiem: lista produktów, karta produktu, nawigacja kategorii. Domena „katalog” w jednym miejscu ułatwia późniejsze dodanie filtrów, sortowania i wyszukiwania.
- **`cart/`:** Stan i UI koszyka (Context/Zustand, ikona z licznikiem, lista pozycji, drawer/modal). Wydzielenie pozwala izolować logikę koszyka i localStorage/cookies bez zaśmiecania `app/cart/page.tsx`.

Taki podział (ui → layout → domeny: catalog, cart) skaluje się do kolejnych domen (np. `components/checkout/`, `components/admin/`) bez przebudowy całej struktury.

### 3. `lib/` – logika i integracje

- **`db/`:** Miejsce na klienta Prisma (singleton) i ewent. funkcje pomocnicze (np. `getProductBySlug`). Dzięki temu wszystkie zapytania do bazy są w jednym module, co ułatwia testy i ewentualną zamianę ORM.
- **`stripe/`:** Konfiguracja Stripe, tworzenie sesji Checkout, weryfikacja webhooków. Oddzielenie od `api/` sprawia, że Route Handlers pozostają cienkie, a cała logika płatności jest w jednym miejscu.
- **`redis/`:** Cache (np. lista produktów) i opcjonalnie sesja/koszyk. Wydzielony moduł ułatwia późniejsze przejście na Upstash lub inny host Redis bez zmiany reszty kodu.
- **`auth/`:** Logowanie admina, sesja (JWT w cookie lub Redis), hashowanie haseł. Środowisko autoryzacji oddzielone od `api/` i `app/admin/` – middleware i layout admina tylko wywołują `lib/auth`, nie implementują logiki.

Ta struktura `lib/` odpowiada planowi: „lib/ – db, stripe, redis, auth” i utrzymuje granice między bazą, płatnościami, cache’em i auth.

### 4. `types/`

- Wspólne typy TypeScript: modele (Product, Order, Review…), typy odpowiedzi API, props komponentów. Jedna lokalizacja (`types/` lub `types/index.ts`) ogranicza cykliczne importy i ułatwia współdzielenie typów między `app/`, `components/` i `lib/`. W przyszłości część typów może być generowana z Prisma (`prisma generate`), ale własne DTO i typy API zostaną w `types/`.

### 5. `middleware.ts` w korzeniu

- W Next.js middleware musi być w rootzie projektu (obok `app/`). Tu będzie ochrona `/admin/*` (przekierowanie niezalogowanych) i ewentualnie rate limiting dla `/api/*`. Jedna plikowa warstwa „na wejściu” do aplikacji upraszcza bezpieczeństwo i CORS.

---

## Podsumowanie

Struktura jest zgodna z:

- **Planem HardwareHub:** app (strony + API), components (ui, layout, catalog, cart), lib (db, stripe, redis, auth), types.
- **Next.js App Router:** trasy w `app/`, Route Handlers w `app/api/.../route.ts`, metadata (sitemap, robots) w `app/`, middleware w rootzie.
- **Rozwojem projektu:** podział na domeny (catalog, cart, admin) i warstwy (ui, layout, lib) ułatwia dodawanie kolejnych faz (płatności, recenzje, wyszukiwanie, SEO) bez przebudowy folderów.

Wszystkie dodane pliki są na razie szkieletem (puste lub minimalne eksporty), gotowe do wypełnienia w kolejnych krokach planu.
