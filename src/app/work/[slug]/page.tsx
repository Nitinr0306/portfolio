import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DiceLayers } from "@/components/diagrams/DiceLayers";
import { ManagioRequestExplorer } from "@/components/diagrams/ManagioRequestExplorer";
import { MedVisionPipeline } from "@/components/diagrams/MedVisionPipeline";
import { QualityGateLab } from "@/components/diagrams/QualityGateLab";
import { SubscriptionTimeline } from "@/components/diagrams/SubscriptionTimeline";
import { TokenRotation } from "@/components/diagrams/TokenRotation";
import { Icon } from "@/components/ui/Icon";
import { CaseNav } from "@/components/work/CaseNav";
import { MetricRow } from "@/components/work/MetricRow";
import { profile } from "@/content/profile";
import { getNextProject, getProject, projects } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { siteUrl } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.name}: ${project.kind}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", title, description: project.summary, url: `/work/${project.slug}` },
  };
}

type DeepDive = { id: string; label: string; title: string; intro?: ReactNode; body: ReactNode; note?: string };

/** Project-specific sections: the parts of each system worth seeing, not just reading. */
const deepDives: Record<ProjectSlug, DeepDive[]> = {
  "medvision-ai": [
    {
      id: "pipeline",
      label: "Pipeline",
      title: "How an upload moves through the system",
      intro:
        "Pick what gets uploaded and follow it through a simplified view of the pipeline: validation in Spring Boot, the quality gate, then computer vision.",
      body: <MedVisionPipeline />,
      note: "Simplified illustration. The stages are real; their exact order and boundaries are drawn for clarity.",
    },
    {
      id: "quality-gate",
      label: "Quality gate",
      title: "Try the quality gate",
      intro: (
        <>
          The gate checks three things before OCR: blur, measured with Laplacian variance, plus brightness and
          noise. Move the sliders and watch the scores. Noise also raises Laplacian variance, so a sharpness check on
          its own can be fooled by a grainy photo. Scoring noise separately catches it.
        </>
      ),
      body: <QualityGateLab />,
      note: "An in-browser illustration of the technique, written for this page. The sample, the maths and the thresholds are illustrative; they are not MedVision AI's own code or values.",
    },
  ],
  managio: [
    {
      id: "request-path",
      label: "Request path",
      title: "What happens to a request",
      intro:
        "Choose a request and see, in a simplified view, which layer deals with it: rate limiting, JWT authentication, permission checks or validation.",
      body: <ManagioRequestExplorer />,
    },
    {
      id: "tokens",
      label: "Token rotation",
      title: "Sign-in and token rotation",
      intro:
        "Authentication uses JWT access and refresh tokens with rotation. This is the general shape of that flow.",
      body: <TokenRotation />,
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      title: "Scheduled subscription workflows",
      intro: "Subscription expiry is handled on a schedule, and reminders run as an automated 3-stage workflow.",
      body: <SubscriptionTimeline />,
    },
  ],
  "dice-tournament": [
    {
      id: "structure",
      label: "Structure",
      title: "How the code is organised",
      intro: "Five layers, each with one job, in plain Java.",
      body: <DiceLayers />,
    },
  ],
};

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const dives = deepDives[project.slug];
  const next = getNextProject(project.slug);
  const toc = [
    { id: "problem", label: "Problem" },
    { id: "approach", label: "What I built" },
    ...dives.map((d) => ({ id: d.id, label: d.label })),
    { id: "decisions", label: "Decisions" },
    { id: "features", label: "Features" },
    { id: "stack", label: "Stack" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.summary,
    codeRepository: project.repo,
    url: `${siteUrl}/work/${project.slug}`,
    author: { "@type": "Person", name: profile.name, url: siteUrl },
    programmingLanguage: project.stack.flatMap((l) => l.items).slice(0, 8),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="container-page pt-8 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-small text-ink-3">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/#work" className="link">
                Work
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink-2">
              {project.name}
            </li>
          </ol>
        </nav>

        <p className="mt-10 text-small text-ink-3 md:mt-14">{project.kind}</p>
        <h1 className="mt-2 text-display font-semibold tracking-[-0.045em] [font-stretch:92%]">{project.name}</h1>
        <p className="mt-6 max-w-[58ch] text-lead text-ink-2">{project.summary}</p>

        <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-line pt-6 text-small sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-ink-3">Timeline</dt>
            <dd className="mt-1">
              {project.period}
              {project.ongoing && <span className="ml-2 rounded-full bg-pass-soft px-2 py-0.5 text-micro text-pass">Ongoing</span>}
            </dd>
          </div>
          <div className="lg:col-span-2">
            <dt className="text-ink-3">What I owned</dt>
            <dd className="mt-1">{project.ownership.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Source</dt>
            <dd className="mt-1">
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex items-center gap-1"
              >
                GitHub repository
                <Icon name="external" size={14} className="text-ink-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link ml-4">
                  Live demo
                </a>
              )}
            </dd>
          </div>
        </dl>

        <MetricRow metrics={project.metrics} className="mt-8" />
      </header>

      <div className="container-page mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <CaseNav items={toc} />
        </aside>

        <div className="min-w-0 space-y-20 md:space-y-28 lg:col-span-9">
          <Section id="problem" title="The problem">
            <p className="max-w-[64ch] text-lead text-ink-2">{project.problem}</p>
          </Section>

          <Section id="approach" title="What I built">
            <p className="max-w-[64ch] text-lead text-ink-2">{project.approach}</p>
          </Section>

          {dives.map((d) => (
            <Section key={d.id} id={d.id} title={d.title} intro={d.intro}>
              {d.body}
              {d.note && <p className="mt-4 max-w-[70ch] text-micro text-ink-3">{d.note}</p>}
            </Section>
          ))}

          <Section id="decisions" title="Engineering decisions">
            <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
              {project.decisions.map((d) => (
                <li key={d.title} className="border-t-2 border-ink pt-5">
                  <h3 className="text-h4 font-semibold tracking-[-0.015em]">{d.title}</h3>
                  <p className="mt-3 text-small text-ink-2">{d.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="features" title="Features">
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f.title} className="border-t border-line pt-4">
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-1 text-small text-ink-2">{f.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="stack" title="Stack">
            <dl className="divide-y divide-line border-y border-line">
              {project.stack.map((layer) => (
                <div key={layer.layer} className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-6">
                  <dt className="text-small text-ink-3">{layer.layer}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

        </div>
      </div>

      <section aria-labelledby="similar-title" className="section mt-24 border-t border-line bg-surface md:mt-32">
        <div className="container-page grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 id="similar-title" className="max-w-[24ch] text-h2">
              {project.similarWork}
            </h2>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              Tell me what you need. I&rsquo;ll reply with how I would approach it and what I&rsquo;d need from you.
            </p>
            <p className="mt-3 text-small text-ink-2">
              Hiring instead?{" "}
              <Link href="/contact?intent=hiring" className="link">
                Discuss a role
              </Link>
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Link href="/contact?intent=project" className="btn btn-primary">
              Start a project
            </Link>
          </div>
        </div>
      </section>

      <nav aria-label="Next case study" className="border-t border-line">
        <Link href={`/work/${next.slug}`} className="group block">
          <div className="container-page flex flex-col gap-2 py-12 md:flex-row md:items-baseline md:justify-between md:py-16">
            <span className="text-small text-ink-3">Next case study</span>
            <span className="text-h2 transition-colors duration-150 group-hover:text-accent">{next.name}</span>
            <span className="text-small text-ink-2">{next.kind}</span>
          </div>
        </Link>
      </nav>
    </article>
  );
}

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2 id={`${id}-title`} className="text-h3">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-[64ch] text-ink-2">{intro}</p>}
      <div className="mt-7">{children}</div>
    </section>
  );
}
