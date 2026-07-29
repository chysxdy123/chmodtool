import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <Link href="/">Return to chmod calculator</Link>
    </main>
  );
}
