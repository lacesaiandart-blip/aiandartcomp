import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"), requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server components can read cookies but cannot always mutate them.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Server components can read cookies but cannot always mutate them.
        }
      }
    }
  });
}
