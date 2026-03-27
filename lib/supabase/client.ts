"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/env";

export function createClient() {
  return createBrowserClient(requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"), requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}
