import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { to: "/raffle" as const, label: "Current Raffles" },
  { to: "/about" as const, label: "About" },
  { to: "/winners" as const, label: "Past Winners" },
  { to: "/community" as const, label: "Community" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-cream/90 backdrop-blur-md border-b border-brand-ink/5">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="font-serif text-3xl tracking-tight italic text-brand-ink">
          Isobel
        </Link>

        <nav className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-medium">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-brand-ink hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="text-brand-ink hover:text-brand-gold transition-colors uppercase tracking-[0.2em]"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              search={{ redirect: "/enter", mode: "signup" }}
              className="text-brand-ink hover:text-brand-gold transition-colors"
            >
              Sign up
            </Link>
          )}
          <Link
            to={user ? "/enter" : "/login"}
            search={user ? undefined : { redirect: "/enter" }}
            className="bg-brand-ink text-brand-cream px-8 py-3 rounded-full hover:bg-brand-gold transition-colors duration-300"
          >
            Enter Now
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-brand-ink"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-ink/5 bg-brand-cream">
          <nav className="flex flex-col px-6 py-6 space-y-4 text-sm uppercase tracking-[0.2em] font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-brand-ink hover:text-brand-gold py-2"
                activeProps={{ className: "text-brand-gold" }}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-left text-brand-ink hover:text-brand-gold py-2 uppercase tracking-[0.2em]"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                search={{ redirect: "/enter", mode: "signup" }}
                onClick={() => setOpen(false)}
                className="text-brand-ink hover:text-brand-gold py-2"
              >
                Sign up
              </Link>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <Link
                to="/auth"
                search={{ redirect: "/enter", mode: "signup" }}
                onClick={() => setOpen(false)}
                className="border border-brand-ink text-brand-ink bg-transparent text-center px-8 py-4 rounded-full hover:bg-brand-ink/5 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/auth"
                search={{ redirect: "/enter", mode: "signin" }}
                onClick={() => setOpen(false)}
                className="bg-brand-ink text-brand-cream text-center px-8 py-4 rounded-full hover:bg-brand-gold transition-colors"
              >
                Log In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
