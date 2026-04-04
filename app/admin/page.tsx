import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/env";
import { getAdminAccess } from "@/lib/access";
import { createSignedImageUrls, getAdminSubmissions, getVoteSummaryByAudience } from "@/lib/queries";
import { updateSubmissionStatusAction } from "@/lib/actions";

export default async function AdminPage({
  searchParams
}: {
  searchParams: { demo?: string; error?: string };
}) {
  const { user, isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>You do not have permission</CardTitle>
            <CardDescription>The admin dashboard is only available to approved organizer accounts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Signed in as <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [submissions, voteSummary] = await Promise.all([getAdminSubmissions(), getVoteSummaryByAudience()]);
  const imageUrls = await createSignedImageUrls(submissions.map((item) => item.image_path));

  const groups = {
    pending: submissions.filter((item) => item.status === "pending"),
    approved: submissions.filter((item) => item.status === "approved"),
    deleted: submissions.filter((item) => item.status === "deleted")
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">Moderation, review, and a simple vote summary for organizers.</p>
      </div>
      {isDemoMode ? (
        <p className="mb-4 rounded-md border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
          Demo mode shows a fixed moderation dataset. Status changes are preview-only.
        </p>
      ) : null}
      {searchParams.demo ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Demo action received. The sample dataset stays unchanged.
        </p>
      ) : null}

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_1.2fr_0.8fr]">
        <VoteSummaryCard
          title="Viewer votes"
          description="Top-pick votes cast from gallery access."
          rows={voteSummary.viewer}
        />
        <VoteSummaryCard
          title="Judge votes"
          description="Top-pick votes cast from judge access."
          rows={voteSummary.judge}
        />
        <Card>
          <CardHeader>
            <CardTitle>Counts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">{groups.pending.length}</span> pending</p>
            <p><span className="font-medium text-foreground">{groups.approved.length}</span> approved</p>
            <p><span className="font-medium text-foreground">{groups.deleted.length}</span> removed</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <AdminSection title="Pending submissions" items={groups.pending} imageUrls={imageUrls} />
        <AdminSection title="Approved submissions" items={groups.approved} imageUrls={imageUrls} />
        <AdminSection title="Removed submissions" items={groups.deleted} imageUrls={imageUrls} />
      </div>
    </main>
  );

  function AdminSection({
    title,
    items,
    imageUrls
  }: {
    title: string;
    items: typeof submissions;
    imageUrls: (string | null)[];
  }) {
    return (
      <section>
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">No submissions in this state.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((submission) => {
              const imageUrl = imageUrls[submissions.findIndex((entry) => entry.id === submission.id)];
              return (
                <Card key={submission.id} className={submissionStatusCardClass(submission.status)}>
                  <div className="grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-secondary">
                      {imageUrl ? <Image src={imageUrl} alt={submission.artwork_title} fill className="object-cover" /> : null}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{submission.artwork_title}</h3>
                        <p className="text-sm text-muted-foreground">{submission.student_name} · {submission.school} · {submission.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Theme:</span> {submission.theme}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Tools:</span> {submission.ai_tools_used}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Prompt log:</span> {submission.prompt_log}</p>
                      <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Process statement:</span> {submission.creative_process_statement}</p>
                      {isDemoMode ? (
                        <div className="rounded-md border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                          Moderation controls are disabled in demo mode.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          <form action={updateSubmissionStatusAction}>
                            <input type="hidden" name="submission_id" value={submission.id} />
                            <input type="hidden" name="status" value="approved" />
                            <Button type="submit" variant="default">Approve</Button>
                          </form>
                          <form action={updateSubmissionStatusAction}>
                            <input type="hidden" name="submission_id" value={submission.id} />
                            <input type="hidden" name="status" value="pending" />
                            <Button type="submit" variant="outline">Mark pending</Button>
                          </form>
                          <form action={updateSubmissionStatusAction}>
                            <input type="hidden" name="submission_id" value={submission.id} />
                            <input type="hidden" name="status" value="deleted" />
                            <Button type="submit" variant="secondary">Remove</Button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    );
  }
}

function VoteSummaryCard({
  title,
  description,
  rows
}: {
  title: string;
  description: string;
  rows: Array<{
    id: string;
    artwork_title: string;
    student_name: string;
    school: string;
    vote_count: number;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No votes yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-md border px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{row.artwork_title}</p>
                <p className="text-muted-foreground">{row.student_name} · {row.school}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{row.vote_count}</p>
                <p className="text-muted-foreground">votes</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function submissionStatusCardClass(status: "pending" | "approved" | "deleted") {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50/50";
    case "deleted":
      return "border-rose-200 bg-rose-50/55";
    default:
      return "border-amber-200 bg-amber-50/45";
  }
}
