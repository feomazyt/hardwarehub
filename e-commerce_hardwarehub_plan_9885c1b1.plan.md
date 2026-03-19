---
name: E-commerce HardwareHub Plan
overview: "Plan nauki i budowy małego sklepu e-commerce (HardwareHub) od zera: Next.js, Stripe/PayPal, Redis, GraphQL (opcjonalnie), z naciskiem na płatności, SEO, wydajność i bezpieczeństwo."
todos: []
isProject: false
---

# Plan projektu E-commerce HardwareHub – krok po kroku

Projekt startuje w pustym folderze. Poniżej uporządkowana ścieżka: od fundamentów po zaawansowane funkcje.

---

## Faza 0: Decyzje przed startem

### Backend – jaką technologię użyć?

**W tym planie backend = Next.js (full-stack).** Next.js nie jest „tylko frontendem” – uruchamia **Node.js** i dostarcza backend w tej samej aplikacji:

- **Route Handlers** (`app/api/.../route.ts`) – endpointy HTTP (REST): checkout, webhook Stripe, recenzje, wyszukiwanie.
- **Server Actions** – funkcje wywoływane z formularzy (np. admin CRUD) bez osobnych API.
- **Server Components** – odczyt z bazy (Prisma) bezpośrednio w komponentach (katalog, strona produktu).
- **Middleware** – autoryzacja admina, ochrona tras.

Nie potrzebujesz osobnego serwera (Express, NestJS itd.). Stack backendu to w praktyce: **Node.js (runtime) + Next.js (API/Server Actions) + Prisma (ORM) + opcjonalnie Redis**. Język: **TypeScript** w całym projekcie.

**Kiedy rozważyć osobny backend?**

- Chcesz się uczyć **Express / Fastify / NestJS** – wtedy Next.js tylko jako frontend (fetch do zewnętrznego API), a drugi repo/serwis obsługuje API i bazę. Więcej pracy (deploy dwóch aplikacji, CORS, env), ale dobra nauka architektury.
- Planujesz **mobile app** lub wielu klientów (React, Flutter, etc.) – jeden backend API (Node, Go, Python) + wiele frontendów.
- Dla **małego sklepu i nauki** rekomendacja: **zostań przy Next.js full-stack** – mniej konfiguracji, jeden deploy (np. Vercel), pełna integracja Stripe/SEO.

Podsumowanie: **backend w tym projekcie = Next.js (TypeScript, Route Handlers, Server Actions) + Prisma + Redis (opcjonalnie).** Osobna aplikacja backendowa nie jest wymagana.

---

- **Framework:** Next.js (App Router) lub Nuxt 3 – wybierz jeden. Dla tego planu zakładam **Next.js** (lepsza dokumentacja Stripe, większość tutoriali e-commerce).
- **Baza danych:** Potrzebna do produktów, użytkowników, zamówień. Propozycja: **PostgreSQL** (np. przez Prisma) lub **SQLite** na start (szybki rozwój).
- **Hosting/środowisko:** Vercel (Next.js) lub inny; Stripe/PayPal działają z dowolnym hostem.

---

## Faza 1: Fundament (tydzień 1–2)

### 1.1 Inicjalizacja projektu

- Zainicjuj projekt Next.js z App Router, TypeScript, ESLint, Tailwind CSS.
- Skonfiguruj strukturę folderów, np.:
  - `app/` – strony i layouty (App Router)
  - `components/` – UI (ui/, layout/, catalog/, cart/)
  - `lib/` – db, stripe, redis, auth
  - `types/` – modele TypeScript

### 1.2 Baza danych i modele

- Zainstaluj **Prisma** (lub Drizzle), podłącz PostgreSQL lub SQLite.
- Zdefiniuj modele: **Product** (id, name, slug, description, price, imageUrl, category, stock, createdAt), **Category**, **User** (opcjonalnie na start), **Order**, **OrderItem**. Później: **Review**, **AdminUser**.
- Uruchom migracje, dodaj seed z kilkoma produktami (np. „hardware” – kable, przejściówki).

### 1.3 Katalog produktów (MVP)

- Strona **katalogu** (`/` lub `/products`): lista produktów z bazy (SSR lub SSG w Next.js).
- Strona **produktu** (`/products/[slug]`): dynamiczna route, dane z Prisma po `slug`.
- Prosty layout: nagłówek, stopka, nawigacja po kategoriach (jeśli masz Category).
- **Nauka:** App Router, Server Components, pobieranie danych po stronie serwera, podstawy Prisma.

