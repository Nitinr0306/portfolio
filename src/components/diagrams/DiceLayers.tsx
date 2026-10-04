/**
 * Dice Tournament's layered structure. Each layer names the responsibility it owns,
 * which is the point of the project: single responsibility, in plain Java.
 */

const layers = [
  { name: "Validation", detail: "Input validation and custom exception handling." },
  { name: "Service", detail: "Tournament and player logic, split by single responsibility. Runs matches and handles ties." },
  { name: "Report", detail: "Leaderboards and statistics with Streams, Lambdas and Comparators: totals and averages." },
  { name: "Repository", detail: "Repository pattern over Java serialization, so player data persists between runs." },
  { name: "Model", detail: "The domain: players, configurable dice and rounds, match results." },
];

export function DiceLayers() {
  return (
    <figure className="panel p-5 sm:p-7">
      <figcaption className="mb-5 text-micro text-ink-3">Application layers, simplified</figcaption>
      <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {layers.map((l) => (
          <li key={l.name} className="grid gap-1 bg-paper px-4 py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <span className="text-small font-medium">{l.name}</span>
            <span className="text-small text-ink-2">{l.detail}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-micro text-ink-3">Patterns: Builder, Repository, and single-responsibility services.</p>
    </figure>
  );
}
