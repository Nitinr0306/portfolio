import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";
import { intents, type Intent } from "@/lib/contact-schema";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hiring for a role or building a product? Get in touch with Dunna Nitin.",
  alternates: { canonical: "/contact" },
};

type Props = { searchParams: Promise<{ intent?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const { intent } = await searchParams;
  const requested = Array.isArray(intent) ? intent[0] : intent;
  // Recruiters are the most common visitors; every project CTA passes ?intent=project explicitly.
  const initialIntent: Intent = intents.includes(requested as Intent) ? (requested as Intent) : "hiring";

  return (
    <div className="container-page pt-12 pb-24 md:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h1 className="text-h1">Let&rsquo;s talk</h1>
          <p className="mt-5 max-w-[40ch] text-lead text-ink-2">
            Hiring for a role, or have something to build? Tell me a little about it and I&rsquo;ll reply to the email
            you give.
          </p>

          <div className="mt-10 space-y-8 border-t border-line pt-8">
            <div>
              <p className="text-small text-ink-3">Email</p>
              <a href={`mailto:${profile.email}`} className="link mt-1 inline-block font-medium break-all">
                {profile.email}
              </a>
              <div className="mt-3">
                <CopyEmail email={profile.email} />
              </div>
            </div>
            <div>
              <p className="text-small text-ink-3">Elsewhere</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href={profile.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-flex items-center gap-2"
                  >
                    <Icon name="linkedin" size={16} className="text-ink-2" />
                    LinkedIn
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-flex items-center gap-2"
                  >
                    <Icon name="github" size={16} className="text-ink-2" />
                    GitHub
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={profile.resumePdf} download className="link inline-flex items-center gap-2">
                    <Icon name="download" size={16} className="text-ink-2" />
                    Résumé (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ContactForm initialIntent={initialIntent} email={profile.email} />
        </div>
      </div>
    </div>
  );
}
