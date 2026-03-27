function getOptionalEnv(name: string) {
  return process.env[name];
}

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
}

export const isDemoMode =
  process.env.LOCAL_DEMO_MODE === "true" ||
  (process.env.NODE_ENV === "development" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL || !getPublicSupabaseKey()));

export const env = {
  supabaseUrl: getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getPublicSupabaseKey(),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "submissions"
};

export function requireSupabaseEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = name === "NEXT_PUBLIC_SUPABASE_ANON_KEY" ? getPublicSupabaseKey() : process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}
