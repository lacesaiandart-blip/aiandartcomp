import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateAccountForm } from "@/components/create-account-form";
import { getSession } from "@/lib/auth";
import { sanitizeNextPath } from "@/lib/redirects";
import { signInWithPasswordAction, signUpWithPasswordAction } from "@/lib/actions";

export default async function SignInPage({
  searchParams
}: {
  searchParams: { next?: string; error?: string; created?: string; email?: string; mode?: string; notice?: string };
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
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to submit artwork, view the gallery, or enter a judge code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Use your email and password to access the competition site.</p>
            <p>If this is your first time here, create an account with your email.</p>
            <p>After you sign in, you will return to the page you were trying to open.</p>
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
                ? "Enter your email and password."
                : "Create your account to use the competition site."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {searchParams.notice === "signin" ? (
            <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
              Please sign in first.
            </p>
          ) : null}
          {searchParams.error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
          ) : null}
          {searchParams.created ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Account created for {searchParams.email ?? "your email"}. Check your inbox if you need to confirm your email, then sign in.
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
              <CreateAccountForm
                action={signUpWithPasswordAction}
                defaultEmail={searchParams.email ?? ""}
                next={next}
              />
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
