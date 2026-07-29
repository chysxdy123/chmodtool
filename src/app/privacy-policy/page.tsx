import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy information for chmodtool.com.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="document-page">
      <article className="shell prose">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 29, 2026</p>
        <h2>Calculator data</h2>
        <p>
          The chmod calculator runs in your browser. Permission values entered
          into the tool are not sent to a chmodtool.com server.
        </p>
        <h2>Analytics</h2>
        <p>
          We use Cloudflare Web Analytics to understand aggregate site traffic
          and page performance. Cloudflare states that Web Analytics does not
          collect or use visitors&apos; personal data. Google Analytics is not
          currently enabled.
        </p>
        <h2>Advertising</h2>
        <p>
          Advertising is not currently enabled, and this site does not load
          advertising scripts. This policy will be updated before advertising is
          enabled.
        </p>
        <h2>Contact</h2>
        <p>Privacy questions can be sent to privacy@chmodtool.com.</p>
      </article>
    </main>
  );
}
