import Link from "next/link";
import { achievements, certificates, education, profile } from "@/content/profile";

export function About() {
  const degree = education[0];
  return (
    <section aria-labelledby="about-title" className="section border-t border-line bg-surface">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="about-title" className="text-h2">
            About
          </h2>
          <div className="mt-6 max-w-[60ch] space-y-5 text-ink-2">
            <p>
              I&rsquo;m {profile.name}, a Computer Science undergraduate at {degree.school}. Most of my work sits
              on the backend: Java, Spring Boot, Spring Security, PostgreSQL and Redis. On MedVision AI that
              extends to a TypeScript-typed Next.js frontend, Docker containers and Jenkins CI/CD.
            </p>
          </div>
          <Link href="/resume" className="link-accent mt-7 inline-block text-small">
            Open the résumé
          </Link>
        </div>

        <dl className="grid content-start gap-8 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
          <div className="sm:col-span-2">
            <dt className="text-small text-ink-3">Education</dt>
            <dd className="mt-2">
              <p className="font-medium">{degree.credential}</p>
              <p className="text-small text-ink-2">
                {degree.school}, {degree.period}
              </p>
            </dd>
          </div>
          <div>
            <dt className="text-small text-ink-3">Problem solving</dt>
            <dd className="mt-2 space-y-2 text-small">
              {achievements.map((a) => (
                <p key={a.title}>{a.title}</p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-small text-ink-3">Certificates</dt>
            <dd className="mt-2 space-y-2 text-small">
              {certificates.map((c) => (
                <p key={c.title}>
                  {c.title}
                  <span className="block text-ink-3">
                    {c.issuer}, {c.date}
                  </span>
                </p>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
