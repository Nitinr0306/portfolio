import Link from "next/link";
import { profile } from "@/content/profile";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="no-print border-t border-line">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-small text-ink-2">
            {profile.positioning}. {profile.availability}.
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-small">
          <li>
            <a className="link" href={`mailto:${profile.email}`}>
              Email
            </a>
          </li>
          <li>
            <a
              className="link inline-flex items-center gap-1"
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <Icon name="external" size={14} className="text-ink-3" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              className="link inline-flex items-center gap-1"
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <Icon name="external" size={14} className="text-ink-3" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <Link className="link" href="/resume">
              Résumé
            </Link>
          </li>
        </ul>

        <p className="text-micro text-ink-3 md:col-span-2">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript and Tailwind CSS. No
          trackers, no cookies.
        </p>
      </div>
    </footer>
  );
}
