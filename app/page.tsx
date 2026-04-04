import { Button } from "@/components/ui/button";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="">
      <section
        className={`relative h-[921px] flex items-center px-8 md:px-20 overflow-hidden ${styles.heroGradient}`}
      >
        <div>
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6 text-white">
            Moc jutra w <br />{" "}
            <span className="text-primary">Twoich rękach</span>
          </h1>
          <p className="text-on-surface-variant text-xl md:text-2xl mb-12 max-w-xl font-light leading-relaxed">
            Odkryj ekosystem najwyższej wydajności. Sprzęt dla entuzjastów,
            którzy nie uznają kompromisów.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="p-8 font-bold text-lg">
              Przejdź do katalogu
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="p-8 font-bold text-lg"
            >
              Dowiedz się więcej
            </Button>
          </div>
        </div>
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-3/5 hidden lg:block opacity-80">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg5Y1Gp94F9WX9JTCtOPmzqVjVgDFSJ-QHR-pmWGHRsX--Wk1GHQnFo5roBvX4d-hf_yta9XdVHgm426yGF0dx4P3r4OcpmRxBIdjw1XjoXS84YcsixTTKazcJCSaAWM27dkjPQYCsi_OWfQMTzuEl_yVUOagasefjZrBsfhkBu8jYqaN8FnvoG2rHYGrjYgUdzFF2jB2G6fIhEY4L8GqW8N0f5DWT85ytSvaCRIb4EElxpdOanmcVU1lrOCbtK79JTsUYQxKHFqk"
            alt="High-end PC Build"
            className="w-full h-auto object-cover rounded-xl shadow-2xl rotate-[-2deg]"
          />
        </div>
      </section>
      <section className="bg-surface-container-low py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-6 bg-surface-container rounded-lg group">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-tertiary">
              <span className="material-symbols-outlined leading-none">
                local_shipping
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Darmowa dostawa od 200 zł</h3>
              <p className="text-on-surface-variant text-sm">
                Wysyłka w 24h kurierem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-surface-container rounded-lg group">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-tertiary/10 p-3 text-tertiary transition-all duration-300 group-hover:bg-tertiary group-hover:text-on-tertiary">
              <span className="material-symbols-outlined leading-none">
                assignment_return
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">30 dni na zwrot</h3>
              <p className="text-on-surface-variant text-sm">
                Bez zbędnych pytań
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-surface-container rounded-lg group">
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-3 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-tertiary">
              <span className="material-symbols-outlined leading-none">
                verified_user
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Bezpieczne płatności</h3>
              <p className="text-on-surface-variant text-sm">
                Szyfrowanie SSL 256-bit
              </p>
            </div>
          </div>
        </div>
      </section>
      <section></section>
    </div>
  );
}
