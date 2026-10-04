import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="text-small text-ink-3">404</p>
      <h1 className="mt-3 max-w-[18ch] text-h1">This page isn&rsquo;t part of the system.</h1>
      <p className="mt-5 max-w-[48ch] text-ink-2">
        The link may be old or mistyped. These are the places most people are looking for:
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the home page
        </Link>
        <Link href="/#work" className="btn btn-secondary">
          Read the case studies
        </Link>
        <Link href="/resume" className="btn btn-secondary">
          Open the résumé
        </Link>
      </div>
    </div>
  );
}
