/**
 * Templates re-mount on every navigation, which gives each route a short,
 * transform-only entrance. Reduced-motion users get it instantly (see globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
