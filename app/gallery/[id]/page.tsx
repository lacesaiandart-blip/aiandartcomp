import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { requireGalleryAccess } from "@/lib/access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { removeVoteAction, submitVoteAction } from "@/lib/actions";
import { createSignedImageUrl, getSubmissionById, getUserVoteSubmissionIds } from "@/lib/queries";
import { MAX_VOTES_PER_USER } from "@/lib/votes";

export default async function GalleryDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { error?: string; success?: string };
}) {
  await requireGalleryAccess();
  const user = await getSession();
  const submission = await getSubmissionById(params.id);

  if (!submission || submission.status !== "approved") {
    notFound();
  }

  const imageUrl = await createSignedImageUrl(submission.image_path);
  const voteIds = user ? await getUserVoteSubmissionIds(user.id) : [];
  const alreadyVoted = voteIds.includes(submission.id);
  const remainingVotes = Math.max(MAX_VOTES_PER_USER - voteIds.length, 0);

  return (
    <main className="page-wash">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-5">
          <Link href="/gallery" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Back to Gallery
          </Link>
        </div>
        <div className="rounded-[32px] border border-white/80 bg-white shadow-[0_25px_60px_rgba(35,59,92,0.12)]">
          <div>
            <div className="border-b border-slate-200 bg-slate-950">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={submission.artwork_title}
                  className="block h-auto w-full"
                />
              ) : null}
            </div>
            <div className="p-6 sm:p-8">
              <div className="space-y-5 text-sm leading-6 text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-800">
                    {submission.theme}
                  </span>
                  {alreadyVoted ? (
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                      Top pick
                    </span>
                  ) : null}
                </div>
                <div>
                  <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950">{submission.artwork_title}</h1>
                  <p className="mt-2 text-base text-slate-500">
                    by {submission.student_name} · {submission.school}
                  </p>
                </div>
                {searchParams.error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</p> : null}
                {searchParams.success === "removed" ? <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">Vote removed.</p> : null}
                <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                  <p className="font-semibold text-slate-900">{remainingVotes} of 3 viewer votes remaining</p>
                  <p className="mt-1 text-sm text-slate-600">Use votes on the works you want as your top picks. You can support up to three different submissions.</p>
                </div>
                <div>
                  <p className="section-label">Prompt log</p>
                  <div className="mt-2 rounded-[24px] bg-slate-50 px-5 py-4 text-sm italic leading-7 text-slate-600">
                    {submission.prompt_log}
                  </div>
                </div>
                <p><span className="font-semibold text-slate-900">AI tools:</span> {submission.ai_tools_used}</p>
                <div>
                  <p className="section-label">Creative process</p>
                  <p className="mt-2">{submission.creative_process_statement}</p>
                </div>
                {alreadyVoted ? (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      You marked this as one of your top picks.
                    </div>
                    <form action={removeVoteAction}>
                      <input type="hidden" name="submission_id" value={submission.id} />
                      <input type="hidden" name="access_type" value="gallery" />
                      <Button type="submit" variant="outline">Undo vote</Button>
                    </form>
                  </div>
                ) : (
                  <form action={submitVoteAction}>
                    <input type="hidden" name="submission_id" value={submission.id} />
                    <input type="hidden" name="access_type" value="gallery" />
                    <Button type="submit" disabled={remainingVotes === 0}>Mark as Top Pick</Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
