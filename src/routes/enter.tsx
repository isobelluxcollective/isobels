import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { postalAddress, type Raffle } from "@/lib/raffle-data";
import { getRaffleById, getLiveRaffles } from "@/lib/raffles.functions";
import {
  getMembersData,
  getDrawTicketInfo,
  enterDrawWithTickets,
  getSavedPaymentMethod,
} from "@/lib/entries.functions";
import { useAuth } from "@/hooks/use-auth";
import { StripeEmbeddedCheckout } from "@/components/stripe-embedded-checkout";
import { PaymentTestModeBanner } from "@/components/payment-test-mode-banner";
import { getStripeEnvironment } from "@/lib/stripe";
import { cn } from "@/lib/utils";

const TIER_ONEOFF_PRICE: Record<string, { priceId: string; price: number; tickets: number; label: string }> = {
  collector: { priceId: "tickets_collector_onetime", price: 10, tickets: 12, label: "Collector" },
  aficionado: { priceId: "tickets_aficionado_onetime", price: 25, tickets: 30, label: "Aficionado" },
  icon: { priceId: "tickets_icon_onetime", price: 50, tickets: 60, label: "Icon" },
};

const searchSchema = z.object({
  raffle: z.string().uuid().optional(),
  plan: z.enum(["collector", "aficionado", "icon", "postal"]).optional(),
  mode: z.enum(["subscription", "oneoff", "tickets"]).optional(),
  confirm: z.coerce.boolean().optional(),
  error: z.enum(["payment_failed"]).optional(),
});

export const Route = createFileRoute("/enter")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ raffle: search.raffle }),
  loader: async ({ deps }): Promise<{ raffle: Raffle | null; live: Raffle[] }> => {
    if (deps.raffle) {
      const r = await getRaffleById({ data: { id: deps.raffle } });
      if (!r) throw notFound();
      return { raffle: r, live: [] };
    }
    const live = await getLiveRaffles();
    return { raffle: null, live };
  },
  head: () => ({
    meta: [
      { title: "Enter a Draw — Isobel" },
      { name: "description", content: "Choose a luxury raffle and enter from £10." },
    ],
  }),
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <p className="font-serif text-3xl italic">Raffle not found</p>
      <Link to="/raffle" className="text-xs uppercase tracking-widest underline mt-4 inline-block">
        Back to live raffles
      </Link>
    </div>
  ),
  component: EnterPage,
});

