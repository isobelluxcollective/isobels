import { Link } from "@tanstack/react-router";

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
              Current Raffle
            </Link>
            <Link to="/winners" className="hover:text-brand-gold transition-colors">
              Past Winners
            </Link>
          </div>
          <div className="flex flex-col space-y-4 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-cream/70">
            <a href="#" className="hover:text-brand-gold transition-colors">
              Instagram
            </a>
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
          </p>
        </div>
      </div>
    </footer>
  );
}

