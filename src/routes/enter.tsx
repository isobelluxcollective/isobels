import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { currentRaffle, postalAddress, subscriptionTiers } from "@/lib/raffle-data";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/enter")({
  head: () => ({
    meta: [
      { title: "Enter the Draw — Isobel" },
      {
        name: "description",
        content:
          "Choose a monthly subscription, buy individual tickets, or enter free by post. 5% of profits to charity.",
      },
      { property: "og:title", content: "Enter the Isobel Draw" },
      {
        property: "og:description",
        content: "Subscribe monthly, buy one-off tickets, or enter free by post.",
      },
    ],
  }),
  component: EnterPage,
});

type Tab = "subscription" | "oneoff" | "postal";

const entrantSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be under 50 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  dob: z.string().refine(
    (s) => {
      if (!s) return false;
      const d = new Date(s);
      if (Number.isNaN(d.getTime())) return false;
      const eighteen = new Date();
      eighteen.setFullYear(eighteen.getFullYear() - 18);
      return d <= eighteen;
    },
    { message: "You must be 18 or over to enter" },
  ),
  instagram: z
    .string()
    .trim()
    .max(50)
    .regex(/^@?[a-zA-Z0-9._]*$/, "Invalid handle")
    .optional()
    .or(z.literal("")),
  publicityConsent: z.boolean(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms & Conditions" }),
  }),
});

