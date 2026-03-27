import Image from "next/image";
import Link from "next/link";
import { requireGalleryAccess } from "@/lib/access";
import { createSignedImageUrls, getApprovedSubmissions, getUserVoteSubmissionIds } from "@/lib/queries";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MAX_VOTES_PER_USER } from "@/lib/votes";

export default async function GalleryPage({
  searchParams
}: {
  searchParams: { theme?: string; school?: string };
}) {
  const user = await requireGalleryAccess();
  const [submissions, voteIds] = await Promise.all([
    getApprovedSubmissions({
      theme: searchParams.theme,
      school: searchParams.school
    }),
    getUserVoteSubmissionIds(user.id)
  ]);
  const remainingVotes = Math.max(MAX_VOTES_PER_USER - voteIds.length, 0);

  const themes = [...new Set(submissions.map((item) => item.theme))];
  const schools = [...new Set(submissions.map((item) => item.school))];
  const imageUrls = await createSignedImageUrls(submissions.map((item) => item.image_path));

  return (
    <main className="page-wash">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="section-label">Competition gallery</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] text-slate-950">Approved student work</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Browse approved entries and mark up to three pieces as your top picks. Gallery voting is tied to your signed-in account and access grant.
            </p>
            <div className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(35,59,92,0.08)]">
              {remainingVotes} of 3 viewer votes remaining
            </div>
          </div>
          <form className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
            <select name="theme" defaultValue={searchParams.theme ?? ""} className="h-12 rounded-xl border border-input bg-white px-4 text-sm text-slate-700">
              <option value="">All themes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
            <select name="school" defaultValue={searchParams.school ?? ""} className="h-12 rounded-xl border border-input bg-white px-4 text-sm text-slate-700">
              <option value="">All schools</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            <button type="submit" className="h-12 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(33,99,179,0.2)]">
              Apply
            </button>
          </form>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-sm text-muted-foreground">No approved artworks match this filter yet.</CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission, index) => {
              const isFavorite = voteIds.includes(submission.id);

              return (
                <Link key={submission.id} href={`/gallery/${submission.id}`}>
                  <Card
                    className={cn(
                      "group h-full overflow-hidden bg-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(35,59,92,0.12)]",
                      isFavorite && "border-amber-300 bg-[linear-gradient(180deg,rgba(255,250,235,0.98),rgba(255,246,219,0.94))] shadow-[0_18px_45px_rgba(180,125,28,0.12)]"
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      {imageUrls[index] ? (
                        <Image src={imageUrls[index] as string} alt={submission.artwork_title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                      ) : null}
                      <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">
                        {submission.theme}
                      </div>
                      {isFavorite ? (
                        <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          Top pick
                        </div>
                      ) : null}
                    </div>
                    <CardContent className="p-5">
                      <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">{submission.artwork_title}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        by {submission.student_name} · {submission.school}
                      </p>
                      <p className="mt-4 text-sm font-medium text-primary">
                        {isFavorite ? "Marked as one of your top picks" : "Open artwork details"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
