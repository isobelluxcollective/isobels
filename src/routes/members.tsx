import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Members Portal — Isobel" },
      { name: "description", content: "Your Isobel members portal: entries, orders and details." },
    ],
  }),
  component: MembersPage,
});

type Profile = { first_name: string | null };

function MembersPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: "/members" } });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data ?? { first_name: null }));
  }, [user]);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  if (loading || !user) {
    return (
      <section className="bg-brand-cream py-20 min-h-[60vh]">
        <div className="container mx-auto px-6 text-center text-sm text-brand-ink/60">Loading…</div>
      </section>
    );
  }

  const firstName = profile?.first_name?.trim() || "there";
  const email = user.email ?? "";

  return (
    <section className="bg-brand-cream py-16 md:py-20 min-h-[60vh]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold mb-3">
            Members Portal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl italic text-brand-ink">
            Welcome back, {firstName}
          </h1>
        </div>

        {/* Section 1 — My Active Entries */}
        <SectionHeading title="My Active Entries" />
        <div className="mb-16 bg-white border border-brand-taupe p-10 md:p-14 text-center">
          <p className="font-serif italic text-2xl text-brand-ink/70 mb-6">
            You haven't entered any draws yet.
          </p>
          <Link
            to="/raffle"
            className="inline-block bg-brand-ink text-brand-cream px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold transition-colors"
          >
            Explore Live Draws
          </Link>
        </div>

        {/* Section 2 — Past Draws */}
        <SectionHeading title="Past Draws" />
        <div className="mb-16 bg-white border border-brand-taupe overflow-hidden">
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-brand-taupe bg-brand-cream/50 text-[10px] uppercase tracking-[0.2em] text-brand-ink/60 font-semibold">
            <div>Draw Name</div>
            <div>Tickets Held</div>
            <div>Draw Date</div>
            <div>Outcome</div>
          </div>
          <div className="px-6 py-12 text-center text-sm text-brand-ink/60 italic">
            No past entries yet — your history will appear here after your first draw closes.
          </div>
        </div>

        {/* Section 3 — My Details */}
        <SectionHeading title="My Details" />
        <div className="mb-16 bg-white border border-brand-taupe p-8 md:p-10">
          <dl className="space-y-4 mb-6">
            <Row label="Name" value={profile?.first_name ?? "—"} />
            <Row label="Email" value={email} />
          </dl>
          <button
            type="button"
            className="border border-brand-ink text-brand-ink px-6 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] hover:bg-brand-ink hover:text-brand-cream transition-colors"
          >
            Edit Details
          </button>
        </div>

        {/* Section 4 — My Orders */}
        <SectionHeading title="My Orders" />
        <div className="mb-16 bg-white border border-brand-taupe overflow-hidden">
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-brand-taupe bg-brand-cream/50 text-[10px] uppercase tracking-[0.2em] text-brand-ink/60 font-semibold">
            <div>Date</div>
            <div>Item</div>
            <div>Tickets</div>
            <div>Amount</div>
          </div>
          <div className="px-6 py-12 text-center text-sm text-brand-ink/60 italic">
            No orders yet.
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-[12px] text-brand-ink/50 hover:text-brand-ink underline underline-offset-4 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="font-serif italic text-3xl md:text-4xl text-brand-ink mb-5">{title}</h2>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-brand-ink/50 w-24">{label}</dt>
      <dd className="text-sm text-brand-ink">{value}</dd>
    </div>
  );
}
