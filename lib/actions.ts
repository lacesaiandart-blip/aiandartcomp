"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { DEMO_GALLERY_CODE, DEMO_JUDGE_CODE, demoSubmissions } from "@/lib/demo";
import { env } from "@/lib/env";
import { isDemoMode } from "@/lib/env";
import { MAX_SUBMISSIONS_PER_USER } from "@/lib/constants";
import { MAX_VOTES_PER_USER } from "@/lib/votes";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile, requireAdmin, requireVotingAccess } from "@/lib/access";
import { sanitizeNextPath } from "@/lib/redirects";
import { submissionSchema } from "@/lib/validation";
import type { SubmissionStatus } from "@/lib/types";

const emailSignInSchema = z.object({
  email: z.string().email("Enter a valid email address.")
});

const passwordSignInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Enter your password.")
});

const passwordSignUpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string().min(8, "Confirm your password.")
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match."
  });

function mapAuthError(message: string, mode: "sign-in" | "sign-up") {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("email not confirmed") ||
    lower.includes("user already registered")
  ) {
    return mode === "sign-in"
      ? "Unable to sign in with that email and password."
      : "Unable to create account with those details.";
  }

  return message;
}

function notificationForStatus(artworkTitle: string, status: SubmissionStatus) {
  if (status === "approved") {
    return {
      kind: "approved" as const,
      message_title: "Submission accepted",
      message_body: `"${artworkTitle}" has been approved and is now part of the competition gallery.`
    };
  }

  if (status === "deleted") {
    return {
      kind: "rejected" as const,
      message_title: "Submission not accepted",
      message_body: `"${artworkTitle}" was not accepted for the competition. Review the rules and contact the organizers if you need clarification.`
    };
  }

  return {
    kind: "pending" as const,
    message_title: "Submission received",
    message_body: `"${artworkTitle}" is under review. Organizer review usually takes 24-48 hours.`
  };
}

