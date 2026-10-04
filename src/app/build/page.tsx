import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Build with me",
  description:
    "What Dunna Nitin can build for you: SaaS backends, secure APIs, document and image processing, full-stack web apps and the delivery setup behind them.",
  alternates: { canonical: "/build" },
};

/** Each capability names the work that proves it. */
const capabilities = [
  {
    title: "SaaS platforms",
    body: "Multi-tenant backends with staff roles, granular permissions, subscriptions, scheduled jobs and bulk CSV import and export.",
    proof: { label: "Managio", href: "/work/managio" },
  },
  {
    title: "Secure REST APIs",
    body: "JWT authentication with refresh-token rotation, role-based access control, rate limiting and account lockout, documented with Swagger/OpenAPI.",
    proof: { label: "Managio", href: "/work/managio#request-path" },
  },
  {
    title: "Document and image processing",
    body: "Pipelines that validate uploads, score image quality, enhance images and extract text with OCR, auto-flagging unusable uploads before OCR runs.",
    proof: { label: "MedVision AI", href: "/work/medvision-ai#pipeline" },
  },
  {
    title: "Full-stack web applications",
    body: "A fully TypeScript-typed Next.js frontend on top of a Spring Boot REST API, with validation enforced on the server.",
    proof: { label: "MedVision AI", href: "/work/medvision-ai" },
  },
  {
    title: "Delivery and operations",
    body: "Docker images, CI/CD with Jenkins, Kubernetes and Terraform for infrastructure, and Prometheus and Grafana for monitoring.",
    proof: { label: "MedVision AI", href: "/work/medvision-ai#stack" },
  },
];

/** A real sequence, so it is numbered. */
const process = [
  {
    title: "Scope",
    body: "We agree what the first version has to do, who uses it and what can wait. You get the scope in writing before any code is written.",
  },
  {
    title: "Design the system",
    body: "Data model, API contract, roles and permissions are settled first, so the interface is built on something that won't shift under it.",
  },
  {
    title: "Build in increments",
    body: "Work lands in a repository you own, with regular check-ins so you can see progress and change direction early.",
  },
  {
    title: "Ship and hand over",
    body: "Containerised deployment where it fits, API documentation and a walkthrough of the code.",
  },
];

const questions = [
  {
    q: "Who will I be working with?",
    a: "Me, directly. There is no agency and no hand-off to anyone else.",
  },
  {
    q: "What stack do you use?",
    a: "My projects use Spring Boot with Java for the backend, PostgreSQL for data and Next.js with TypeScript for the frontend, with Python for computer vision. If you already have a stack, say so in the form and I'll tell you honestly whether I'm a good fit.",
  },
  {
    q: "Do you take on work while studying?",
    a: "Yes, alongside my B.Tech in Computer Science. Timelines are agreed at the scoping stage, before any work starts.",
  },
];

export default function BuildPage() {
  return (
    <>
      <section className="container-page pt-12 pb-20 md:pt-20 md:pb-28">
        <p className="text-small text-ink-3">Build with me</p>
        <h1 className="mt-3 max-w-[16ch] text-h1">You bring the product. I&rsquo;ll build the system behind it.</h1>
        <p className="mt-6 max-w-[58ch] text-lead text-ink-2">
          I build backends, APIs and full-stack web apps with Java, Spring Boot and Next.js, and I set up the pipeline
          that ships them.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact?intent=project" className="btn btn-primary">
            Start a project
          </Link>
          <Link href="/#work" className="btn btn-secondary">
            Read the case studies
          </Link>
        </div>
      </section>

      <section aria-labelledby="capabilities-title" className="section border-t border-line">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="capabilities-title" className="text-h2">
              What I can build for you
            </h2>
            <p className="mt-4 max-w-[36ch] text-ink-2">Each one links to a project where I&rsquo;ve already done it.</p>
          </div>
          <ul className="divide-y divide-line border-y border-line lg:col-span-8">
            {capabilities.map((c) => (
              <li key={c.title} className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-8">
                <div>
                  <h3 className="text-h4 font-semibold tracking-[-0.015em]">{c.title}</h3>
                  <p className="mt-2 max-w-[56ch] text-small text-ink-2">{c.body}</p>
                </div>
                <Link href={c.proof.href} className="link-accent self-start text-small whitespace-nowrap sm:mt-1">
                  See it in {c.proof.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="process-title" className="section border-t border-line bg-surface">
        <div className="container-page">
          <h2 id="process-title" className="text-h2">
            How a project runs
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {process.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-full border border-line-strong text-small font-medium text-ink-2 tabular-nums"
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-h4 font-semibold tracking-[-0.015em]">{step.title}</h3>
                <p className="mt-2 text-small text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="section border-t border-line">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="text-h2 lg:col-span-4">
            Good to know
          </h2>
          <dl className="space-y-8 lg:col-span-8">
            {questions.map((item) => (
              <div key={item.q} className="border-t border-line pt-6">
                <dt className="text-h4 font-semibold tracking-[-0.015em]">{item.q}</dt>
                <dd className="mt-2 max-w-[62ch] text-ink-2">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="build-cta-title" className="section border-t border-line bg-surface">
        <div className="container-page grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 id="build-cta-title" className="max-w-[20ch] text-h1">
              Have a product to build?
            </h2>
            <p className="mt-4 max-w-[50ch] text-ink-2">
              Tell me what it should do and roughly when you need it. You&rsquo;ll get a reply at the email you give,
              or write to{" "}
              <a className="link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Link href="/contact?intent=project" className="btn btn-primary">
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
