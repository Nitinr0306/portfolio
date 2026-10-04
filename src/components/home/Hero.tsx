import Link from "next/link";
import { LifecycleRail } from "@/components/home/LifecycleRail";
import { Icon } from "@/components/ui/Icon";
import { lifecycle } from "@/content/lifecycle";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const projectNames = Object.fromEntries(projects.map((p) => [p.slug, p.name]));

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 pb-16 md:pt-20 md:pb-24">
      <div className="container-page">
        <p className="flex items-center gap-2.5 text-small text-ink-2">
          <span className="status-dot" aria-hidden />
          {profile.availability}
        </p>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
          <div>
            <h1
              id="hero-title"
              className="max-w-[13ch] text-display font-semibold tracking-[-0.045em] [font-stretch:92%]"
            >
              I build software from the schema to the deploy.
            </h1>
            <p className="mt-7 max-w-[54ch] text-lead text-ink-2">
              I&rsquo;m {profile.name}, a backend-focused full-stack engineer. Java and Spring Boot at the
              core, Next.js and TypeScript on the front, and Docker, Jenkins and Kubernetes to ship it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/#work" className="btn btn-primary">
                Read the case studies
              </Link>
              <a href={profile.resumePdf} download className="btn btn-secondary">
                <Icon name="download" size={16} />
                Download résumé
                <span className="sr-only">(PDF)</span>
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-small sm:grid-cols-4 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div>
              <dt className="text-ink-3">Studying</dt>
              <dd className="mt-0.5 text-ink">B.Tech CSE, Lovely Professional University, since Aug 2023</dd>
            </div>
            <div>
              <dt className="text-ink-3">Core stack</dt>
              <dd className="mt-0.5 text-ink">Java 21, Spring Boot 3, PostgreSQL, Next.js</dd>
            </div>
            <div>
              <dt className="text-ink-3">Based in</dt>
              <dd className="mt-0.5 text-ink">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Profiles</dt>
              <dd className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                <a className="link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a className="link" href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a className="link" href={`mailto:${profile.email}`}>
                  Email
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-16 md:mt-20">
          <LifecycleRail stages={lifecycle} projectNames={projectNames} />
        </div>
      </div>
    </section>
  );
}
