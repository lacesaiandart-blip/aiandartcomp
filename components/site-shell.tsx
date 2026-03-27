import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { SignOutButton } from "@/components/sign-out-button";

type SiteShellProps = {
  user: User | null;
  children: React.ReactNode;
};

export function SiteShell({ user, children }: SiteShellProps) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/gallery/access", label: "Gallery" },
    { href: "/submit", label: "Submit" },
    { href: "/judge/access", label: "Judge Access" },
    { href: "/admin", label: "Admin" }
  ];

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
                  <p className="font-medium text-slate-900">{user.user_metadata.full_name ?? user.email}</p>
                  <p className="text-slate-500">{user.email}</p>
                </div>
                <SignOutButton />
              </>
              ) : (
              <>
                <Link href="/sign-in" className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 sm:inline-flex">
                  Log in
                </Link>
                <Link href="/gallery/access" className={buttonClassName}>
                  Access Gallery
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
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-slate-500 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-base font-semibold text-slate-900">AI Art Competition</p>
            <p className="mt-3 max-w-xs leading-6">
              Organized by UCLA student groups and local volunteers for high school students exploring digital art and AI-assisted process.
            </p>
          </div>
          <div>
            <p className="section-label">Resources</p>
            <div className="mt-3 space-y-2">
              <Link href="/submit" className="block transition-colors hover:text-slate-900">Submission portal</Link>
              <Link href="/gallery/access" className="block transition-colors hover:text-slate-900">Gallery access</Link>
              <Link href="/judge/access" className="block transition-colors hover:text-slate-900">Judge access</Link>
            </div>
          </div>
          <div>
            <p className="section-label">Contact</p>
            <div className="mt-3 space-y-2">
              <a href="mailto:aiartcompetition@ucla.edu" className="block transition-colors hover:text-slate-900">aiartcompetition@ucla.edu</a>
              <p>Review updates usually take 24-48 hours.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const buttonClassName =
  "inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(33,99,179,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary/92";
