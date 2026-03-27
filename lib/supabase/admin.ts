import { createClient } from "@supabase/supabase-js";
import { env, requireSupabaseEnv } from "@/lib/env";

export function createAdminClient() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"), env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
