import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession } from "@/lib/auth";
import { sanitizeNextPath } from "@/lib/redirects";
import { signInWithPasswordAction, signUpWithPasswordAction } from "@/lib/actions";

export default async function SignInPage({
  searchParams
}: {
  searchParams: { next?: string; error?: string; created?: string; email?: string; mode?: string };
}) {
  const user = await getSession();
  const next = sanitizeNextPath(searchParams.next);

  if (user) {
    redirect(next);
  }

  const mode = searchParams.mode === "create-account" ? "create-account" : "sign-in";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-4 py-12 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-stone-300 bg-secondary/35">
          <CardHeader>
            <CardTitle>Competition access</CardTitle>
            <CardDescription>
              Use email and password for student submissions, gallery access, judging, and admin tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Returning users can sign in directly with their email and password.</p>
            <p>New users can create an account on this page. If email confirmation is enabled in Supabase, you&apos;ll verify once and then sign in normally.</p>
            <p>If an email is on the admin allowlist, that still does not create the login account. You must create the auth account with that same email first.</p>
            <p>Protected pages still bring you back to the right destination after authentication.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <a
                href={`/sign-in?mode=sign-in${next ? `&next=${encodeURIComponent(next)}` : ""}`}
                className={tabClassName(mode === "sign-in")}
              >
                Sign in
              </a>
              <a
                href={`/sign-in?mode=create-account${next ? `&next=${encodeURIComponent(next)}` : ""}`}
                className={tabClassName(mode === "create-account")}
              >
                Create account
              </a>
            </div>
            <CardTitle>{mode === "sign-in" ? "Sign in" : "Create account"}</CardTitle>
            <CardDescription>
              {mode === "sign-in"
                ? "Use your email and password."
                : "Create a password-based account for the competition site."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {searchParams.error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
          ) : null}
          {searchParams.created ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Account created for {searchParams.email ?? "your email"}. If confirmation is required, check your inbox. Otherwise, sign in now.
            </p>
          ) : null}
            {mode === "sign-in" ? (
              <form action={signInWithPasswordAction} className="space-y-4">
                <input type="hidden" name="next" value={next} />
                <div className="space-y-2">
                  <Label htmlFor="sign-in-email">Email</Label>
                  <Input id="sign-in-email" name="email" type="email" placeholder="you@example.com" defaultValue={searchParams.email ?? ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sign-in-password">Password</Label>
                  <Input id="sign-in-password" name="password" type="password" placeholder="Your password" required />
                </div>
                <Button className="w-full" size="lg" type="submit">
                  Sign in
                </Button>
              </form>
            ) : (
              <form action={signUpWithPasswordAction} className="space-y-4">
                <input type="hidden" name="next" value={next} />
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input id="create-email" name="email" type="email" placeholder="you@example.com" defaultValue={searchParams.email ?? ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input id="create-password" name="password" type="password" placeholder="At least 8 characters" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input id="confirm-password" name="confirm_password" type="password" placeholder="Repeat your password" required />
                </div>
                <Button className="w-full" size="lg" type="submit">
                  Create account
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function tabClassName(active: boolean) {
  return active
    ? "inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
    : "inline-flex h-10 items-center rounded-md border bg-white px-4 text-sm font-medium text-foreground";
}
