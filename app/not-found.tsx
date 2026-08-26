import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">The path ends here</p>
      <h1>Page not found.</h1>
      <p>This route is not part of the current map.</p>
      <Link className="button button-primary" href="/">
        Return home
      </Link>
    </main>
  );
}
