"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-12 py-16 mx-auto max-w-7xl">
        <div className="col-span-1">
          <div className="text-xl font-bold text-primary mb-6">HardwareHub</div>
          <p className="text-xs text-muted">
            Twój zaufany dostawca technologii przyszłości. Specjalizujemy się w
            dostarczaniu najwyższej jakości podzespołów komputerowych dla
            najbardziej wymagających użytkowników.
          </p>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-6 text-xs">Oferta</h4>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Katalog
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Promocje
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Bestsellery
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-6 text-xs">Informacje</h4>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Polityka prywatności
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Regulamin
              </Link>
            </li>
            <li>
              <Link
                className="text-xs font-display tracking-tight text-muted hover:text-primary transition-colors"
                href=""
              >
                Dostawa i płatności
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase font-bold mb-6 text-xs">Kontakt</h4>
          <p className="text-xs text-muted mb-2">kontakt@hardwarehub.pl</p>
          <p className="text-xs text-muted mb-2">+48 123 456 789</p>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="icon-sm">
              <span className="material-symbols-outlined !text-sm">
                language
              </span>
            </Button>
            <Button variant="secondary" size="icon-sm">
              <span className="material-symbols-outlined !text-sm">share</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
