import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Terms of Service',
  description: 'Terms for using chmodtool.com.',
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <main className="document-page">
      <article className="shell prose">
        <h1>Terms of Service</h1>
        <p>Last updated: July 29, 2026</p>
        <h2>Use of the tool</h2>
        <p>
          chmodtool.com provides a browser-based permission calculator for
          general informational use. You remain responsible for reviewing any
          command or permission value before applying it to a system.
        </p>
        <h2>Availability</h2>
        <p>
          The site may change or become unavailable without notice. No guarantee
          is made that every result is suitable for every operating environment.
        </p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to support@chmodtool.com.</p>
      </article>
    </main>
  );
}
