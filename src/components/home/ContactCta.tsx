import Link from "next/link";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";

export function ContactCta() {
  return (
    <section aria-labelledby="cta-title" className="section border-t border-line">
      <div className="container-page">
        <h2 id="cta-title" className="max-w-[18ch] text-h1">
          Tell me what you&rsquo;re building, or who you&rsquo;re hiring.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="max-w-[44ch] text-ink-2">
              The form takes about a minute. Pick the reason that fits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact?intent=project" className="btn btn-primary">
                Start a project
              </Link>
              <Link href="/contact?intent=hiring" className="btn btn-secondary">
                Discuss a role
              </Link>
            </div>
          </div>
          <div className="md:border-l md:border-line md:pl-14">
            <p className="text-ink-2">Or write to me directly.</p>
            <a
              href={`mailto:${profile.email}`}
              className="link mt-3 inline-block text-h4 font-medium tracking-[-0.015em] break-all"
            >
              {profile.email}
            </a>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CopyEmail email={profile.email} />
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="LinkedIn (opens in a new tab)"
                title="LinkedIn"
              >
                <Icon name="linkedin" size={20} />
              </a>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub"
              >
                <Icon name="github" size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
