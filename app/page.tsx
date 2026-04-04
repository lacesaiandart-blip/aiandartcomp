import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { THEMES } from "@/lib/constants";

const requirements = [
  "Final artwork in high resolution",
  "Prompt log and base sketches",
  "List of AI tools used",
  "Creative process statement, 50 to 200 words",
  "Signed academic and ethical integrity agreement"
];

const rules = [
  "No hate speech, discriminatory imagery, or harassment",
  "No explicit sexual content, nudity, or graphic violence",
  "No political propaganda or charged messaging",
  "Sensitive themes may be explored if they are handled respectfully with thoughtful artistic intent"
];

const ethics = [
  "Avoid prompting in the style of living artists",
  "Avoid copyrighted characters or IP",
  "Look to public domain or self created content",
  "Use public AI generative tools"
];

const prizes = [
  "1st place, $150",
  "2nd place, $100",
  "3rd place, $50"
];

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
              Organized by student groups at UCLA and local volunteers. Open to high school students. Students choose one theme and use public AI tools to make generative artwork.
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
          <div className="overflow-hidden rounded-[32px] border border-white/85 bg-slate-950 shadow-[0_24px_55px_rgba(35,59,92,0.14)]">
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label">AI Art Themes</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Choose one theme</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Each submission should fit one theme.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {THEMES.map((theme) => (
                <div key={theme} className="rounded-[22px] border border-slate-200 bg-white/85 px-5 py-4 text-lg font-medium text-slate-900 shadow-[0_12px_30px_rgba(35,59,92,0.06)]">
                  {theme}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-label">Submission requirements</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">What to submit</h2>
            <ul className="mt-8 space-y-4">
              {requirements.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-white/70 bg-white/45">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="section-label">Rules</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Keep it respectful</h2>
            <ul className="mt-8 space-y-4">
              {rules.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label">AI art ethics</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Use AI with care</h2>
            <ul className="mt-8 space-y-4">
              {ethics.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label">Prizes</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950">Cash prizes and a UCLA tour</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              All podium winners will be invited to a UCLA tour after the event. Parking and lunch will be covered.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {prizes.map((item, index) => (
              <div key={item} className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(35,59,92,0.06)]">
                <p className="section-label">{index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"}</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {item.split(", ")[1]}
                </p>
              </div>
            ))}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_18px_35px_rgba(35,59,92,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
    </div>
  );
}
