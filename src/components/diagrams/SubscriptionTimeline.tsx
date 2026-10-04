/**
 * Managio's automated subscription workflows. The résumé names them (scheduled expiry
 * handling, a 3-stage reminder workflow, bulk CSV import and export) but not their
 * timing, so the diagram shows what runs, not when.
 */

const stages = ["Stage 1", "Stage 2", "Stage 3"];

export function SubscriptionTimeline() {
  return (
    <figure className="panel p-5 sm:p-7">
      <dl className="divide-y divide-line">
        <div className="grid gap-3 pb-5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
          <dt>
            <span className="block font-medium">Expiry handling</span>
            <span className="text-micro text-ink-3">Runs on a schedule</span>
          </dt>
          <dd className="flex items-center gap-3 text-small text-ink-2">
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-strong">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
            </span>
            Subscription expiry is handled automatically.
          </dd>
        </div>

        <div className="grid gap-3 py-5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
          <dt>
            <span className="block font-medium">Reminders</span>
            <span className="text-micro text-ink-3">Automated workflow</span>
          </dt>
          <dd>
            <ol className="flex items-center" aria-label="3-stage reminder workflow">
              {stages.map((stage, i) => (
                <li key={stage} className="flex flex-1 items-center last:flex-none">
                  <span className="grid h-8 shrink-0 place-items-center rounded-full border border-accent bg-accent-soft px-3 text-micro font-medium text-accent">
                    {stage}
                  </span>
                  {i < stages.length - 1 && <span aria-hidden className="mx-2 h-px flex-1 bg-accent/50" />}
                </li>
              ))}
            </ol>
          </dd>
        </div>

        <div className="grid gap-3 pt-5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
          <dt>
            <span className="block font-medium">Bulk member data</span>
            <span className="text-micro text-ink-3">Membership management</span>
          </dt>
          <dd className="flex flex-wrap gap-2">
            <span className="chip">CSV import</span>
            <span className="chip">CSV export</span>
          </dd>
        </div>
      </dl>
      <figcaption className="mt-5 border-t border-line pt-4 text-micro text-ink-3">
        Simplified view of the workflows; timing between reminder stages isn&rsquo;t shown.
      </figcaption>
    </figure>
  );
}
