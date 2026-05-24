import { createFileRoute, Link } from "@tanstack/react-router";
import { currentRaffle } from "@/lib/raffle-data";
import { useCountdown } from "@/lib/countdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/raffle")({
  head: () => ({
    meta: [
      { title: `Current Raffle: ${currentRaffle.prizeName} — Isobel` },
      {
        name: "description",
        content: `Enter to win a ${currentRaffle.prizeShort}. Tickets from £${currentRaffle.ticketPrice}. Draw closes soon.`,
      },
      { property: "og:title", content: `${currentRaffle.prizeName} — Isobel Current Raffle` },
      {
        property: "og:description",
        content: `Win a ${currentRaffle.prizeShort}. Tickets from £${currentRaffle.ticketPrice}.`,
      },
    ],
  }),
  component: RafflePage,
});

function RafflePage() {
  const c = useCountdown(currentRaffle.drawDate);

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-7xl grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <img
              src={currentRaffle.heroImage}
              alt={currentRaffle.prizeShort}
              width={1080}
              height={1350}
              className="w-full aspect-[4/5] object-cover outline-1 -outline-offset-1 outline-brand-ink/5"
            />
          </div>
          <div className="space-y-8 md:sticky md:top-24">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold">
              Draw No. {currentRaffle.drawNumber} · Current Prize
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-brand-ink">
              {currentRaffle.prizeName}
            </h1>
            <p className="text-base text-brand-ink/70 leading-relaxed max-w-prose">
              {currentRaffle.description}
            </p>

            <dl className="grid grid-cols-2 gap-6 border-t border-b border-brand-ink/10 py-6">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-ink/50">
                  Retail value
                </dt>
                <dd className="font-serif text-2xl italic mt-1">{currentRaffle.retailValue}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-ink/50">
                  Per ticket
                </dt>
                <dd className="font-serif text-2xl italic mt-1">£{currentRaffle.ticketPrice}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-ink/50">
                  Closes in
                </dt>
                <dd className="font-mono text-sm mt-2">{c.display}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-brand-ink/50">Odds</dt>
                <dd className="text-sm mt-2">{currentRaffle.odds}</dd>
              </div>
            </dl>

            <Link
              to="/enter"
              className="block text-center bg-brand-ink text-brand-cream px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors"
            >
              Enter Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-serif text-4xl text-brand-ink mb-12 text-center">
            Frequently Asked
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "How is the winner chosen?",
                a: "Every ticket is assigned a unique number. After the draw closes, a winner is selected at random using a verifiable random algorithm. The winner is contacted by email within 48 hours.",
              },
              {
                q: "Do I have to pay tax on the prize?",
                a: "No. Raffle prizes are not subject to income tax in the UK. The prize is yours, free and clear.",
              },
              {
                q: "Is there a free entry route?",
                a: "Yes. UK law requires a free postal entry route, and we honour that fully. See the Enter page for the postal address and required slip format.",
              },
              {
                q: "Can I increase my odds?",
                a: "Subscribers receive the most entries per pound. A monthly subscription gets you between 12 and 60 entries per draw, every draw.",
              },
              {
                q: "What if the draw doesn't sell out?",
                a: "Every draw goes ahead on the announced date. There is no minimum entry threshold — the prize is guaranteed.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-serif text-xl">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-brand-ink/70 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
