# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Monolith"

This design system is built to transform a standard e-commerce experience into a premium, high-tech gallery. The Creative North Star, **"The Kinetic Monolith,"** dictates a UI that feels carved from dark obsidian, illuminated by the internal glow of high-performance hardware.

We break the "template" look by rejecting the traditional white-box grid. Instead, we use **intentional asymmetry**—large, high-resolution hardware imagery that bleeds off the edge of containers—and **tonal depth** to guide the eye. The interface does not sit on the screen; it lives within a deep, three-dimensional space where "Electric" accents (`primary`) and "Acid" highlights (`tertiary`) signify interactive energy.

---

## 2. Colors: Depth over Boundaries

The palette is rooted in deep blacks and charcoal grays, creating a "low-light" environment that allows hardware photography to pop.

### The "No-Line" Rule

**Explicit Instruction:** Do not use 1px solid borders to define sections. Boundaries must be created via background shifts.

- **Hero Section:** `surface` (#0e0e0e)
- **Feature Grid:** `surface_container_low` (#131313)
- **Product Cards:** `surface_container` (#1a1a1a) sitting on a `surface_container_low` background.

### Surface Hierarchy & Nesting

Treat the UI as stacked sheets of tinted glass.

- **Base:** `background` (#0e0e0e).
- **Level 1 (Sections):** Use `surface_container_low` (#131313).
- **Level 2 (Interactive Elements):** Use `surface_container` (#1a1a1a) or `surface_container_high` (#20201f).
- **Nesting:** A product description tooltip should use `surface_container_highest` (#262626) to appear "closest" to the user.

### The "Glass & Gradient" Rule

To elevate the "high-tech" feel, use **Glassmorphism** for floating navigation and overlays.

- **Token:** `surface_variant` (#262626) at 60% opacity with a `24px` backdrop-blur.
- **Signature Textures:** For primary CTAs (e.g., "Kup teraz"), use a subtle linear gradient from `primary` (#81ecff) to `primary_dim` (#00d4ec) at a 135-degree angle. This adds a "lithium-ion" glow that flat colors lack.

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance technical precision with high-end editorial style.

- **Display & Headlines (Space Grotesk):** This typeface provides a technical, "engineered" look. Use `display-lg` for product names to create a sense of massive scale.
- **Body & Labels (Inter):** Inter handles the heavy lifting for specifications and Polish text. Its high x-height ensures readability even at `body-sm` (0.75rem) for technical fine print.
- **The Polish Nuance:** Ensure line-height (leading) for Polish headings is increased by 5% compared to English defaults to accommodate diacritics (ą, ć, ę, ł, etc.) without crowding.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are too "dirty" for this aesthetic. We use light and tone to define space.

- **The Layering Principle:** Place a card using `surface_container_highest` on a `surface` background. The delta in lightness creates "Natural Lift" without a single pixel of shadow.
- **Ambient Shadows:** For floating modals, use a shadow with a blur of `40px`, an opacity of `8%`, and a color derived from `primary_dim` (#00d4ec) rather than black. This mimics the "glow" of hardware LEDs.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in forms, use `outline_variant` (#484847) at **15% opacity**. It should be felt, not seen.
- **Glassmorphism:** Use `surface_bright` (#2c2c2c) at 40% opacity for hovering states over image-heavy sections to maintain legibility without masking the hardware imagery.

---

## 5. Components

### Buttons

- **Primary (Action):** `primary` background, `on_primary_fixed` text. Roundedness: `md` (0.375rem). No border.
- **Secondary (Specs/Compare):** `secondary_container` background. `on_secondary_container` text.
- **Tertiary (Special Offers):** `tertiary` background with `on_tertiary` text. Use this sparingly for "Bestsellery" or "Promocja."

### Input Fields

- **Style:** `surface_container_highest` background. No border, only a 2px `primary` bottom-stroke that appears on `:focus`.
- **Error State:** Use `error` (#ff716c) for text and `error_container` for the subtle background tint of the field.

### Cards (Product/Hardware)

- **Rule:** Forbid divider lines. Use `spacing.8` (2rem) of vertical white space to separate the product image from the price/title.
- **Interaction:** On hover, transition the background from `surface_container` to `surface_container_high`.

### Specs Table (Technical Data)

- **Structure:** Alternate background colors between `surface_container_low` and `surface_container` for rows. Never use horizontal lines.

### Inventory Chips

- **Status:** For "Dostępny" (In Stock), use a `tertiary_container` dot next to `body-sm` text. For "Wyprzedany" (Sold Out), use `outline` text at 50% opacity.

---

## 6. Do's and Don'ts

### Do:

- **DO** use extreme scale. A 3090 GPU image should be massive, overlapping the edge of its `surface_container`.
- **DO** use Polish terminology accurately (e.g., "Koszyk" instead of "Shopping Cart", "Dane techniczne" instead of "Specs").
- **DO** leave "breathing room" using `spacing.16` or `spacing.20` between major content blocks.

### Don't:

- **DON'T** use 100% white (#ffffff) for large blocks of text. Use `on_surface_variant` (#adaaaa) for secondary descriptions to reduce eye strain in this dark UI.
- **DON'T** use standard 90-degree corners. Stick strictly to the **Roundedness Scale** (primarily `md` and `lg`) to maintain the "sleek hardware" feel.
- **DON'T** use generic "drop shadows." If an element needs to pop, increase its `surface_container` tier.

