import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { SignOutButton } from "@/components/sign-out-button";

type SiteShellProps = {
  user: User | null;
  redeemedGalleryCodes?: string[];
  children: React.ReactNode;
};

export function SiteShell({ user, redeemedGalleryCodes = [], children }: SiteShellProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/gallery/access", label: "Gallery" },
    { href: "/submit", label: "Submit" },
    { href: "/judge/access", label: "Judge Access" },
    { href: "/admin", label: "Admin" }
  ];
  const displayName = user?.user_metadata.full_name ?? user?.user_metadata.name ?? null;
  const showSeparateEmail = Boolean(user?.email && displayName && displayName !== user.email);

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link href="/" className="text-[1.85rem] font-semibold tracking-[-0.04em] text-slate-900">
            AI Art Competition
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right text-sm lg:block">
                  <p className="font-medium text-slate-900">{displayName ?? user.email}</p>
                  {showSeparateEmail ? <p className="text-slate-500">{user.email}</p> : null}
                  {redeemedGalleryCodes.length > 0 ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-sky-700">
                      Redeemed code:{" "}
                      <span className="font-semibold tracking-[0.18em] text-slate-700">
                        {redeemedGalleryCodes[0]}
                      </span>
                    </p>
                  ) : null}
                </div>
                <SignOutButton />
              </>
              ) : (
              <>
                <Link href="/sign-in" className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline-flex">
                  Gallery
                </Link>
                <Link href="/sign-in" className={buttonClassName}>
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="border-t border-slate-100 md:hidden">
          <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-3 text-sm font-medium text-slate-500 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/70 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>Organized by student groups at UCLA and local volunteers</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-slate-900">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-slate-900">
              Privacy
            </Link>
            <a href="mailto:laces.ai.and.art@gmail.com" className="transition-colors hover:text-slate-900">
              laces.ai.and.art@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const buttonClassName =
  "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(33,99,179,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary/92";
