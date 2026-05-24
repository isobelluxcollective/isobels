# Isobel — Luxury Women's Raffle Website

A 5-page launch site for Isobel, a women's luxury raffle company (designer clothing, handbags, accessories). Visually inspired by Omaze: large editorial hero imagery, generous whitespace, confident serif typography, focused entry flow.

## Global navigation

A site-wide header lives in `__root.tsx` so it appears on every page. Wordmark "Isobel" on the left, navigation on the right:

- Desktop (≥ md): inline links — **Current Raffle · About · Past Winners** + a prominent **"Enter now"** button (links to `/enter`).
- Mobile (< md): same wordmark, **hamburger toggle in the top-right** that opens a sheet/drawer with the same links + Enter CTA.
- Active link styled with `activeProps`. Header is sticky, translucent over hero, solid on scroll.

## Pages (v1)

1. **`/` — Home:** sticky header (above), hero with current prize teaser, "How it works" 3 steps, 5%-to-charity strip, past-winners preview, footer + newsletter.
2. **`/raffle` — Current Raffle:** prize showcase, gallery, draw-date countdown, "Enter now" CTA → `/enter`, odds, T&Cs, FAQ.
3. **`/enter` — Entry options + checkout:** Omaze-style tabbed page:
   - **Monthly subscription** (default, "best value"): £10 / £25 / £50/mo → 12 / 30 / 60 entries/draw.
   - **One-off entries:** £10/ticket, quantity stepper, live total.
   - **Free postal entry:** address + slip format, manual processing.
   - **Entrant details form** before checkout: first name, email, DOB (18+), Instagram (optional), ☐ publicity consent, ☐ T&Cs (required).
4. **`/about` — About Isobel:** brand story, mission, 5%-to-charity callout (partner "announcing soon"), how-it-works recap, CTA to current raffle.
5. **`/winners` — Past Winners:** chronological list grouped by month. Each card: prize image, prize name, draw date, winner's first name + (if consented) Instagram handle, short quote. Seeded with 3–4 placeholder raffles.

## Design direction

3 luxury design directions rendered as prototypes; you pick one before build. Defaults: serif display headings (Cormorant / Fraunces) + clean grotesk body (Inter / Manrope); ivory bg, deep charcoal text, single muted metallic accent.

## Technical plan

**Stack:** TanStack Start + Vite, Tailwind v4, shadcn/ui, Lovable Cloud, Lovable Built-in Stripe Payments.

**New files**
- `src/components/site-header.tsx` — sticky nav + mobile sheet toggle.
- `src/components/site-footer.tsx`.
- `src/routes/__root.tsx` — render `<SiteHeader />` + `<Outlet />` + `<SiteFooter />`.
- `src/routes/index.tsx` (replace placeholder)
- `src/routes/raffle.tsx`, `src/routes/enter.tsx`, `src/routes/about.tsx`, `src/routes/winners.tsx`
- `src/routes/api/public/stripe-webhook.ts` — signature-verified; handles `checkout.session.completed` + `invoice.paid`.

**Server functions**
- `getCurrentRaffle()`, `getPastWinners()`, `createOneOffCheckout({ quantity, entrant })`, `createSubscriptionCheckout({ tier, entrant })`. Entrant payload validated with Zod, 18+ enforced.

**Data model (Lovable Cloud)**
- `raffles`, `entrants`, `entries`, `subscriptions`, `winners` (public read safe-projects only first_name + instagram-when-consented). Writes via server fn / webhook using `supabaseAdmin`.

**Stripe products**
- One-off £10; Subs £10/£25/£50 monthly (metadata entries=12/30/60).

**SEO**
- Per-route `head()` with unique title/description/og tags; og:image per leaf route.

## Build order

1. Pick design direction.
2. Enable Lovable Cloud → tables → seed 1 raffle + 3 placeholder winners.
3. Enable Stripe Payments → create 4 products.
4. Build SiteHeader/SiteFooter + 5 pages.
5. Wire checkout server fns + Stripe webhook.
6. Generate imagery, polish, SEO pass.

## Out of scope for v1

Admin dashboard, user accounts, Stripe Customer Portal, automated postal intake form, Contact/Press pages, real charity partner integration.
