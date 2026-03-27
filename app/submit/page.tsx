import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmissionForm } from "@/components/submission-form";
import { ensureProfile } from "@/lib/access";
import { MAX_SUBMISSIONS_PER_USER } from "@/lib/constants";
import { isDemoMode } from "@/lib/env";
import { getSubmissionCountForUser, getUserSubmissionNotifications, getUserSubmissionStatusSummary } from "@/lib/queries";
import type { SubmissionNotification } from "@/lib/types";

export default async function SubmitPage({
  searchParams
}: {
  searchParams: { error?: string; success?: string };
}) {
  const user = await ensureProfile();
  const count = await getSubmissionCountForUser(user.id);
  const statusSummary = await getUserSubmissionStatusSummary(user.id);
  const notifications = await getUserSubmissionNotifications(user.id);
  const remaining = Math.max(MAX_SUBMISSIONS_PER_USER - count, 0);

  return (
    <main className="page-wash">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-10 max-w-3xl">
          <p className="section-label">Call for entries</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-6xl">
            Submit your artwork
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Upload the final image, list the AI tools used, and include your prompt log, base sketches, and a short process statement. Review usually takes 24 to 48 hours.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {notifications.length === 0 ? (
              statusSummary.approvedCount > 0 ? (
                <StatusBanner tone="success">
                  One of your submissions has been approved and is now visible in the competition. Review for new submissions can still take 24-48 hours.
                </StatusBanner>
              ) : statusSummary.pendingCount > 0 ? (
                <StatusBanner tone="info">
                  Your submission is in review. Organizer review usually takes 24-48 hours.
                </StatusBanner>
              ) : (
                <StatusBanner tone="info">
                  After you submit, organizer review usually takes 24-48 hours.
                </StatusBanner>
              )
            ) : null}
            <SubmissionForm
              defaultName={user.user_metadata.full_name ?? user.user_metadata.name ?? ""}
              defaultEmail={user.email ?? ""}
              remaining={remaining}
              serverError={searchParams.error}
              success={Boolean(searchParams.success)}
              isDemoMode={isDemoMode}
            />
          </div>

          <div className="space-y-6">
          <NotificationCenter notifications={notifications} />
          <Card className="h-fit bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,237,255,0.92))]">
            <CardHeader>
              <CardTitle>Submission requirements</CardTitle>
              <CardDescription>Keep it simple and complete.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <Guideline title="Final artwork" body="Upload one high resolution image." />
              <Guideline title="Prompt log and base sketches" body="Include the prompts you used and any base sketches if you used them." />
              <Guideline title="AI tools used" body="This is required for every submission." />
              <Guideline title="Creative process statement" body="Write 50 to 200 words." />
              <Guideline title="Integrity agreement" body="You must sign the academic and ethical integrity agreement." />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </main>
  );
}

function StatusBanner({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: "success" | "info";
}) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-sky-100 bg-sky-50 text-sky-800";

  return <div className={`rounded-[24px] border px-5 py-4 text-sm shadow-[0_14px_35px_rgba(35,59,92,0.06)] ${className}`}>{children}</div>;
}

function NotificationCenter({
  notifications
}: {
  notifications: SubmissionNotification[];
}) {
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Notification center</CardTitle>
        <CardDescription>All submission updates are logged here by artwork title.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="px-5 py-4 text-sm text-muted-foreground">
              No notifications yet. After you submit, review updates will appear here.
            </div>
          ) : (
          notifications.map((item) => (
              <div key={item.id} className={`px-5 py-4 ${notificationRowClass(item.kind)}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{item.message_title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${notificationBadgeClass(item.kind)}`}>
                        {notificationBadgeLabel(item.kind)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground/85">{item.artwork_title}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Submitted update: {dateFormatter.format(new Date(item.created_at))}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.message_body}</p>
                  </div>
                  <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {dateFormatter.format(new Date(item.created_at))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function notificationRowClass(kind: SubmissionNotification["kind"]) {
  switch (kind) {
    case "approved":
      return "bg-emerald-50/75";
    case "rejected":
      return "bg-rose-50/75";
    default:
      return "bg-amber-50/65";
  }
}

function notificationBadgeClass(kind: SubmissionNotification["kind"]) {
  switch (kind) {
    case "approved":
      return "bg-emerald-100 text-emerald-800";
    case "rejected":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function notificationBadgeLabel(kind: SubmissionNotification["kind"]) {
  switch (kind) {
    case "approved":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return "Submitted";
  }
}

function Guideline({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p>{body}</p>
      </div>
    </div>
  );
}