export async function signInWithPasswordAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get("next") ?? "/"));
  const parsed = passwordSignInSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? "")
  });

  if (!parsed.success) {
    redirect(`/sign-in?mode=sign-in&error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Enter a valid email and password.")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  if (isDemoMode) {
    redirect(next ?? "/");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    redirect(`/sign-in?mode=sign-in&error=${encodeURIComponent(mapAuthError(error.message, "sign-in"))}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  redirect(next || "/");
}

export async function signUpWithPasswordAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get("next") ?? "/"));
  const parsed = passwordSignUpSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirm_password: String(formData.get("confirm_password") ?? "")
  });

  if (!parsed.success) {
    redirect(`/sign-in?mode=create-account&error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check your account details.")}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  if (isDemoMode) {
    redirect(next ?? "/");
  }

  const supabase = await createClient();
  const redirectTo = `${env.siteUrl}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: redirectTo
    }
  });

  if (error) {
    redirect(`/sign-in?mode=create-account&error=${encodeURIComponent(mapAuthError(error.message, "sign-up"))}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  if (data.session) {
    redirect(next || "/");
  }

  redirect(`/sign-in?mode=sign-in&created=1&email=${encodeURIComponent(parsed.data.email)}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
}

export async function signOutAction() {
  if (isDemoMode) {
    cookies().delete("demo_gallery_access");
    cookies().delete("demo_judge_access");
    cookies().delete("demo_submission_count");
    cookies().delete("demo_votes");
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function submitArtworkAction(formData: FormData) {
  const user = await ensureProfile();
  const parsed = submissionSchema.safeParse(Object.fromEntries(formData));
  const image = formData.get("image") as File | null;

  if (!parsed.success || !image || image.size === 0) {
    redirect("/submit?error=Please complete all required fields and upload an image.");
  }

  if (isDemoMode) {
    const currentCount = Number(cookies().get("demo_submission_count")?.value ?? "0");

    if (currentCount >= MAX_SUBMISSIONS_PER_USER) {
      redirect("/submit?error=You have already reached the two-entry limit.");
    }

    cookies().set("demo_submission_count", String(currentCount + 1), {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    revalidatePath("/submit");
    redirect("/submit?success=1");
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("submissions")
    .select("*", { head: true, count: "exact" })
    .eq("user_id", user.id)
    .neq("status", "deleted");

  if ((count ?? 0) >= MAX_SUBMISSIONS_PER_USER) {
    redirect("/submit?error=You have already reached the two-entry limit.");
  }

  const extension = image.name.split(".").pop() ?? "jpg";
  const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const admin = createAdminClient();
  const upload = await admin.storage.from(env.storageBucket).upload(filePath, image, {
    cacheControl: "3600",
    upsert: false,
    contentType: image.type
  });

  if (upload.error) {
    redirect("/submit?error=Image upload failed. Please try again.");
  }

  const payload = parsed.data;
  const { data: insertedSubmission, error } = await supabase.from("submissions").insert({
    user_id: user.id,
    student_name: payload.student_name,
    school: payload.school,
    email: payload.email,
    artwork_title: payload.artwork_title,
    theme: payload.theme,
    image_path: filePath,
    prompt_log: payload.prompt_log,
    ai_tools_used: payload.ai_tools_used,
    creative_process_statement: payload.creative_process_statement,
    integrity_agreed: true,
    status: "pending"
  }).select("id, artwork_title").single();

  if (error) {
    redirect(`/submit?error=${encodeURIComponent(error.message)}`);
  }

  if (insertedSubmission) {
    const notification = notificationForStatus(insertedSubmission.artwork_title, "pending");
    await admin.from("submission_notifications").insert({
      user_id: user.id,
      submission_id: insertedSubmission.id,
      artwork_title: insertedSubmission.artwork_title,
      ...notification
    });
  }

  revalidatePath("/submit");
  redirect("/submit?success=1");
}

export async function grantGalleryAccessAction(formData: FormData) {
  const user = await ensureProfile();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();

  if (isDemoMode) {
    if (code !== DEMO_GALLERY_CODE) {
      redirect("/gallery/access?error=Invalid gallery access code.");
    }

    cookies().set("demo_gallery_access", code, {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    redirect("/gallery");
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: accessCode } = await admin
    .from("gallery_access_codes")
    .select("id")
    .eq("code", code)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (!accessCode) {
    redirect("/gallery/access?error=Invalid gallery access code.");
  }

  await supabase.from("gallery_access_grants").upsert(
    {
      user_id: user.id,
      gallery_code_id: accessCode.id
    },
    { onConflict: "user_id,gallery_code_id" }
  );

  redirect("/gallery");
}

export async function grantJudgeAccessAction(formData: FormData) {
  const user = await ensureProfile();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();

  if (isDemoMode) {
    if (code !== DEMO_JUDGE_CODE) {
      redirect("/judge/access?error=Invalid judge code.");
    }

    cookies().set("demo_judge_access", code, {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    redirect("/judge");
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: accessCode } = await admin
    .from("judge_access_codes")
    .select("id")
    .eq("code", code)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (!accessCode) {
    redirect("/judge/access?error=Invalid judge code.");
  }

  await supabase.from("judge_access_grants").upsert(
    {
      user_id: user.id,
      judge_code_id: accessCode.id
    },
    { onConflict: "user_id,judge_code_id" }
  );

  redirect("/judge");
}

export async function submitVoteAction(formData: FormData) {
  const accessType = String(formData.get("access_type") ?? "");
  const destination = accessType === "judge" ? "/judge" : accessType === "gallery" ? `/gallery/${String(formData.get("submission_id") ?? "")}` : "/";

  if (accessType !== "gallery" && accessType !== "judge") {
    redirect("/?error=Invalid voting request.");
  }

  const { user, grant } = await requireVotingAccess(accessType);
  const submissionId = String(formData.get("submission_id") ?? "");

  if (!submissionId) {
    redirect(`${destination}?error=Invalid voting request.`);
  }

  if (isDemoMode) {
    const votedIds = new Set((cookies().get("demo_votes")?.value ?? "").split(",").filter(Boolean));

    if (votedIds.has(submissionId)) {
      redirect(`${destination}?error=You already used a vote on this artwork.`);
    }

    if (votedIds.size >= MAX_VOTES_PER_USER) {
      redirect(`${destination}?error=You have already used all 3 votes.`);
    }

    const approvedSubmissionIds = new Set(
      demoSubmissions
        .filter((submission) => submission.status === "approved")
        .map((submission) => submission.id)
    );

    if (!approvedSubmissionIds.has(submissionId)) {
      redirect(`${destination}?error=That entry is not available for voting.`);
    }

    votedIds.add(submissionId);
    cookies().set("demo_votes", [...votedIds].join(","), {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    revalidatePath("/judge");
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${submissionId}`);
    redirect(`${destination}?success=1`);
  }

  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("submissions")
    .select("id")
    .eq("id", submissionId)
    .eq("status", "approved")
    .limit(1)
    .maybeSingle();

  if (!submission) {
    redirect(`${destination}?error=That entry is not available for voting.`);
  }

  const { count } = await supabase
    .from("votes")
    .select("*", { head: true, count: "exact" })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_VOTES_PER_USER) {
    redirect(`${destination}?error=You have already used all 3 votes.`);
  }

  const { error } = await supabase.from("votes").insert({
    submission_id: submissionId,
    user_id: user.id,
    judge_code_id: grant.judge_code_id
  });

  if (error) {
    redirect(`${destination}?error=Vote could not be saved. If you already used a vote on this artwork, your previous vote remains recorded.`);
  }

  revalidatePath("/judge");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${submissionId}`);
  revalidatePath("/admin");
  redirect(`${destination}?success=1`);
}

export async function removeVoteAction(formData: FormData) {
  const accessType = String(formData.get("access_type") ?? "");
  const submissionId = String(formData.get("submission_id") ?? "");
  const destination = accessType === "judge" ? "/judge" : accessType === "gallery" ? `/gallery/${submissionId}` : "/";

  if ((accessType !== "gallery" && accessType !== "judge") || !submissionId) {
    redirect(`${destination}?error=Invalid voting request.`);
  }

  const { user } = await requireVotingAccess(accessType);

  if (isDemoMode) {
    const votedIds = new Set((cookies().get("demo_votes")?.value ?? "").split(",").filter(Boolean));

    if (!votedIds.has(submissionId)) {
      redirect(`${destination}?error=No existing vote found for this artwork.`);
    }

    votedIds.delete(submissionId);
    cookies().set("demo_votes", [...votedIds].join(","), {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });

    revalidatePath("/judge");
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${submissionId}`);
    revalidatePath("/admin");
    redirect(`${destination}?success=removed`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("submission_id", submissionId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`${destination}?error=Vote could not be removed.`);
  }

  revalidatePath("/judge");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${submissionId}`);
  revalidatePath("/admin");
  redirect(`${destination}?success=removed`);
}

export async function updateSubmissionStatusAction(formData: FormData) {
  await requireAdmin();

  const submissionId = String(formData.get("submission_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!submissionId || !["approved", "deleted", "pending"].includes(status)) {
    redirect("/admin");
  }

  if (isDemoMode) {
    redirect("/admin?demo=1");
  }

  const admin = createAdminClient();
  const { data: submission } = await admin
    .from("submissions")
    .select("id, user_id, artwork_title, status")
    .eq("id", submissionId)
    .limit(1)
    .maybeSingle();

  if (!submission) {
    redirect("/admin");
  }

  await admin.from("submissions").update({ status }).eq("id", submissionId);

  if (submission.status !== status) {
    const notification = notificationForStatus(submission.artwork_title, status as SubmissionStatus);
    await admin.from("submission_notifications").insert({
      user_id: submission.user_id,
      submission_id: submission.id,
      artwork_title: submission.artwork_title,
      ...notification
    });
  }

  revalidatePath("/admin");
  revalidatePath("/gallery");
  revalidatePath("/judge");
  revalidatePath("/submit");
  redirect("/admin");
}
