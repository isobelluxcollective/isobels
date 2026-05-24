import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.6 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.73a4.85 4.85 0 0 1-1.64-.04Z" />
    </svg>
  );
}


export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-brand-cream/40 py-20">
      <div className="container mx-auto px-6 border-t border-brand-cream/10 pt-12 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="font-serif text-4xl text-brand-cream mb-6 italic">Isobel.</div>
            <p className="text-xs leading-relaxed max-w-sm">
              A curated space for those who appreciate the finer things. We make luxury accessible
              through exclusive raffles, while donating 5% of all profits to charity.
            </p>
          </div>
          <div className="flex flex-col space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-cream/70">
            <Link to="/about" className="hover:text-brand-gold transition-colors">
              Our Story
            </Link>
            <Link to="/raffle" className="hover:text-brand-gold transition-colors">
              Current Raffles
            </Link>
            <Link to="/winners" className="hover:text-brand-gold transition-colors">
              Past Winners
            </Link>
          </div>
          <div className="flex flex-col space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-cream/70">
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/isobel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-brand-gold transition-colors"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.tiktok.com/@isobel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-brand-gold transition-colors"
              >
                <TikTokIcon className="size-5" />
              </a>
            </div>
            <a href="#" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-gold transition-colors">
              Terms of Entry
            </a>
          </div>

        </div>
        <div className="mt-20 pt-8 border-t border-brand-cream/5 flex justify-between items-center text-[9px] uppercase tracking-[0.3em]">
          <span>© {new Date().getFullYear()} Isobel Raffles Ltd.</span>
          <span>Please Raffle Responsibly · 18+</span>
        </div>
        <div className="mt-10 pt-6 border-t border-brand-cream/10">
          <p className="text-[11px] leading-relaxed text-brand-cream/35 max-w-4xl">
            Please note that Isobel draws are not a charity raffle or lottery but a prize draw.
            Our draws include a free postal method of entry. No purchase is necessary to enter.
            Isobel draws are operated in compliance with UK competition law.
            The winner may elect to receive the cash value equivalent of the prize in lieu of the physical item.
          </p>
        </div>
      </div>
    </footer>
  );
}

