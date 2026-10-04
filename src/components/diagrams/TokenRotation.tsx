/**
 * Sign-in and refresh-token rotation as a two-lane sequence diagram, built in HTML so
 * labels wrap cleanly on small screens.
 */

type Message = { from: "client" | "api"; label: string; note?: string; tone?: "flag" | "accent" };

const messages: Message[] = [
  { from: "client", label: "Sign in with credentials" },
  {
    from: "api",
    label: "Access token + refresh token",
    note: "Repeated failed sign-ins lock the account automatically instead.",
  },
  { from: "client", label: "API call with the access token" },
  { from: "api", label: "Access token has expired", tone: "flag" },
  { from: "client", label: "Present the refresh token" },
  {
    from: "api",
    label: "New access token + new refresh token",
    note: "Rotation: the refresh token that was just used is retired.",
    tone: "accent",
  },
];

export function TokenRotation() {
  return (
    <figure className="panel p-5 sm:p-7">
      <div className="grid grid-cols-2 border-b border-line pb-3 text-small font-medium">
        <span>Client</span>
        <span className="text-right">Managio API</span>
      </div>
      <ol className="relative mt-2">
        {/* lifelines */}
        <span aria-hidden className="absolute top-0 bottom-0 left-1 w-px bg-line" />
        <span aria-hidden className="absolute top-0 right-1 bottom-0 w-px bg-line" />
        {messages.map((m, i) => (
          <li key={i} className="relative py-3.5">
            <p
              className={
                m.from === "client"
                  ? "pr-10 pl-5 text-small text-ink"
                  : "pr-5 pl-10 text-right text-small text-ink"
              }
            >
              <span className="sr-only">{m.from === "client" ? "Client to API: " : "API to client: "}</span>
              <span className={m.tone === "flag" ? "text-flag" : m.tone === "accent" ? "font-medium text-accent" : undefined}>
                {m.label}
              </span>
            </p>
            <Arrow direction={m.from === "client" ? "right" : "left"} tone={m.tone} />
            {m.note && (
              <p className={m.from === "client" ? "mt-2 pl-5 text-micro text-ink-3" : "mt-2 pr-5 text-right text-micro text-ink-3"}>
                {m.note}
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-line pt-4 text-micro text-ink-3">
        Simplified sequence of the refresh-token rotation pattern.
      </p>
    </figure>
  );
}

function Arrow({ direction, tone }: { direction: "left" | "right"; tone?: Message["tone"] }) {
  const color = tone === "flag" ? "text-flag" : tone === "accent" ? "text-accent" : "text-line-strong";
  return (
    <svg
      aria-hidden
      className={`mt-1.5 block h-3 w-full ${color}`}
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      fill="none"
    >
      {direction === "right" ? (
        <>
          <line x1="1" y1="6" x2="98" y2="6" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <polyline points="94,2 98.6,6 94,10" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <>
          <line x1="2" y1="6" x2="99" y2="6" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <polyline points="6,2 1.4,6 6,10" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}
