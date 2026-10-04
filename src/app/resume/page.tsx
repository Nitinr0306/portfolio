import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PrintButton } from "@/components/ui/PrintButton";
import { achievements, certificates, education, profile, skills } from "@/content/profile";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Dunna Nitin's résumé: skills, projects, education, certificates and achievements, with a PDF download.",
  alternates: { canonical: "/resume" },
};

/**
 * The recruiter view: everything needed to decide on a shortlist, on one page.
 * Prints as a clean one-pager (see the print rules in globals.css).
 */
export default function ResumePage() {
  const degree = education[0];
  return (
    <div className="container-page pt-10 pb-24 md:pt-16 print:pt-0 print:pb-0">
      <header className="border-b border-line pb-10 print:pb-4">
        <p className="text-small text-ink-3 print:hidden">Résumé</p>
        <h1 className="mt-2 text-h1 print:mt-0 print:text-[22pt]">{profile.name}</h1>
        <p className="mt-4 max-w-[60ch] text-lead text-ink-2 print:mt-1 print:text-[11pt]">
          {profile.positioning}. B.Tech in Computer Science and Engineering at {degree.school}, since August
          2023. {degree.detail}.
        </p>
        <p className="mt-3 flex items-center gap-2.5 text-small text-ink-2 print:hidden">
          <span className="status-dot" aria-hidden />
          {profile.availability}
        </p>

        <div className="no-print mt-8 flex flex-wrap items-center gap-3">
          <a href={profile.resumePdf} download className="btn btn-primary">
            <Icon name="download" size={16} />
            Download PDF
          </a>
          <PrintButton />
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small print:mt-2">
          <li>
            <a className="link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
          <li>
            <a className="link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/{profile.handle}
            </a>
          </li>
          <li>
            <a className="link" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              github.com/{profile.links.github.split("/").pop()}
            </a>
          </li>
          <li className="text-ink-2">{profile.location}</li>
        </ul>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-12 print:mt-5 print:block">
        <div className="space-y-12 lg:col-span-8 print:space-y-5">
          <section aria-labelledby="r-summary">
            <h2 id="r-summary" className="text-h4 font-semibold print:text-[12pt]">
              Summary
            </h2>
            <p className="mt-3 max-w-[66ch] text-ink-2 print:mt-1">
              Backend-focused engineer working mainly in Java and Spring Boot, with Spring Security, PostgreSQL and
              Redis on the server, Next.js and TypeScript on the frontend, and Docker, Jenkins, Kubernetes and
              Terraform for delivery. Projects include a multi-tenant SaaS platform with 95 REST APIs and a
              three-service medical imaging and document intelligence platform.
            </p>
          </section>

          <section aria-labelledby="r-projects">
            <h2 id="r-projects" className="text-h4 font-semibold print:text-[12pt]">
              Projects
            </h2>
            <ol className="mt-4 space-y-8 print:mt-2 print:space-y-3">
              {projects.map((p) => (
                <li key={p.slug} className="break-inside-avoid border-t border-line pt-5 print:pt-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold">
                      <Link href={`/work/${p.slug}`} className="link">
                        {p.name}
                      </Link>
                      <span className="font-normal text-ink-2"> · {p.kind}</span>
                    </h3>
                    <p className="text-small text-ink-3 tabular-nums">{p.period}</p>
                  </div>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-small text-ink-2 marker:text-ink-3 print:mt-1 print:space-y-0.5">
                    {p.resumeBullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="no-print mt-3 flex flex-wrap gap-x-5 gap-y-1 text-small">
                    <Link href={`/work/${p.slug}`} className="link-accent">
                      Case study<span className="sr-only">: {p.name}</span>
                    </Link>
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                      Source
                      <Icon name="external" size={14} className="text-ink-3" />
                      <span className="sr-only">for {p.name} (opens in a new tab)</span>
                    </a>
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-10 lg:col-span-4 print:mt-5 print:grid print:grid-cols-2 print:gap-5 print:space-y-0">
          <section aria-labelledby="r-skills" className="print:col-span-2">
            <h2 id="r-skills" className="text-h4 font-semibold print:text-[12pt]">
              Skills
            </h2>
            <dl className="mt-4 space-y-4 print:mt-1 print:space-y-1">
              {skills.map((s) => (
                <div key={s.group}>
                  <dt className="text-micro text-ink-3 print:inline print:after:content-[':_']">{s.group}</dt>
                  <dd className="mt-1 text-small print:inline">{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="r-education">
            <h2 id="r-education" className="text-h4 font-semibold print:text-[12pt]">
              Education
            </h2>
            <ul className="mt-4 space-y-4 print:mt-1 print:space-y-1.5">
              {education.map((e) => (
                <li key={e.school} className="text-small">
                  <p className="font-medium">{e.credential}</p>
                  <p className="text-ink-2">
                    {e.school}, {e.place}
                  </p>
                  <p className="text-ink-3">
                    {e.period}. {e.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-10 print:space-y-4">
            <section aria-labelledby="r-certificates">
              <h2 id="r-certificates" className="text-h4 font-semibold print:text-[12pt]">
                Certificates
              </h2>
              <ul className="mt-4 space-y-3 print:mt-1 print:space-y-1">
                {certificates.map((c) => (
                  <li key={c.title} className="text-small">
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="link font-medium">
                      {c.title}
                    </a>
                    <p className="text-ink-3">
                      {c.issuer}, {c.date}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="r-achievements">
              <h2 id="r-achievements" className="text-h4 font-semibold print:text-[12pt]">
                Achievements
              </h2>
              <ul className="mt-4 space-y-3 print:mt-1 print:space-y-1">
                {achievements.map((a) => (
                  <li key={a.title} className="text-small">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-ink-3">{a.date}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>

      <section className="no-print mt-20 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[46ch] text-ink-2">
          Hiring for a role? Send the details and I&rsquo;ll reply to the address you give.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact?intent=hiring" className="btn btn-primary">
            Discuss a role
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn-secondary">
            <Icon name="mail" size={16} />
            Email me
          </a>
        </div>
      </section>
    </div>
  );
}