---

## Faza 2: Koszyk i stan (tydzień 2–3)

### 2.1 Stan koszyka

- Koszyk po stronie **klienta** (bez logowania): React Context lub **Zustand** w `components/cart/`.
- Struktura: tablica pozycji `{ productId, slug, name, price, quantity, imageUrl }`.
- Zapisywanie w **localStorage** (lub cookies), żeby koszyk przetrwał odświeżenie.

### 2.2 UI koszyka

- Ikona koszyka w headerze z licznikiem pozycji.
- Strona `/cart`: lista pozycji, zmiana ilości, usuwanie, suma. Przycisk „Do kasy” prowadzi do checkout.

### 2.3 (Opcjonalnie) Redis – sesja/koszyk

- Zainstaluj **Upstash Redis** (bez serwera) lub lokalny Redis.
- Endpoint API: zapis/odczyt koszyka po `sessionId` (cookie). Daje to koszyk „między urządzeniami” po zalogowaniu i przygotowuje pod cache.
- **Nauka:** Redis jako key-value, podstawy cache’owania.

---

## Faza 3: Płatności – Stripe (tydzień 3–4)

### 3.1 Konfiguracja Stripe

- Konto Stripe (tryb testowy), klucze z Dashboard: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
- Zmienne w `.env.local`, nigdy nie commituj kluczy.

### 3.2 Checkout Stripe

- Strona **checkout** (`/checkout`): podsumowanie zamówienia z koszyka, formularz (email, adres – opcjonalnie).
- **Backend:** Route Handler (Next.js) `POST /api/checkout`: tworzenie **Stripe Checkout Session** (mode: payment). Przekaż `line_items` z koszyka, `success_url`, `cancel_url`, `metadata` (np. orderId po utworzeniu zamówienia w DB).
- Po opłaceniu użytkownik wraca na `success_url` (np. `/order/success?id=...`).

### 3.3 Webhook i zamówienia

- Endpoint **webhook** `POST /api/webhooks/stripe`: odbieranie `checkout.session.completed`. Weryfikacja podpisów (`stripe.webhooks.constructEvent` + `STRIPE_WEBHOOK_SECRET`).
- W webhooku: zapis **Order** + **OrderItem** w bazie (status „paid”), opcjonalnie czyszczenie koszyka w Redis/cookies.
- **Nauka:** Payment integration, idempotencja (sprawdzanie, czy zamówienie już zapisane), bezpieczeństwo webhooków.

### 3.4 (Opcjonalnie) PayPal

- PayPal REST API lub **@paypal/react-paypal-js**: przycisk PayPal obok Stripe na stronie checkout. Drugi flow: tworzenie zamówienia PayPal, capture po potwierdzeniu, ten sam webhook lub endpoint do zapisu Order w DB.

---

## Faza 4: Panel admina (tydzień 4–5)

### 4.1 Autoryzacja admina

- Prosta **autoryzacja:** hasło admina w env lub tabela **AdminUser** z hasłem (hashowanym, np. **bcrypt**). Sesja w JWT (w cookie httpOnly) lub session store (Redis).
- Middleware Next.js: ochrona `/admin/` – tylko zalogowani admini.

### 4.2 CRUD produktów

- `/admin` – dashboard (liczba zamówień, ostatnie zamówienia).
- `/admin/products` – lista produktów (paginacja), przyciski edycja/usuń.
- `/admin/products/new` i `/admin/products/[id]/edit` – formularze: nazwa, slug, opis, cena, kategoria, stan, zdjęcie (upload do lokalnego folderu lub S3/Cloudinary).
- API lub Server Actions: tworzenie, aktualizacja, usuwanie produktów w DB.

### 4.3 Zarządzanie zamówieniami

- `/admin/orders` – lista zamówień (z bazy), filtry (status, data). Klik w zamówienie: szczegóły (pozycje, adres, status płatności).

---

## Faza 5: Recenzje (tydzień 5–6)

### 5.1 Model i API

- Model **Review**: productId, authorName, authorEmail (opcjonalnie), rating (1–5), content, createdAt, approved (boolean).
- Endpoint `POST /api/products/[id]/reviews`: walidacja (np. Zod), zapis do DB. Opcjonalnie: tylko dla zamówień z opłaconym produktem (anty-spam).

### 5.2 Wyświetlanie

- Na stronie produktu: sekcja recenzji, średnia ocena, lista (tylko `approved`). W adminie: kolejka do zatwierdzenia (`/admin/reviews`), przycisk approve/reject.