function EnterPage() {
  const [tab, setTab] = useState<Tab>("subscription");
  const [selectedTier, setSelectedTier] = useState<string>("25");
  const [quantity, setQuantity] = useState(5);

  return (
    <>
      <section className="bg-white pt-16 pb-12 border-b border-brand-ink/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-4">
            Draw No. {currentRaffle.drawNumber}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ink mb-4">
            Enter the Draw
          </h1>
          <p className="text-sm text-brand-ink/60 max-w-xl mx-auto">
            Win the <em>{currentRaffle.prizeShort}</em>. Choose how you'd like to enter.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-brand-cream">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-brand-taupe mb-12 justify-center gap-x-8 sm:gap-x-12 gap-y-2">
            {[
              { id: "subscription", label: "Subscription" },
              { id: "oneoff", label: "One-off Tickets" },
              { id: "postal", label: "Free Postal" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id as Tab)}
                className={cn(
                  "pb-4 border-b-2 text-xs uppercase tracking-[0.2em] font-bold transition-all",
                  tab === t.id
                    ? "border-brand-ink text-brand-ink"
                    : "border-transparent text-brand-ink/40 hover:text-brand-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "subscription" && (
            <SubscriptionPanel selected={selectedTier} onSelect={setSelectedTier} />
          )}
          {tab === "oneoff" && (
            <OneOffPanel quantity={quantity} onQuantity={setQuantity} />
          )}
          {tab === "postal" && <PostalPanel />}

          {tab !== "postal" && (
            <EntrantForm
              tab={tab}
              selectedTier={selectedTier}
              quantity={quantity}
            />
          )}
        </div>
      </section>
    </>
  );
}

function SubscriptionPanel({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {subscriptionTiers.map((t) => {
        const isSelected = selected === t.id;
        const isPopular = "popular" in t && t.popular;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              "p-8 text-center transition-colors relative flex flex-col items-center",
              isSelected
                ? "bg-brand-ink text-brand-cream"
                : "border border-brand-taupe hover:border-brand-gold bg-white text-brand-ink",
            )}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-cream text-[9px] px-3 py-1 uppercase tracking-tighter">
                Most Popular
              </div>
            )}
            <span
              className={cn(
                "text-[10px] uppercase tracking-widest mb-4",
                isSelected ? "text-brand-gold" : "text-brand-gold",
              )}
            >
              {t.label}
            </span>
            <h3 className="font-serif text-3xl mb-2 italic">£{t.price}</h3>
            <p className={cn("text-xs mb-2", isSelected ? "text-brand-cream/60" : "text-brand-ink/60")}>
              per month
            </p>
            <p className={cn("text-xs", isSelected ? "text-brand-cream/80" : "text-brand-ink/80")}>
              {t.entries} entries per draw
            </p>
            <div
              className={cn(
                "mt-6 w-full py-3 text-[10px] uppercase tracking-widest font-bold",
                isSelected ? "bg-brand-gold text-brand-ink" : "bg-brand-cream border border-brand-ink/10",
              )}
            >
              {isSelected ? "Selected" : "Choose Plan"}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function OneOffPanel({
  quantity,
  onQuantity,
}: {
  quantity: number;
  onQuantity: (n: number) => void;
}) {
  const total = quantity * currentRaffle.ticketPrice;
  return (
    <div className="bg-white border border-brand-taupe p-10 md:p-14 mb-16 text-center max-w-2xl mx-auto">
      <span className="text-[10px] uppercase tracking-widest text-brand-gold">
        £{currentRaffle.ticketPrice} per ticket
      </span>
      <h3 className="font-serif text-3xl italic mt-2 mb-8">How many tickets?</h3>

      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onQuantity(Math.max(1, quantity - 1))}
          className="size-12 grid place-items-center border border-brand-ink/20 hover:border-brand-ink rounded-full transition-colors"
        >
          <Minus className="size-4" />
        </button>
        <input
          type="number"
          min={1}
          max={9999}
          value={quantity}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            if (Number.isFinite(n) && n >= 1) onQuantity(Math.min(9999, n));
          }}
          className="font-serif text-5xl italic w-24 text-center bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onQuantity(Math.min(9999, quantity + 1))}
          className="size-12 grid place-items-center border border-brand-ink/20 hover:border-brand-ink rounded-full transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex items-baseline justify-center gap-3 pt-6 border-t border-brand-ink/10">
        <span className="text-[10px] uppercase tracking-widest text-brand-ink/50">Total</span>
        <span className="font-serif text-3xl italic">£{total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function PostalPanel() {
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
          <li>· The raffle title: <em>{currentRaffle.prizeName}</em></li>
          <li>· A statement: "I would like one free entry."</li>
        </ul>
      </div>

      <div className="bg-brand-cream p-6">
        <p className="text-[10px] uppercase tracking-widest text-brand-ink/50 mb-3">Send to</p>
        <address className="not-italic text-sm text-brand-ink/90 leading-relaxed font-medium">
          {postalAddress.line2}
          <br />
          {postalAddress.line3}
          <br />
          {postalAddress.line4}
          <br />
          {postalAddress.line5}
        </address>
      </div>

      <p className="text-xs text-brand-ink/50 mt-6 leading-relaxed">
        Entries must be received no later than 48 hours before the draw closes. One free postal
        entry per person per draw.
      </p>
    </div>
  );
}

function EntrantForm({
  tab,
  selectedTier,
  quantity,
}: {
  tab: "subscription" | "oneoff";
  selectedTier: string;
  quantity: number;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const tier = subscriptionTiers.find((t) => t.id === selectedTier);
  const summary =
    tab === "subscription"
      ? `${tier?.label} — £${tier?.price}/mo · ${tier?.entries} entries per draw`
      : `${quantity} ticket${quantity === 1 ? "" : "s"} — £${(quantity * currentRaffle.ticketPrice).toFixed(2)}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = entrantSchema.safeParse({
      firstName: data.get("firstName"),
      email: data.get("email"),
      dob: data.get("dob"),
      instagram: data.get("instagram") || "",
      publicityConsent: data.get("publicityConsent") === "on",
      termsAccepted: data.get("termsAccepted") === "on",
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    // Payment integration goes here. For now: simulate.
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 800);
  }

  if (done) {
    return (
      <div className="bg-white border border-brand-taupe p-10 md:p-14 max-w-2xl mx-auto text-center mt-12">
        <h3 className="font-serif text-3xl italic text-brand-ink mb-4">Thank you</h3>
        <p className="text-sm text-brand-ink/70 max-w-md mx-auto">
          Your details have been received. In the full launch this is where we'd hand you off to
          Stripe checkout to complete payment. We've recorded your publicity preferences.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 text-xs uppercase tracking-[0.2em] font-bold border-b border-brand-ink pb-1"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-taupe p-8 md:p-12 max-w-2xl mx-auto">
      <h3 className="font-serif text-2xl italic text-brand-ink mb-2">Your details</h3>
      <p className="text-xs text-brand-ink/60 mb-8">{summary}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="First name" name="firstName" error={errors.firstName}>
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            maxLength={50}
            className="w-full border-b border-brand-ink/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-ink transition-colors"
          />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={255}
            className="w-full border-b border-brand-ink/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-ink transition-colors"
          />
        </Field>

        <Field label="Date of birth (18+)" name="dob" error={errors.dob}>
          <input
            name="dob"
            type="date"
            required
            className="w-full border-b border-brand-ink/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-ink transition-colors"
          />
        </Field>

        <Field
          label="Instagram handle (optional)"
          name="instagram"
          error={errors.instagram}
        >
          <input
            name="instagram"
            type="text"
            placeholder="@yourhandle"
            maxLength={50}
            className="w-full border-b border-brand-ink/20 bg-transparent py-2 text-sm focus:outline-none focus:border-brand-ink transition-colors"
          />
        </Field>

        <label className="flex items-start gap-3 text-sm text-brand-ink/80 cursor-pointer pt-4">
          <input
            type="checkbox"
            name="publicityConsent"
            className="mt-1 size-4 accent-brand-ink"
          />
          <span>
            I'm happy for my first name and Instagram handle to be shared on the Isobel website
            and social channels if I win.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-brand-ink/80 cursor-pointer">
          <input
            type="checkbox"
            name="termsAccepted"
            required
            className="mt-1 size-4 accent-brand-ink"
          />
          <span>
            I'm 18 or over and agree to the{" "}
            <a href="#" className="underline">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-xs text-destructive -mt-4">{errors.termsAccepted}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-ink text-brand-cream py-5 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors disabled:opacity-60"
        >
          {submitting
            ? "Processing…"
            : tab === "subscription"
              ? `Subscribe — £${tier?.price}/mo`
              : `Continue to Payment — £${(quantity * currentRaffle.ticketPrice).toFixed(2)}`}
        </button>

        <p className="text-[10px] text-brand-ink/40 text-center leading-relaxed">
          Secure checkout powered by Stripe. Your card details are never stored by Isobel.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[10px] uppercase tracking-widest text-brand-ink/50 block mb-2"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
