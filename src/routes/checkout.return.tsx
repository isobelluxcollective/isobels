import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({
    meta: [{ title: "Entry Confirmed — Isobel" }],
  }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <section className="bg-brand-cream py-24">
      <div className="container mx-auto px-6 max-w-xl text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-4">
          Confirmation
        </p>
        <h1 className="font-serif text-4xl md:text-5xl italic text-brand-ink mb-6">
          Thank you
        </h1>
        <p className="text-sm text-brand-ink/70 leading-relaxed mb-2">
          Your entry has been received. Best of luck in the draw — winners are notified by email
          within 48 hours of the closing date.
        </p>
        {session_id && (
          <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 mt-6">
            Ref: {session_id.slice(-12)}
          </p>
        )}
        <div className="mt-10 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-brand-ink px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold text-brand-cream hover:bg-brand-gold transition-colors"
          >
            Return Home
          </Link>
          <Link
            to="/raffle"
            className="inline-flex items-center justify-center border border-brand-ink/30 px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold text-brand-ink hover:border-brand-ink transition-colors"
          >
            View the Prize
          </Link>
        </div>
      </div>
    </section>
  );
}