---

## Faza 6: Wyszukiwanie (tydzień 6)

### 6.1 Wyszukiwanie pełnotekstowe

- Opcja A: **Prisma** – `where: { name: { contains: query } }` (proste, bez dodatkowych serwisów).
- Opcja B: **Algolia** lub **Meilisearch** – indeks produktów, lepsze UX (sugestie, typo-tolerance). Na naukę: integracja z zewnętrznym search engine.

### 6.2 UI

- Pole wyszukiwania w headerze (np. z debounce), strona wyników `/search?q=...` lub dropdown z sugestiami.

---

## Faza 7: SEO i wydajność (tydzień 7)

### 7.1 SEO

- **Metadata:** w każdej stronie `generateMetadata` / `metadata`: title, description, openGraph. Dla produktu: dane z API/DB.
- **Structured data:** JSON-LD (Product, Organization) na stronie produktu i strony głównej.
- **Sitemap:** `app/sitemap.ts` – dynamiczna lista URLi produktów i kategorii.
- **robots.txt:** `app/robots.ts` – dozwolone ścieżki.

### 7.2 Wydajność

- Obrazy: **next/image** z rozsądnymi `sizes`, optymalne formaty (WebP).
- **Redis:** cache’owanie listy produktów lub stron katalogu (np. TTL 60s). W Next.js: fetch z `next: { revalidate: 60 }` lub osobny layer z Redis przed Prisma.
- Lazy loading komponentów below the fold (np. recenzje, footer).
- **Lighthouse:** mierzenie LCP, CLS, FID; poprawa gdzie potrzeba.

---

## Faza 8: Bezpieczeństwo (ciągłe + podsumowanie)

- **Walidacja wejścia:** Zod (lub inna) przy wszystkich API i formularzach (checkout, recenzje, admin).
- **Autoryzacja:** hasła tylko hashowane, sesje admina w httpOnly cookie, ochrona tras admina w middleware.
- **Stripe:** weryfikacja webhooka podpisem; nie ufaj `client-side` w statusie płatności – tylko webhook/backend.
- **Rate limiting:** na `/api` (np. przez Upstash Redis lub Vercel KV) – ograniczenie abuse’u (logowanie, recenzje, checkout).
- **CORS, nagłówki:** sensowne ustawienia w Next.js (np. security headers w `next.config.js`).

---

## GraphQL (opcjonalnie)

- Jeśli chcesz się uczyć GraphQL: dodaj **Apollo Server** (lub Pothos + GraphQL Yoga) w route `/api/graphql`. Schema: Query (products, productBySlug, categories), Mutation (addReview, createOrder – ostrożnie z płatnościami). Front może używać Apollo Client lub zwykłego `fetch` do GraphQL. Można to zrobić po MVP (np. po Faza 4), żeby nie mieszać z nauką Stripe.

---

## Kolejność nauki umiejętności (mapowanie)

| Umiejętność              | Gdzie w projekcie                                                           |
| ------------------------ | --------------------------------------------------------------------------- |
| Payment integration      | Faza 3 – Stripe Checkout, webhook, opcjonalnie PayPal                       |
| SEO                      | Faza 7 – metadata, JSON-LD, sitemap, robots                                 |
| Optymalizacja wydajności | Faza 7 – next/image, Redis cache, lazy load, Lighthouse                     |
| Bezpieczeństwo           | Faza 4 (auth), Faza 3 (webhook), Faza 8 (walidacja, rate limit, hashowanie) |

---

## Rekomendowana kolejność tygodni

1. **Tydzień 1:** Faza 1 (Next.js, DB, katalog).
2. **Tydzień 2:** Faza 2 (koszyk, opcjonalnie Redis).
3. **Tydzień 3–4:** Faza 3 (Stripe – najważniejsze do nauki płatności).
4. **Tydzień 4–5:** Faza 4 (panel admina).
5. **Tydzień 5–6:** Faza 5 (recenzje), Faza 6 (wyszukiwanie).
6. **Tydzień 7:** Faza 7 (SEO + wydajność), Faza 8 (bezpieczeństwo).
7. **Później:** GraphQL, PayPal, rozbudowa (np. wiele zdjęć, warianty produktu).

Na końcu będziesz mieć działający mały sklep z katalogiem, koszykiem, płatnościami Stripe, panelem admina, recenzjami i wyszukiwaniem, z naciskiem na płatności, SEO, wydajność i bezpieczeństwo – idealnie pod rozwój umiejętności.
