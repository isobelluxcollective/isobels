import { createFileRoute, Link } from "@tanstack/react-router";
import aboutCraft from "@/assets/about-craft.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Isobel — Luxury Raffles with a Conscience" },
      {
        name: "description",
        content:
          "Isobel makes iconic designer pieces accessible through luxury raffles, donating 5% of profits to charity.",
      },
      { property: "og:title", content: "About Isobel" },
      {
        property: "og:description",
        content: "Luxury raffles with a conscience. 5% of profits to charity.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-white pt-20 md:pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-6">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-brand-ink leading-[0.95] mb-8">
            Luxury, <em>shared</em>.
          </h1>
          <p className="text-lg text-brand-ink/70 max-w-2xl mx-auto leading-relaxed">
            Isobel was founded on a quiet observation: the pieces that define a woman's wardrobe —
            the Kelly, the Classic Flap, the Love Bracelet — are increasingly reserved for the few.
            We're changing that, one draw at a time.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <img
            src={aboutCraft}
            alt="Detail of luxury leather craftsmanship"
            loading="lazy"
            width={1280}
            height={900}
            className="w-full aspect-[4/3] object-cover outline-1 -outline-offset-1 outline-brand-ink/5"
          />
          <div className="space-y-6">
            <h2 className="font-serif text-4xl italic text-brand-ink">An accessible heirloom</h2>
            <p className="text-base text-brand-ink/70 leading-relaxed">
              Every Isobel prize is a single, exceptional piece — hand-selected from the world's
              leading houses and authenticated before it enters the draw. No bundles, no
              compromises. Just one beautiful object, and one fortunate winner.
            </p>
            <p className="text-base text-brand-ink/70 leading-relaxed">
              For the price of a coffee, you can hold a stake in something extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Charity */}
      <section className="py-24 bg-brand-ink text-brand-cream">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-6">
            Giving back
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic mb-8">
            5% of every profit, to charity.
          </h2>
          <p className="text-base text-brand-cream/70 leading-relaxed max-w-xl mx-auto">
            We believe beauty should build something meaningful. That's why 5% of all profits from
            every Isobel draw are donated directly to a charitable partner. Our partner for the
            upcoming season will be announced soon.
          </p>
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-cream/40 mt-12">
            Charity partner · announcing soon
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                t: "Authenticated",
                d: "Every piece is sourced from authorised boutiques or verified by an independent authentication partner before the draw.",
              },
              {
                t: "Transparent",
                d: "Single prize, single winner, one draw at a time. Every entry assigned a verifiable number.",
              },
              {
                t: "Generous",
                d: "5% of all profits donated. A free postal entry route, by law and by principle.",
              },
            ].map((v) => (
              <div key={v.t} className="space-y-3">
                <h3 className="font-serif text-2xl italic text-brand-ink">{v.t}</h3>
                <p className="text-sm text-brand-ink/70 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-cream text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl text-brand-ink mb-6">Ready to enter?</h2>
          <Link
            to="/enter"
            className="inline-block bg-brand-ink text-brand-cream px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors"
          >
            View Current Draw
          </Link>
        </div>
      </section>
    </>
  );
}
