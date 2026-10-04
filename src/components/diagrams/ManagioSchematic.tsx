/**
 * Managio as nested layers: every request crosses the outer defences before it
 * reaches the domain and the data. Each band is inset from the one around it.
 */

const layers = [
  { name: "Rate limiting", detail: "Caps how often a client can call the API" },
  { name: "Authentication", detail: "JWT access and refresh tokens with rotation; lockout after failed logins" },
  { name: "Authorisation", detail: "6 staff roles, 30 permission controls" },
  { name: "API", detail: "14 controllers, 95 REST APIs, standardised validation and errors" },
  { name: "Domain", detail: "8 business modules, scheduled expiry, 3-stage reminders, CSV import and export" },
  { name: "Data", detail: "PostgreSQL with Flyway migrations, Redis" },
];

export function ManagioSchematic() {
  return (
    <figure className="panel p-5 sm:p-7">
      <figcaption className="mb-5 flex items-baseline justify-between gap-4 text-micro text-ink-3">
        <span>Layers a request crosses</span>
        <span>Outermost first</span>
      </figcaption>
      <ol className="space-y-1.5">
        {layers.map((l, i) => (
          <li
            key={l.name}
            className="rounded-lg border border-line bg-paper px-3.5 py-2.5 sm:px-4"
            style={{ marginInline: `min(${i * 0.9}rem, ${i * 2.2}%)` }}
          >
            <p className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
              <span
                className={
                  i < 3 ? "shrink-0 text-small font-medium text-accent sm:w-32" : "shrink-0 text-small font-medium text-ink sm:w-32"
                }
              >
                {l.name}
              </span>
              <span className="text-micro text-ink-2">{l.detail}</span>
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-micro text-ink-3">Simplified view. Accent marks the security layers.</p>
    </figure>
  );
}
