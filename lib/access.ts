import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_GALLERY_CODE, DEMO_JUDGE_CODE } from "@/lib/demo";
import { isDemoMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function ensureProfile() {
  if (isDemoMode) {
    return requireUser();
  }

  const supabase = await createClient();
  const user = await requireUser();

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata.full_name ?? user.user_metadata.name ?? null
    },
    { onConflict: "id" }
  );

  return user;
}

export async function requireGalleryAccess() {
  const user = await requireUser("/gallery/access");

  if (isDemoMode) {
    const hasGrant = cookies().get("demo_gallery_access")?.value === DEMO_GALLERY_CODE;

    if (!hasGrant) {
      redirect("/gallery/access");
    }

    return user;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_access_grants")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!data) {
    redirect("/gallery/access");
  }

  return user;
}

export async function requireJudgeAccess() {
  const user = await requireUser("/judge/access");

  if (isDemoMode) {
    const hasGrant = cookies().get("demo_judge_access")?.value === DEMO_JUDGE_CODE;

    if (!hasGrant) {
      redirect("/judge/access");
    }

    return {
      user,
      grant: {
        id: "demo-grant",
        judge_code_id: "demo-judge-code"
      }
    };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("judge_access_grants")
    .select("id, judge_code_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!data) {
    redirect("/judge/access");
  }

  return { user, grant: data };
}

export async function requireAdmin() {
  const { user, isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    redirect("/admin?error=permission");
  }

  return user;
}

export async function getAdminAccess() {
  const user = await requireUser("/admin");

  if (isDemoMode) {
    return { user, isAdmin: true };
  }

  const admin = createAdminClient();
  const normalizedEmail = (user.email ?? "").trim().toLowerCase();

  const { data, error } = await admin
    .from("admins")
    .select("email, active")
    .eq("active", true)
    .limit(500);

  if (error) {
    throw new Error(`Admin lookup failed: ${error.message}`);
  }

  const isAdmin = (data ?? []).some((row) => (row.email ?? "").trim().toLowerCase() === normalizedEmail);

  return {
    user,
    isAdmin
  };
}

export async function requireVotingAccess(accessType: "gallery" | "judge") {
  if (accessType === "gallery") {
    const user = await requireGalleryAccess();
    return {
      user,
      grant: {
        judge_code_id: null as string | null
      }
    };
  }

  return requireJudgeAccess();
}
