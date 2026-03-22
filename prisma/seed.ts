import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const [laptopy, akcesoria, monitory] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "laptopy" },
      update: {},
      create: { name: "Laptopy", slug: "laptopy" },
    }),
    prisma.category.upsert({
      where: { slug: "akcesoria" },
      update: {},
      create: { name: "Akcesoria", slug: "akcesoria" },
    }),
    prisma.category.upsert({
      where: { slug: "monitory" },
      update: {},
      create: { name: "Monitory", slug: "monitory" },
    }),
  ]);

  await Promise.all([
    prisma.product.upsert({
      where: { slug: "lenovo-thinkpad-x1-carbon" },
      update: { stock: 6, price: "7999.00" },
      create: {
        name: "Lenovo ThinkPad X1 Carbon",
        slug: "lenovo-thinkpad-x1-carbon",
        description: "Ultrabook biznesowy 14''",
        price: "7999.00",
        stock: 6,
        imageUrl: "/images/products/thinkpad-x1-carbon.jpg",
        categoryId: laptopy.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "dell-xps-13" },
      update: { stock: 10, price: "6599.00" },
      create: {
        name: "Dell XPS 13",
        slug: "dell-xps-13",
        description: "Kompaktowy laptop premium",
        price: "6599.00",
        stock: 10,
        imageUrl: "/images/products/dell-xps-13.jpg",
        categoryId: laptopy.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "logitech-mx-master-3s" },
      update: { stock: 30, price: "429.00" },
      create: {
        name: "Logitech MX Master 3S",
        slug: "logitech-mx-master-3s",
        description: "Mysz bezprzewodowa ergonomiczna",
        price: "429.00",
        stock: 30,
        imageUrl: "/images/products/mx-master-3s.jpg",
        categoryId: akcesoria.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "keychron-k8-pro" },
      update: { stock: 18, price: "499.00" },
      create: {
        name: "Keychron K8 Pro",
        slug: "keychron-k8-pro",
        description: "Klawiatura mechaniczna bezprzewodowa",
        price: "499.00",
        stock: 18,
        imageUrl: "/images/products/keychron-k8-pro.jpg",
        categoryId: akcesoria.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "lg-ultrafine-27" },
      update: { stock: 12, price: "1899.00" },
      create: {
        name: "LG UltraFine 27",
        slug: "lg-ultrafine-27",
        description: "Monitor 27'' 4K IPS",
        price: "1899.00",
        stock: 12,
        imageUrl: "/images/products/lg-ultrafine-27.jpg",
        categoryId: monitory.id,
      },
    }),
  ]);

  console.log("Seed zakonczony sukcesem");
}

main()
  .catch((e) => {
    console.error("Blad seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
