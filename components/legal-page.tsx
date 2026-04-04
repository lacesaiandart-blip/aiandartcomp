import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  updatedOn: string;
};

export function LegalPage({ eyebrow, title, intro, sections, updatedOn }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
      <section className="surface-card overflow-hidden p-7 sm:p-10">
        <p className="section-label">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <div className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{intro}</div>
        <p className="mt-5 text-sm text-slate-500">Last updated: {updatedOn}</p>
      </section>

      <section className="mt-8 space-y-5">
        {sections.map((section) => (
          <article key={section.title} className="surface-card p-7 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">{section.content}</div>
          </article>
        ))}
      </section>
    </main>
  );
}
