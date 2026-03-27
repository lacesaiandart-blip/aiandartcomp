import { cookies } from "next/headers";
import { demoJudgeVoteSummary, demoSubmissionNotifications, demoSubmissions, demoUser, demoViewerVoteSummary } from "@/lib/demo";
import { isDemoMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { Submission, SubmissionNotification, VoteSummaryRow } from "@/lib/types";

export async function getSubmissionCountForUser(userId: string) {
  if (isDemoMode) {
    return Number(cookies().get("demo_submission_count")?.value ?? "0");
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("submissions")
    .select("*", { head: true, count: "exact" })
    .eq("user_id", userId)
    .neq("status", "deleted");

  return count ?? 0;
}

export async function getApprovedSubmissions(filters?: { theme?: string; school?: string }) {
  if (isDemoMode) {
    return demoSubmissions.filter((submission) => {
      if (submission.status !== "approved") {
        return false;
      }

      if (filters?.theme && submission.theme !== filters.theme) {
        return false;
      }

      if (filters?.school && submission.school !== filters.school) {
        return false;
      }

      return true;
    });
  }

  const supabase = await createClient();
  let query = supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (filters?.theme) {
    query = query.eq("theme", filters.theme);
  }

  if (filters?.school) {
    query = query.eq("school", filters.school);
  }

  const { data } = await query;

  return (data ?? []) as Submission[];
}

export async function getSubmissionById(id: string) {
  if (isDemoMode) {
    return demoSubmissions.find((submission) => submission.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("*").eq("id", id).limit(1).maybeSingle();
  return data as Submission | null;
}

export async function createSignedImageUrl(path: string) {
  if (isDemoMode) {
    return path;
  }

  const admin = createAdminClient();
  const { data } = await admin.storage.from(env.storageBucket).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function createSignedImageUrls(paths: string[]) {
  if (isDemoMode) {
    return paths;
  }

  if (paths.length === 0) {
    return [];
  }

  const admin = createAdminClient();
  const { data } = await admin.storage.from(env.storageBucket).createSignedUrls(paths, 60 * 60);
  const signedUrlByPath = new Map((data ?? []).map((item) => [item.path ?? "", item.signedUrl]));

  return paths.map((path) => signedUrlByPath.get(path) ?? null);
}

export async function getAdminSubmissions() {
  if (isDemoMode) {
    return demoSubmissions;
  }

  const admin = createAdminClient();
  const { data } = await admin.from("submissions").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Submission[];
}

export async function getVoteSummaryByAudience() {
  if (isDemoMode) {
    return {
      viewer: demoViewerVoteSummary,
      judge: demoJudgeVoteSummary
    };
  }

  const admin = createAdminClient();
  const [{ data: submissions }, { data: votes }] = await Promise.all([
    admin.from("submissions").select("id, artwork_title, student_name, theme, school"),
    admin.from("votes").select("submission_id, judge_code_id")
  ]);

  const submissionMap = new Map(
    (submissions ?? []).map((submission) => [
      submission.id,
      {
        id: submission.id,
        artwork_title: submission.artwork_title,
        student_name: submission.student_name,
        theme: submission.theme,
        school: submission.school,
        vote_count: 0
      }
    ])
  );

  const viewerCounts = new Map<string, VoteSummaryRow>();
  const judgeCounts = new Map<string, VoteSummaryRow>();

  for (const vote of votes ?? []) {
    const base = submissionMap.get(vote.submission_id);
    if (!base) {
      continue;
    }

    const bucket = vote.judge_code_id ? judgeCounts : viewerCounts;
    const current = bucket.get(vote.submission_id) ?? { ...base };
    current.vote_count += 1;
    bucket.set(vote.submission_id, current);
  }

  const sortRows = (rows: VoteSummaryRow[]) =>
    rows.sort((a, b) => b.vote_count - a.vote_count || a.artwork_title.localeCompare(b.artwork_title));

  return {
    viewer: sortRows([...viewerCounts.values()]),
    judge: sortRows([...judgeCounts.values()])
  };
}

export async function getUserVoteSubmissionIds(userId: string) {
  if (isDemoMode) {
    return (cookies().get("demo_votes")?.value ?? "").split(",").filter(Boolean);
  }

  const supabase = await createClient();
  const { data } = await supabase.from("votes").select("submission_id").eq("user_id", userId);
  return (data ?? []).map((vote) => vote.submission_id as string);
}

export async function getUserSubmissionStatusSummary(userId: string) {
  if (isDemoMode) {
    const submissions = demoSubmissions.filter((submission) => submission.user_id === userId || userId === demoUser.id);
    return {
      approvedCount: submissions.filter((submission) => submission.status === "approved").length,
      pendingCount: submissions.filter((submission) => submission.status === "pending").length
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("status").eq("user_id", userId).neq("status", "deleted");
  const rows = data ?? [];

  return {
    approvedCount: rows.filter((row) => row.status === "approved").length,
    pendingCount: rows.filter((row) => row.status === "pending").length
  };
}

export async function getUserSubmissionNotifications(userId: string) {
  if (isDemoMode) {
    return demoSubmissionNotifications
      .filter((notification) => notification.user_id === userId || userId === demoUser.id)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("submission_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as SubmissionNotification[];
}
