"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      {/* <ThemeToggle /> */}
      <div className="flex justify-between items-center px-8 py-4 ">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-primary"
        >
          HardwareHub
        </Link>
        <div className="flex items-center space-x-8">
          <Link
            className="font-display tracking-tight text-muted hover:text-primary transition-colors"
            href=""
          >
            Katalog
          </Link>
          <Link
            className="font-display tracking-tight text-muted hover:text-primary transition-colors"
            href=""
          >
            Promocje
          </Link>
          <Link
            className="font-display tracking-tight text-muted hover:text-primary transition-colors"
            href=""
          >
            Bestsellery
          </Link>
          <Link
            className="font-display tracking-tight text-muted hover:text-primary transition-colors"
            href=""
          >
            Kontakt
          </Link>
        </div>
        <div className="flex items-center">
          <button>
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
          <button>
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </header>
  );
}
