import Link from "next/link";

/**
 * Three ways in, one per audience. Each names what the visitor gets, not a slogan.
 */
const paths = [
  {
    question: "Hiring?",
    body: "One page with skills, projects and education, plus the PDF.",
    href: "/resume",
    action: "Open the résumé",
  },
  {
    question: "Assessing technical depth?",
    body: "Architecture, engineering decisions and interactive walkthroughs, with the source on GitHub.",
    href: "/#work",
    action: "Read the case studies",
  },
  {
    question: "Building a product?",
    body: "What I can build for you, how a project runs, and a short form to start one.",
    href: "/build",
    action: "See what I can build",
  },
];

export function Paths() {
  return (
    <section aria-label="Where to start" className="border-y border-line bg-surface">
      <ul className="container-page grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {paths.map((p) => (
          <li key={p.href} className="py-7 md:px-8 md:py-9 md:first:pl-0 md:last:pr-0">
            <Link href={p.href} className="group block rounded-md">
              <h2 className="text-h4 font-semibold tracking-[-0.015em]">{p.question}</h2>
              <p className="mt-2 text-small text-ink-2">{p.body}</p>
              <span className="link-accent mt-4 inline-block text-small group-hover:decoration-accent">
                {p.action}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
