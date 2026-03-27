import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MoveRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sections = {
  eligibility: [
    "Open to high school students currently enrolled in grades 9-12.",
    "Students may submit up to two original pieces created with AI-assisted tools.",
    "Individual entries only for this first-year pilot."
  ],
  timeline: [
    "Submissions open April 8.",
    "Virtual workshop and Q&A on April 20.",
    "Gallery access opens May 6.",
    "Results announced May 18."
  ],
  prizes: [
    "1st place: UCLA campus visit.",
    "2nd place: Mentorship session with organizers.",
    "Honorable mentions selected by judges and organizers."
  ],
  rules: [
    "Submit your prompt log and a short process statement.",
    "Work must be your own and created specifically for this competition cycle.",
    "Organizers may remove entries that violate the integrity or content guidelines."
  ],
  ethics: [
    "We value transparency about tools and prompting choices.",
    "The strongest entries use AI intentionally, not as a substitute for authorship.",
    "Students should avoid styles that imitate living artists without permission."
  ]
};

export default function HomePage() {
  return (
    <main>
      <section className="page-wash border-b border-white/70">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div className="max-w-xl">
            <p className="section-label">Call for entries</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-slate-950 sm:text-6xl">
              High School
              <br />
              AI Art
              <br />
              Competition
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Organized by UCLA student groups and local volunteers. Students submit original AI-assisted artwork with a short prompt log and a clear process statement.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(33,99,179,0.22)] transition-all hover:-translate-y-0.5 hover:bg-primary/92">
                Submit Artwork
              </Link>
              <Link href="/gallery/access" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
                View Gallery
              </Link>
            </div>
            <Link href="/judge/access" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Judge Access <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <StatCard label="Entries" value="Up to 2" />
              <StatCard label="Review" value="24-48 hrs" />
              <StatCard label="Access" value="Invite code" />
            </div>
          </div>
          <div className="surface-card p-5">
            <div className="overflow-hidden rounded-[24px] bg-slate-950 shadow-[0_20px_45px_rgba(12,18,30,0.22)]">
              <Image
                src="/demo/transit-memories.svg"
                alt="Featured competition artwork"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <InfoFeature
            label="Our mission"
            title="A grounded competition for student artists working with new tools"
            description="We are looking for thoughtful submissions that show both experimentation and authorship. The strongest entries explain how the student shaped the final result."
            className="md:col-span-2 xl:col-span-1"
          />
          <InfoFeature
            label="Approach"
            title="AI art with clear process notes"
            description="Prompt logs and process statements matter. We are not looking for hype. We are looking for work that is intentional, documented, and honestly presented."
            className="bg-[linear-gradient(180deg,rgba(245,236,255,0.96),rgba(239,228,255,0.92))]"
          />
          <MiniFeature
            title="Open submission"
            description="Any high school student in grades 9-12 may apply with up to two original entries."
            className="bg-[linear-gradient(180deg,rgba(217,248,255,0.96),rgba(203,238,255,0.92))]"
          />
          <MiniFeature
            title="Workshop"
            description="A short online walkthrough covers prompt logging, eligibility, and review expectations."
            className="bg-[linear-gradient(180deg,rgba(246,250,253,0.96),rgba(233,240,245,0.92))]"
          />
          <MiniFeature
            title="Gallery access"
            description="Signed-in viewers and judges enter with a short code so the event stays private and manageable."
            className="bg-[linear-gradient(180deg,rgba(245,247,252,0.96),rgba(237,241,250,0.92))]"
          />
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/45">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label">Timeline & rewards</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Clear deadlines, simple review, modest prizes</h2>
            <div className="mt-10 space-y-8">
              {sections.timeline.map((item, index) => (
                <div key={item} className="grid grid-cols-[40px_1fr] gap-4">
                  <p className="text-3xl font-semibold tracking-[-0.06em] text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{timelineTitles[index]}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <RewardCard title="Eligibility" items={sections.eligibility} />
            <RewardCard title="Prizes" items={sections.prizes} highlight />
            <RewardCard title="Workshop & info session" items={["Optional and open to all participants.", "Organizers will walk through submission expectations, prompt logging, and review standards."]} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="section-label">AI art ethics & rules</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Transparent submissions matter more than polished language</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              We want to see how students used these tools, what they changed, and what decisions made the work theirs.
            </p>
            <div className="mt-8 rounded-[24px] border border-slate-200 bg-white px-6 py-5 text-sm italic leading-7 text-slate-600 shadow-[0_18px_45px_rgba(35,59,92,0.06)]">
              “AI is a brush, not the artist. We judge the hand that guided the process.”
              <p className="mt-3 not-italic text-slate-500">Student organizer review note</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <RuleList title="Rules" items={sections.rules} />
            <RuleList title="Ethics" items={sections.ethics} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-[32px] bg-primary px-8 py-12 text-center text-primary-foreground shadow-[0_22px_48px_rgba(33,99,179,0.22)] sm:px-12">
          <p className="section-label !text-white/70">Ready to submit</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Share your work with the competition</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/84">
            Sign in, upload your artwork, and include the prompt log and process notes that explain how you made it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-primary">
              Start Your Submission
            </Link>
            <Link href="/gallery/access" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white">
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const timelineTitles = ["Submission window", "Workshop", "Review", "Gallery launch"];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_18px_35px_rgba(35,59,92,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
    </div>
  );
}

function InfoFeature({
  label,
  title,
  description,
  className
}: {
  label: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card className={`bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,252,0.92))] ${className ?? ""}`}>
      <CardHeader>
        <p className="section-label">{label}</p>
        <CardTitle className="mt-3 text-[2rem] leading-tight tracking-[-0.05em] text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-xl text-base leading-7 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function MiniFeature({
  title,
  description,
  className
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="section-label !tracking-[0.18em] !text-primary">Info</span>
        </div>
        <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function RewardCard({
  title,
  items,
  highlight
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,255,0.96))]" : ""}>
      <CardHeader>
        <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
            <MoveRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <p>{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RuleList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,252,0.92))]">
      <CardHeader>
        <CardTitle className="text-2xl tracking-[-0.04em] text-slate-950">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm leading-6 text-slate-600">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
