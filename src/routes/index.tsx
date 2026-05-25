import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pastWinners, type Raffle } from "@/lib/raffle-data";
import { getLiveRaffles, getFeaturedRaffles } from "@/lib/raffles.functions";
import { useCountdown } from "@/lib/countdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isobel's — Win Luxury Designer Handbags & Jewellery from £10" },
      {
        name: "description",
        content:
          "Enter weekly draws to win iconic designer handbags and jewellery. Multiple live draws every week. 5% of profits to charity.",
      },
      { property: "og:title", content: "Isobel's — Luxury Designer Draws" },
      {
        property: "og:description",
        content: "Multiple live luxury draws every week. 5% of profits to charity.",
      },
    ],
  }),
  loader: async (): Promise<{ featured: Raffle[]; live: Raffle[] }> => {
    const [featured, live] = await Promise.all([getFeaturedRaffles(), getLiveRaffles()]);
    return { featured: featured.length ? featured : live.slice(0, 3), live };
  },
  component: HomePage,
});

function HomePage() {
  const { featured, live } = Route.useLoaderData() as { featured: Raffle[]; live: Raffle[] };

  return (
    <>
      {/* Hero carousel */}
      <section className="relative bg-brand-cream pt-10 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-2">
                Featured Draws
              </p>
              <h1 className="font-serif text-4xl md:text-6xl italic text-brand-ink leading-[0.95]">
                This week at Isobel's
              </h1>
            </div>
            <Link
              to="/raffle"
              className="hidden sm:inline-block text-xs uppercase tracking-widest border-b border-brand-ink pb-1"
            >
              All Live Draws
            </Link>
          </div>

          {live.length === 0 ? (
            <EmptyState />
          ) : (
            <HeroCarousel raffles={live} />
          )}
        </div>
      </section>


      {/* How it works */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-ink mb-4">How Isobel's Works</h2>
            <p className="text-brand-ink/50 uppercase tracking-widest text-[11px]">
              Three steps to your next heirloom
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                n: "01",
                t: "Choose a draw",
                d: "Every week, a single exceptional luxury piece enters the draw — hand-sourced from the world's leading houses and independently authenticated. Pick the prize that calls to you. Every winner may choose to receive the piece itself or its full cash equivalent.",
              },
              {
                n: "02",
                t: "Choose how to enter",
                d: "Enter from £10 per ticket — the more tickets you hold, the greater your chances. Prefer not to purchase? Every Isobel's draw includes a completely free postal entry route, by law and by principle. Postal entries are limited to one entry per postcard sent. No purchase is ever necessary to win.",
              },
              {
                n: "03",
                t: "Await the draw",
                d: "When the draw closes, one winner is chosen at random and verified independently. Every entry holds a unique verifiable number — full transparency, always. The winner is notified by email and has their choice of the prize or its cash value. One name. One prize. No exceptions.",
              },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <span className="font-serif text-3xl italic text-brand-gold">{s.n}</span>
                <h3 className="text-lg font-medium tracking-tight text-brand-ink">{s.t}</h3>
                <p className="text-sm text-brand-ink/70 leading-relaxed max-w-[40ch]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charity strip */}
      <section className="bg-brand-ink text-brand-cream py-5">
        <div className="container mx-auto px-6 max-w-7xl flex justify-center text-center">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium">
            5% of all profits donated to charity · Charity partner announcing soon
          </p>
        </div>
      </section>

      {/* Past winners preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
            <div>
              <h2 className="font-serif text-4xl italic text-brand-ink">Recent Winners</h2>
              <p className="text-xs uppercase tracking-widest text-brand-ink/50 mt-2">
                Real prizes, real people
              </p>
            </div>
            <Link
              to="/winners"
              className="text-xs uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1 w-fit"
            >
              View Archive
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pastWinners.map((w) => (
              <div key={w.id} className="space-y-4">
                <img
                  src={w.image}
                  alt={`Winner ${w.firstName} with ${w.prize}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="w-full aspect-[4/5] object-cover outline-1 -outline-offset-1 outline-brand-ink/5"
                />
                <div>
                  <p className="font-serif text-xl italic text-brand-ink">{w.firstName}</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-1">
                    {w.prize}
                    {w.instagram ? ` · ${w.instagram}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="border border-brand-taupe bg-white p-16 text-center">
      <p className="font-serif text-2xl italic text-brand-ink/60 mb-2">
        No live draws right now
      </p>
      <p className="text-sm text-brand-ink/50">New draws announced soon.</p>
    </div>
  );
}

function HeroCarousel({ raffles }: { raffles: Raffle[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (raffles.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % raffles.length), 5000);
    return () => clearInterval(id);
  }, [raffles.length, paused]);

  const go = (i: number) => setIndex(((i % raffles.length) + raffles.length) % raffles.length);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        {raffles.map((r, i) => (
          <div
            key={r.id}
            className={`transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <FeaturedSlide raffle={r} />
          </div>
        ))}
      </div>

      {raffles.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous draw"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 text-brand-ink/30 hover:text-brand-ink opacity-0 group-hover:opacity-100 transition-opacity text-3xl font-light leading-none p-2"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next draw"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 text-brand-ink/30 hover:text-brand-ink opacity-0 group-hover:opacity-100 transition-opacity text-3xl font-light leading-none p-2"
          >
            ›
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center z-20">
            {raffles.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show draw ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === index
                    ? "w-2.5 h-2.5 bg-brand-ink/60"
                    : "w-2 h-2 bg-brand-ink/20 hover:bg-brand-ink/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FeaturedSlide({ raffle }: { raffle: Raffle }) {
  const countdown = useCountdown(raffle.draw_date);
  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center bg-white p-6 md:p-10">
      <div className="space-y-6 z-10 order-2 md:order-1">
        <div className="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] uppercase tracking-widest text-brand-gold font-semibold bg-brand-gold/5">
          Draw No. {raffle.draw_number} · Closes in {countdown.short}
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tighter text-brand-ink">
          {raffle.title}{" "}
          {raffle.italic && <span className="italic">{raffle.italic}</span>}
        </h2>
        <p className="text-base md:text-lg text-brand-ink/70 max-w-md font-light leading-relaxed">
          {raffle.description}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
          <Link
            to="/enter"
            search={{ raffle: raffle.id }}
            className="bg-brand-ink text-brand-cream px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors text-center"
          >
            Enter — From £{raffle.ticket_price}
          </Link>
          <Link
            to="/raffle/$id"
            params={{ id: raffle.id }}
            className="text-xs uppercase tracking-widest border-b border-brand-ink/20 pb-1 hover:border-brand-ink transition-colors w-fit"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="relative order-1 md:order-2">
        <img
          src={raffle.hero_image_url || "/hero-prize.jpg"}
          alt={raffle.prize_short}
          width={1080}
          height={1350}
          className="w-full aspect-[4/5] object-cover outline-1 -outline-offset-1 outline-brand-ink/5"
        />
        <div className="absolute -bottom-6 -left-6 bg-white p-5 shadow-xl max-w-[180px]">
          <p className="font-serif italic text-2xl text-brand-ink">£{raffle.ticket_price}</p>
          <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-1">
            Per Ticket
          </p>
        </div>
      </div>
    </div>
  );
}

function RaffleCard({ raffle }: { raffle: Raffle }) {
  const c = useCountdown(raffle.draw_date);
  return (
    <Link
      to="/raffle/$id"
      params={{ id: raffle.id }}
      className="group block bg-brand-cream border border-brand-taupe hover:border-brand-ink transition-colors"
    >
      <div className="relative">
        <img
          src={raffle.hero_image_url || "/hero-prize.jpg"}
          alt={raffle.prize_short}
          loading="lazy"
          width={800}
          height={1000}
          className="w-full aspect-[4/5] object-cover"
        />
        <div className="absolute top-3 left-3 bg-white px-3 py-1 text-[10px] uppercase tracking-widest text-brand-ink font-bold">
          £{raffle.ticket_price}
        </div>
      </div>
      <div className="p-5 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-brand-ink/50">
          Draw {raffle.draw_number}
        </p>
        <h3 className="font-serif text-xl italic text-brand-ink leading-tight">
          {raffle.prize_name}
        </h3>
        <p className="text-[11px] text-brand-ink/60 font-mono">Closes in {c.short}</p>
      </div>
    </Link>
  );
}
