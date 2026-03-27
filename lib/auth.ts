import { cache } from "react";
import { redirect } from "next/navigation";
import { demoUser } from "@/lib/demo";
import { isDemoMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const getSession = cache(async () => {
  if (isDemoMode) {
    return demoUser;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
});

export async function requireUser(next?: string) {
  const user = await getSession();

  if (!user) {
    const destination = next ? `/sign-in?next=${encodeURIComponent(next)}` : "/sign-in";
    redirect(destination);
  }

  return user;
}
