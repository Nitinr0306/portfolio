/**
 * Static overview of MedVision AI's one-way pipeline. HTML rather than SVG so the
 * text stays readable at phone widths and is exposed to assistive tech as a list.
 */

const steps = [
  {
    service: "Next.js 14",
    role: "Interface",
    detail: "A fully TypeScript-typed frontend sends the upload.",
  },
  {
    service: "Spring Boot 3",
    role: "Validate and store",
    detail: "5-file cap, 10 MB per file, MIME allowlist, UUID-named storage. 8 REST endpoints.",
  },
  {
    service: "Quality gate",
    role: "Score before OCR",
    detail: "Blur (Laplacian variance), brightness and noise.",
    branch: "Unusable uploads are auto-flagged before the OCR pipelines run.",
  },
  {
    service: "Python FastAPI",
    role: "Computer vision",
    detail: "10 selectable operations, 6 medical modules: prescription OCR, X-ray CLAHE and more.",
  },
];

export function MedVisionSchematic() {
  return (
    <figure className="panel p-5 sm:p-7">
      <figcaption className="mb-5 flex items-baseline justify-between gap-4 text-micro text-ink-3">
        <span>Request path, simplified</span>
        <span>Three services, one direction</span>
      </figcaption>
      <ol className="relative">
        {steps.map((s, i) => (
          <li key={s.service} className="relative grid grid-cols-[1.75rem_1fr] gap-x-3 pb-6 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute top-7 bottom-1 left-[13px] w-px bg-line-strong" />
            )}
            <span
              aria-hidden
              className={
                s.branch
                  ? "relative z-10 mt-0.5 grid size-7 place-items-center rounded-full border border-accent bg-accent-soft text-micro font-medium text-accent"
                  : "relative z-10 mt-0.5 grid size-7 place-items-center rounded-full border border-line-strong bg-surface text-micro font-medium text-ink-2"
              }
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-ink">{s.service}</span>
                <span className="text-small text-ink-3">{s.role}</span>
              </p>
              <p className="mt-1 text-small text-ink-2">{s.detail}</p>
              {s.branch && (
                <p className="mt-2.5 inline-flex items-start gap-2 rounded-lg bg-flag-soft px-3 py-2 text-micro text-flag">
                  <span aria-hidden className="mt-[3px] block size-2.5 shrink-0 rounded-full border-[1.5px] border-flag" />
                  {s.branch}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
