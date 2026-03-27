import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { getSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "High School AI Art Competition",
  description: "A high school AI art competition organized by UCLA student groups and local volunteers."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en">
      <body>
        <SiteShell user={user}>
          {isDemoMode ? (
            <div className="border-b border-sky-100 bg-sky-50/85">
              <div className="mx-auto max-w-6xl px-4 py-2 text-sm text-sky-800 sm:px-6">
                Local demo mode is active. Auth, uploads, moderation, and votes are preview-only.
              </div>
            </div>
          ) : null}
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