function EnterPage() {
  const { raffle, live } = Route.useLoaderData();
  const search = Route.useSearch();
  const { user, loading: authLoading, signOut } = useAuth();

  if (!raffle) {
    return (
      <section className="bg-brand-cream py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-4">
            Choose a draw to enter
          </h1>
          <p className="text-sm text-brand-ink/60 mb-12">Select one of our live raffles below.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {live.map((r: Raffle) => (
              <Link
                key={r.id}
                to="/enter"
                search={{ raffle: r.id }}
                className="block bg-white border border-brand-taupe p-8 text-left hover:border-brand-ink transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-2">
                  Draw No. {r.draw_number}
                </p>
                <p className="font-serif text-2xl italic text-brand-ink mb-2">{r.prize_name}</p>
                <p className="text-xs text-brand-ink/60">£{r.ticket_price} per ticket</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (authLoading) {
    return (
      <section className="bg-brand-cream py-20 min-h-[60vh]">
        <div className="container mx-auto px-6 text-center text-sm text-brand-ink/60">Loading…</div>
      </section>
    );
  }

  // FLOW A — not logged in: show the pricing/postal tabs, redirect to /auth on tier select
  if (!user) {
    return <FlowAGuest raffle={raffle} errorParam={search.error} />;
  }

  // FLOW B — logged in
  const firstName =
    (user.user_metadata?.first_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "";

  return (
    <FlowBLoggedIn
      raffle={raffle}
      firstName={firstName}
      plan={search.plan}
      mode={search.mode}
      confirm={!!search.confirm}
      errorParam={search.error}
      onSignOut={signOut}
    />
  );
}

/* ------------------------------- FLOW A (guest) ------------------------------- */

type Tab = "subscription" | "oneoff" | "postal";

function FlowAGuest({ raffle, errorParam }: { raffle: Raffle; errorParam?: "payment_failed" }) {
  const [tab, setTab] = useState<Tab>("subscription");

  return (
    <>
      <PaymentTestModeBanner />
      {errorParam === "payment_failed" && <PaymentFailedBanner />}
      <section className="bg-white pt-16 pb-12 border-b border-brand-ink/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-4">
            Draw No. {raffle.draw_number}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-4">Enter the Draw</h1>
          <p className="text-sm text-brand-ink/60 max-w-xl mx-auto">
            Win the <em>{raffle.prize_short}</em>. Choose how you'd like to enter.
          </p>
          <p className="text-xs text-brand-ink/50 mt-2">
            Winner's choice: claim the piece or its cash value.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-3 border-y border-brand-taupe mb-12">
            {[
              { id: "postal", label: "Postal", sub: "No purchase necessary" },
              { id: "oneoff", label: "Single Purchase", sub: `From £10` },
              { id: "subscription", label: "Subscription", sub: "Best value" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as Tab)}
                className={cn(
                  "py-5 px-3 border-b-2 -mb-px text-center transition-all",
                  tab === t.id
                    ? "border-brand-ink bg-white"
                    : "border-transparent text-brand-ink/50 hover:text-brand-ink hover:bg-white/40",
                )}
              >
                <span className="block font-serif text-base md:text-xl italic mb-1">{t.label}</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] opacity-70">
                  {t.sub}
                </span>
              </button>
            ))}
          </div>

          {tab === "postal" && <PostalPanel raffle={raffle} />}
          {tab === "oneoff" && <TierGrid raffle={raffle} mode="oneoff" />}
          {tab === "subscription" && <TierGrid raffle={raffle} mode="subscription" />}
        </div>
      </section>
    </>
  );
}

function TierGrid({ raffle, mode }: { raffle: Raffle; mode: "subscription" | "oneoff" }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {(["collector", "aficionado", "icon"] as const).map((id) => {
        const t = TIER_ONEOFF_PRICE[id];
        const isPopular = id === "aficionado";
        const redirect = `/enter?raffle=${raffle.id}&plan=${id}&mode=${mode}&confirm=1`;
        return (
          <div
            key={id}
            className="relative flex flex-col text-center transition-colors border border-brand-taupe hover:border-brand-gold"
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-cream text-[9px] px-3 py-1 uppercase tracking-[0.2em] font-bold z-10">
                Most Popular
              </div>
            )}
            <div className="bg-brand-ink text-brand-cream pt-10 pb-8 px-6">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-gold mb-3">
                {t.label}
              </span>
              <p className="font-serif text-3xl md:text-4xl italic text-brand-gold mb-2">
                {t.tickets} tickets
              </p>
              <p className="text-sm text-brand-cream/70 mb-4">
                {mode === "subscription" ? "every month" : "one-time"}
              </p>
              <p>
                <span className="font-serif text-5xl">£{t.price}</span>
                <span className="text-sm text-brand-cream/70">
                  {mode === "subscription" ? "/month" : ""}
                </span>
              </p>
            </div>
            <div className="bg-white p-6 flex-1 flex flex-col">
              <ul className="text-sm text-brand-ink/80 space-y-2 text-left mb-6">
                <li>· {t.tickets} tickets {mode === "subscription" ? "every month" : "added to your balance"}</li>
                <li>· Use across any live draw</li>
                <li>· Priority winner announcements</li>
              </ul>
              <Link
                to="/auth"
                search={{ redirect, mode: "signup" }}
                className="mt-auto w-full py-4 text-[10px] uppercase tracking-[0.25em] font-bold transition-colors bg-brand-ink text-brand-cream hover:bg-brand-gold hover:text-brand-ink text-center"
              >
                Enter Now
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PostalPanel({ raffle }: { raffle: Raffle }) {
  return (
    <div className="bg-white border border-brand-taupe p-10 md:p-14 max-w-2xl mx-auto">
      <span className="text-[10px] uppercase tracking-widest text-brand-gold block mb-4">
        Free Postal Entry
      </span>
      <h3 className="font-serif text-3xl italic mb-6">No purchase necessary</h3>
      <p className="text-sm text-brand-ink/70 leading-relaxed mb-8">
        UK law requires us to offer a free entry route. Send a postcard with the following details
        and we'll enter you into the current draw at no cost.
      </p>
      <div className="border-l-2 border-brand-gold pl-6 mb-8">
        <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mb-3">
          On a postcard, include:
        </p>
        <ul className="text-sm space-y-1.5 text-brand-ink/80">
          <li>· Your first name</li>
          <li>· Your email address</li>
          <li>· Your date of birth (you must be 18+)</li>
          <li>· The raffle title: <em>{raffle.prize_name}</em></li>
          <li>· A statement: "I would like one free entry."</li>
        </ul>
      </div>
      <div className="bg-brand-cream p-6">
        <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mb-3">Send to</p>
        <address className="not-italic text-sm text-brand-ink/90 leading-relaxed font-medium">
          {postalAddress.line2}<br />
          {postalAddress.line3}<br />
          {postalAddress.line4}<br />
          {postalAddress.line5}
        </address>
      </div>
      <p className="text-xs text-brand-ink/50 mt-6 leading-relaxed">
        Postal entries are processed manually and will appear in your Members Portal within 5
        working days.
      </p>
    </div>
  );
}

/* ------------------------------ FLOW B (logged in) ----------------------------- */

function FlowBLoggedIn({
  raffle,
  firstName,
  plan,
  mode,
  confirm,
  errorParam,
  onSignOut,
}: {
  raffle: Raffle;
  firstName: string;
  plan?: "collector" | "aficionado" | "icon" | "postal";
  mode?: "subscription" | "oneoff" | "tickets";
  confirm: boolean;
  errorParam?: "payment_failed";
  onSignOut: () => Promise<unknown>;
}) {
  const { session } = useAuth();
  const authReady = typeof window !== "undefined" && !!session?.access_token;
  const fetchMembers = useServerFn(getMembersData);
  const membersQuery = useQuery({
    queryKey: ["members-data"],
    queryFn: () => fetchMembers(),
    enabled: authReady,
  });

  const balance = membersQuery.data?.profile?.ticket_balance ?? 0;
  const expiry = membersQuery.data?.profile?.ticket_expiry ?? null;

  return (
    <>
      <PaymentTestModeBanner />
      {errorParam === "payment_failed" && <PaymentFailedBanner />}
      <section className="bg-white pt-12 pb-8 border-b border-brand-ink/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-[11px] text-brand-ink/50 mb-6">
            Entering as <span className="text-brand-ink/80">{firstName}</span>
            {" · "}
            Not you?{" "}
            <button
              type="button"
              onClick={() => onSignOut()}
              className="underline underline-offset-2 hover:text-brand-ink transition-colors"
            >
              Log out
            </button>
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-4">
            Draw No. {raffle.draw_number}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-3">
            {confirm ? "Confirm your entry" : "Enter the Draw"}
          </h1>
          <p className="text-sm text-brand-ink/60 max-w-xl mx-auto">
            Win the <em>{raffle.prize_short}</em>.
          </p>
          <p className="text-xs text-brand-ink/50 mt-2">
            Winner's choice: claim the piece or its cash value.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-3xl">
          {confirm && plan && mode ? (
            <ConfirmationCard raffle={raffle} plan={plan} mode={mode} />
          ) : (
            <ChooseEntryOption raffle={raffle} balance={balance} expiry={expiry} />
          )}
        </div>
      </section>
    </>
  );
}

function ChooseEntryOption({
  raffle,
  balance,
  expiry,
}: {
  raffle: Raffle;
  balance: number;
  expiry: string | null;
}) {
  const expiryStr = expiry ? new Date(expiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
  return (
    <div className="space-y-8">
      {balance > 0 && (
        <div className="bg-white border border-brand-taupe p-8 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-3">
            Use Subscription Tickets
          </p>
          <h3 className="font-serif text-2xl italic text-brand-ink mb-2">
            You have {balance} ticket{balance === 1 ? "" : "s"} remaining
          </h3>
          {expiryStr && (
            <p className="text-xs text-brand-ink/60 mb-6">· expires {expiryStr}</p>
          )}
          <Link
            to="/enter"
            search={{ raffle: raffle.id, plan: "aficionado", mode: "tickets", confirm: true }}
            className="inline-block bg-brand-ink text-brand-cream px-8 py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors"
          >
            Use my tickets
          </Link>
        </div>
      )}

      <div className="bg-white border border-brand-taupe p-8 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-3">
          Buy Individual Tickets
        </p>
        <h3 className="font-serif text-2xl italic text-brand-ink mb-6">
          Top up your balance to enter
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {(["collector", "aficionado", "icon"] as const).map((id) => {
            const t = TIER_ONEOFF_PRICE[id];
            return (
              <Link
                key={id}
                to="/enter"
                search={{ raffle: raffle.id, plan: id, mode: "oneoff", confirm: true }}
                className="border border-brand-taupe hover:border-brand-ink p-5 text-center transition-colors"
              >
                <p className="text-[10px] uppercase tracking-widest text-brand-gold mb-2">
                  {t.label}
                </p>
                <p className="font-serif text-3xl italic text-brand-ink mb-1">£{t.price}</p>
                <p className="text-xs text-brand-ink/60">{t.tickets} tickets</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConfirmationCard({
  raffle,
  plan,
  mode,
}: {
  raffle: Raffle;
  plan: "collector" | "aficionado" | "icon" | "postal";
  mode: "subscription" | "oneoff" | "tickets";
}) {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const authReady = typeof window !== "undefined" && !!session?.access_token;
  const tier = plan in TIER_ONEOFF_PRICE ? TIER_ONEOFF_PRICE[plan as keyof typeof TIER_ONEOFF_PRICE] : null;

  // Saved card lookup (oneoff only)
  const fetchPm = useServerFn(getSavedPaymentMethod);
  const pmQuery = useQuery({
    queryKey: ["saved-pm"],
    queryFn: () => fetchPm({ data: { environment: getStripeEnvironment() } }),
    enabled: authReady && mode === "oneoff",
  });

  // Ticket cap check (tickets mode)
  const fetchInfo = useServerFn(getDrawTicketInfo);
  const ticketsToSpend = mode === "tickets" ? 1 : 0;
  const infoQuery = useQuery({
    queryKey: ["draw-info", raffle.id],
    queryFn: () => fetchInfo({ data: { raffleId: raffle.id } }),
    enabled: authReady && mode === "tickets",
  });

  const enterFn = useServerFn(enterDrawWithTickets);
  const enterMutation = useMutation({
    mutationFn: () => enterFn({ data: { raffleId: raffle.id, tickets: ticketsToSpend } }),
    onSuccess: () => navigate({ to: "/members", search: { welcome: 1 } as any }),
  });

  const [showCheckout, setShowCheckout] = useState(false);

  const remaining = infoQuery.data?.remaining_for_user ?? 0;
  const maxPerUser = infoQuery.data?.max_per_user ?? 0;
  const overCap = mode === "tickets" && infoQuery.data && remaining < ticketsToSpend;

  function handleConfirm() {
    if (mode === "tickets") {
      enterMutation.mutate();
    } else if (mode === "oneoff") {
      setShowCheckout(true);
    }
  }

  if (showCheckout && tier) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-brand-taupe p-6 md:p-8">
          <h3 className="font-serif text-2xl italic text-brand-ink mb-1">Secure checkout</h3>
          <p className="text-xs text-brand-ink/60">
            {tier.label} — £{tier.price} · {tier.tickets} tickets
          </p>
        </div>
        <StripeEmbeddedCheckout
          priceId={tier.priceId}
          customerEmail={user?.email ?? undefined}
          userId={user?.id}
          returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&raffle=${raffle.id}`}
        />
        <button
          type="button"
          onClick={() => setShowCheckout(false)}
          className="mt-2 text-xs uppercase tracking-widest text-brand-ink/50 hover:text-brand-ink"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-taupe p-8 md:p-12 max-w-xl mx-auto">
      <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-3 text-center">
        Draw No. {raffle.draw_number}
      </p>
      <h3 className="font-serif text-2xl italic text-brand-ink mb-6 text-center">
        {raffle.prize_name}
      </h3>

      <dl className="space-y-3 border-y border-brand-ink/10 py-6 mb-6">
        <Row
          label="Option"
          value={
            mode === "tickets"
              ? `Use ${ticketsToSpend} subscription ticket${ticketsToSpend === 1 ? "" : "s"}`
              : `${tier?.label ?? plan} pack — ${tier?.tickets ?? 0} tickets`
          }
        />
        <Row
          label="Total"
          value={mode === "tickets" ? "£0.00" : `£${tier?.price.toFixed(2) ?? "0.00"}`}
        />
        {mode === "oneoff" && (
          <Row
            label="Payment method"
            value={
              pmQuery.isLoading
                ? "Loading…"
                : pmQuery.data
                  ? `${capitalise(pmQuery.data.brand)} ···· ${pmQuery.data.last4}`
                  : "No saved card — enter at checkout"
            }
            trailing={
              pmQuery.data ? (
                <button
                  type="button"
                  onClick={() => setShowCheckout(true)}
                  className="text-[10px] uppercase tracking-widest underline text-brand-ink/60 hover:text-brand-ink"
                >
                  Change
                </button>
              ) : undefined
            }
          />
        )}
        {mode === "tickets" && infoQuery.data && (
          <Row
            label="Cap"
            value={`Max ${maxPerUser} tickets per user in this draw (you have ${infoQuery.data.user_existing} entered)`}
          />
        )}
      </dl>

      {overCap && (
        <p className="text-xs text-destructive text-center mb-4">
          You can enter a maximum of {maxPerUser} tickets into this draw.
        </p>
      )}

      {enterMutation.isError && (
        <p className="text-xs text-destructive text-center mb-4">
          {enterMutation.error instanceof Error
            ? enterMutation.error.message.startsWith("TICKET_CAP_EXCEEDED")
              ? `You can enter a maximum of ${enterMutation.error.message.split(":")[1] || ""} tickets into this draw.`
              : enterMutation.error.message === "INSUFFICIENT_BALANCE"
                ? "You don't have enough tickets. Top up below."
                : "Could not complete entry. Please try again."
            : "Could not complete entry. Please try again."}
        </p>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!!overCap || enterMutation.isPending || (mode === "tickets" && infoQuery.isLoading)}
        className="w-full bg-brand-ink text-brand-cream py-4 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors disabled:opacity-60"
      >
        {enterMutation.isPending ? "Confirming…" : "Confirm Entry"}
      </button>

      <div className="text-center mt-4">
        <Link
          to="/raffle/$id"
          params={{ id: raffle.id }}
          className="text-[11px] text-brand-ink/50 hover:text-brand-ink underline underline-offset-2"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-brand-ink/50 pt-1">{label}</dt>
      <dd className="text-sm text-brand-ink text-right flex-1">
        {value}
        {trailing && <span className="ml-3 inline-block">{trailing}</span>}
      </dd>
    </div>
  );
}

function PaymentFailedBanner() {
  return (
    <div className="bg-brand-cream border-b border-brand-taupe">
      <div className="container mx-auto px-6 py-3 text-center text-xs text-brand-ink/60">
        Your payment was not completed. Please try again.
      </div>
    </div>
  );
}

function capitalise(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}
