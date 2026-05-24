import { createFileRoute, Link } from "@tanstack/react-router";
import { currentRaffle, pastWinners } from "@/lib/raffle-data";
import { useCountdown } from "@/lib/countdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isobel — Win Luxury Designer Handbags & Jewellery from £10" },
      {
        name: "description",
        content:
          "Enter to win the Hermès Kelly 25 and other iconic designer pieces. Single luxury prize per draw. 5% of profits to charity.",
      },
      { property: "og:title", content: "Isobel — Luxury Designer Raffles" },
      {
        property: "og:description",
        content: "Win iconic designer pieces from £10. 5% of profits to charity.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const countdown = useCountdown(currentRaffle.drawDate);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden py-16 md:py-0">
        <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 z-10 order-2 md:order-1">
            <div className="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] uppercase tracking-widest text-brand-gold font-semibold bg-brand-gold/5">
              Current Draw Closes in {countdown.short}
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter text-brand-ink">
              The <span className="italic">{currentRaffle.title}</span>
              <br />
              {currentRaffle.italic}.
            </h1>
            <p className="text-base md:text-lg text-brand-ink/70 max-w-md font-light leading-relaxed">
              {currentRaffle.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
              <Link
                to="/enter"
                className="bg-brand-ink text-brand-cream px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors text-center"
              >
                Secure Your Entry
              </Link>
              <Link
                to="/raffle"
                className="text-xs uppercase tracking-widest border-b border-brand-ink/20 pb-1 hover:border-brand-ink transition-colors w-fit"
              >
                View Details
              </Link>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <img
              src={currentRaffle.heroImage}
              alt={currentRaffle.prizeShort}
              width={1080}
              height={1350}
              className="w-full aspect-[4/5] object-cover outline-1 -outline-offset-1 outline-brand-ink/5"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl max-w-[200px]">
              <p className="font-serif italic text-2xl text-brand-ink">£{currentRaffle.ticketPrice}</p>
              <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mt-1">
                Per Ticket
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-ink mb-4">How Isobel Works</h2>
            <p className="text-brand-ink/50 uppercase tracking-widest text-[11px]">
              Three steps to your next heirloom
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                n: "01",
                t: "Choose your entry",
                d: "Subscribe monthly for the best value, buy single tickets at £10 each, or enter for free by post.",
              },
              {
                n: "02",
                t: "Support a cause",
                d: "5% of all profits are donated to charity, supporting causes close to the Isobel community.",
              },
              {
                n: "03",
                t: "Await the draw",
                d: "A single winner is drawn live and announced by email. One name, one prize, full transparency.",
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
      <section className="py-24 bg-brand-cream">
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

      {/* Newsletter */}
      <section className="py-24 bg-white border-t border-brand-ink/5">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-serif text-3xl text-brand-ink">Join the Atelier</h2>
          <p className="text-sm text-brand-ink/60 max-w-[56ch] mx-auto">
            Be the first to know when new draws open. Quiet, occasional emails. No spam.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
              alert(`Thanks — we'll be in touch at ${input.value}`);
              e.currentTarget.reset();
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b border-brand-ink/20 py-2 text-sm focus:outline-none focus:border-brand-ink transition-colors"
            />
            <button
              type="submit"
              className="bg-brand-ink text-brand-cream text-xs font-medium px-6 py-3 rounded-full uppercase tracking-widest hover:bg-brand-gold transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
