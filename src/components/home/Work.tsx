import Link from "next/link";
import type { ReactNode } from "react";
import { ManagioSchematic } from "@/components/diagrams/ManagioSchematic";
import { MedVisionSchematic } from "@/components/diagrams/MedVisionSchematic";
import { Icon } from "@/components/ui/Icon";
import { MetricRow } from "@/components/work/MetricRow";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

const visuals: Partial<Record<Project["slug"], ReactNode>> = {
  "medvision-ai": <MedVisionSchematic />,
  managio: <ManagioSchematic />,
};

export function Work() {
  const flagships = projects.filter((p) => p.tier === "flagship");
  const foundations = projects.filter((p) => p.tier === "foundation");

  return (
    <section id="work" aria-labelledby="work-title" className="section scroll-mt-16">
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="work-title" className="text-h2">
            Selected work
          </h2>
          <p className="max-w-[46ch] text-ink-2 md:justify-self-end">
            Two flagship projects, each with a full case study, and an earlier core Java project. Numbers
            are quoted from my résumé.
          </p>
        </div>

        <div className="mt-14 space-y-24 md:mt-20 md:space-y-32">
          {flagships.map((p, i) => (
            <FeaturedProject key={p.slug} project={p} visual={visuals[p.slug]} flip={i % 2 === 1} />
          ))}
        </div>

        {foundations.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h3 className="text-small font-medium text-ink-3">Earlier work</h3>
            <ul className="mt-4 border-t border-line">
              {foundations.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <FoundationRow project={p} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedProject({ project: p, visual, flip }: { project: Project; visual: ReactNode; flip: boolean }) {
  return (
    <article
      aria-labelledby={`${p.slug}-title`}
      className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14"
    >
      <div className={cn("lg:col-span-5", flip && "lg:order-2")}>
        <p className="text-small text-ink-3">{p.kind}</p>
        <h3 id={`${p.slug}-title`} className="mt-2 text-h2">
          <Link href={`/work/${p.slug}`} className="transition-colors duration-150 hover:text-accent">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 text-small text-ink-2">
          {p.period}
          {p.ongoing && <span className="ml-2 rounded-full bg-pass-soft px-2 py-0.5 text-micro text-pass">Ongoing</span>}
        </p>

        <dl className="mt-7 space-y-4 border-t border-line pt-6">
          {(
            [
              ["Problem", p.brief.problem],
              ["Approach", p.brief.approach],
              ["Outcome", p.brief.outcome],
            ] as const
          ).map(([term, text]) => (
            <div key={term} className="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:gap-4">
              <dt className="text-small font-medium text-ink">{term}</dt>
              <dd className="text-small text-ink-2">{text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href={`/work/${p.slug}`} className="btn btn-primary">
            Read the {p.name} case study
          </Link>
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="link inline-flex items-center gap-1.5 text-small"
          >
            Source on GitHub
            <Icon name="external" size={15} className="text-ink-3" />
            <span className="sr-only">for {p.name} (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className={cn("space-y-6 lg:col-span-7", flip && "lg:order-1")}>
        {visual}
        <MetricRow metrics={p.metrics} />
      </div>
    </article>
  );
}

function FoundationRow({ project: p }: { project: Project }) {
  return (
    <div className="grid gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-8">
      <div className="md:col-span-4">
        <h4 className="text-h4 font-semibold tracking-[-0.015em]">
          <Link href={`/work/${p.slug}`} className="hover:text-accent transition-colors duration-150">
            {p.name}
          </Link>
        </h4>
        <p className="mt-1 text-small text-ink-3">
          {p.kind}, {p.period}
        </p>
      </div>
      <p className="text-small text-ink-2 md:col-span-5">{p.summary}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-small md:col-span-3 md:justify-end">
        <Link href={`/work/${p.slug}`} className="link-accent">
          Case study<span className="sr-only">: {p.name}</span>
        </Link>
        <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
          Source
          <Icon name="external" size={14} className="text-ink-3" />
          <span className="sr-only">for {p.name} (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
