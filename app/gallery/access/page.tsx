import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DEMO_GALLERY_CODE } from "@/lib/demo";
import { ensureProfile } from "@/lib/access";
import { grantGalleryAccessAction } from "@/lib/actions";
import { isDemoMode } from "@/lib/env";

export default async function GalleryAccessPage({
  searchParams
}: {
  searchParams: { error?: string; code?: string };
}) {
  await ensureProfile();

  return (
    <main className="page-wash min-h-[calc(100vh-160px)]">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Secure portal</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl">
            View the
            <br />
            competition gallery
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Signed-in viewers use a short one-time gallery code to enter the private exhibition space.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Enter gallery access code</CardTitle>
              <CardDescription>Use a one-time code shared by a student fundraiser sheet or by the organizers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {searchParams.error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</p> : null}
              {isDemoMode ? (
                <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  Demo code: <span className="font-semibold text-slate-950">{DEMO_GALLERY_CODE}</span>
                </p>
              ) : null}
              <form action={grantGalleryAccessAction} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold text-slate-900">Gallery code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="ART-ABCD-EFGH"
                    autoCapitalize="characters"
                    defaultValue={searchParams.code ?? ""}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enter Gallery
                </Button>
              </form>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600">
                <p className="font-medium text-slate-900">How to get a gallery code</p>
                <p className="mt-2">
                  Students receive 10 printable one-time gallery codes after they submit artwork. Each code can be sold
                  for $1 cash and works for one parent or supporter account only. Once a code is redeemed here, it
                  stays linked to that account.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">Signed in</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800">One-time code</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-slate-700">Approved works only</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
