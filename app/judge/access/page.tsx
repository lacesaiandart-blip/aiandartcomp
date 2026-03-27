import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DEMO_JUDGE_CODE } from "@/lib/demo";
import { ensureProfile } from "@/lib/access";
import { grantJudgeAccessAction } from "@/lib/actions";
import { isDemoMode } from "@/lib/env";

export default async function JudgeAccessPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  await ensureProfile();

  return (
    <main className="page-wash min-h-[calc(100vh-160px)]">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label">Private judging portal</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl">
            Judge access
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Judges sign in, enter their assigned code, and then review approved submissions with prompt logs and process notes.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <Card className="p-2">
            <CardHeader>
              <CardTitle>Activate judging access</CardTitle>
              <CardDescription>Use the code assigned to your judging account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {searchParams.error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</p> : null}
              {isDemoMode ? (
                <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                  Demo code: <span className="font-semibold text-slate-950">{DEMO_JUDGE_CODE}</span>
                </p>
              ) : null}
              <form action={grantJudgeAccessAction} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold text-slate-900">Judge code</Label>
                  <Input id="code" name="code" placeholder="JUDGE-A" autoCapitalize="characters" required />
                </div>
                <Button type="submit" className="w-full">
                  Continue to Judging
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
