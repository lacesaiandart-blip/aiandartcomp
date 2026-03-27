import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/env";
import { createSignedImageUrls, getApprovedSubmissions, getUserVoteSubmissionIds } from "@/lib/queries";
import { requireJudgeAccess } from "@/lib/access";
import { removeVoteAction, submitVoteAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { MAX_VOTES_PER_USER } from "@/lib/votes";

export default async function JudgePage({
  searchParams
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { user } = await requireJudgeAccess();
  const [submissions, voteIds] = await Promise.all([
    getApprovedSubmissions(),
    getUserVoteSubmissionIds(user.id)
  ]);
  const votedIds = new Set(voteIds);
  const remainingVotes = Math.max(MAX_VOTES_PER_USER - votedIds.size, 0);
  const imageUrls = await createSignedImageUrls(submissions.map((item) => item.image_path));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Judge voting</h1>
        <p className="mt-2 text-muted-foreground">Each signed-in judge can cast up to 3 votes total for the submissions they want as top picks.</p>
        <p className="mt-1 text-sm text-foreground/80">{remainingVotes} of 3 judge votes remaining.</p>
      </div>
      {isDemoMode ? (
        <p className="mb-4 rounded-md border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
          Demo mode saves voting state in cookies for this browser only.
        </p>
      ) : null}
      {searchParams.error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p> : null}
      {searchParams.success === "1" ? <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Marked as one of your top picks.</p> : null}
      {searchParams.success === "removed" ? <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Vote removed.</p> : null}
      {submissions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No entries available</CardTitle>
            <CardDescription>Approved submissions will appear here once organizers publish them.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission, index) => {
            const alreadyVoted = votedIds.has(submission.id);

            return (
              <Card
                key={submission.id}
                className={cn(alreadyVoted && "border-amber-400 bg-amber-50/55 shadow-[0_0_0_1px_rgba(217,119,6,0.18)]")}
              >
                <div>
                  <div className="relative border-b border-slate-200 bg-slate-950">
                    {imageUrls[index] ? (
                      <img
                        src={imageUrls[index] as string}
                        alt={submission.artwork_title}
                        className="block h-auto w-full"
                      />
                    ) : null}
                    {alreadyVoted ? (
                      <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white">
                        Best pick
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <h2 className="text-xl font-semibold">{submission.artwork_title}</h2>
                      <p className="text-sm text-muted-foreground">{submission.student_name} · {submission.school} · {submission.theme}</p>
                    </div>
                    <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                      <p><span className="font-medium text-foreground">AI tools:</span> {submission.ai_tools_used}</p>
                      <div>
                        <p className="font-medium text-foreground">Prompt log</p>
                        <PromptLogPreview promptLog={submission.prompt_log} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Creative process statement</p>
                        <p>{submission.creative_process_statement}</p>
                      </div>
                    </div>
                    {alreadyVoted ? (
                      <div className="space-y-3">
                        <form action={removeVoteAction}>
                          <input type="hidden" name="submission_id" value={submission.id} />
                          <input type="hidden" name="access_type" value="judge" />
                          <Button type="submit" variant="outline">Undo vote</Button>
                        </form>
                      </div>
                    ) : (
                      <form action={submitVoteAction}>
                        <input type="hidden" name="submission_id" value={submission.id} />
                        <input type="hidden" name="access_type" value="judge" />
                        <Button type="submit" disabled={remainingVotes === 0}>Mark as Top Pick</Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

function PromptLogPreview({ promptLog }: { promptLog: string }) {
  const words = promptLog.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 50) {
    return <p>{promptLog}</p>;
  }

  const preview = words.slice(0, 50).join(" ");
  const remainder = words.slice(50).join(" ");

  return (
    <details className="group text-muted-foreground">
      <summary className="cursor-pointer list-none marker:hidden">
        <span>{preview}</span>
        <span className="group-open:hidden">...</span>
        <span className="hidden whitespace-pre-wrap group-open:inline"> {remainder}</span>
        <span className="ml-2 font-medium text-primary group-open:hidden">Expand</span>
        <span className="ml-2 hidden font-medium text-primary group-open:inline">Hide</span>
      </summary>
    </details>
  );
}
