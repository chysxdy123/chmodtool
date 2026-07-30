import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
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
          collect or use visitors&apos; personal data.
        </p>
        {siteConfig.googleAnalyticsId ? (
          <>
            <p>
              We also offer optional Google Analytics 4 measurement. Google
              Analytics is not loaded unless you select &quot;Accept
              analytics.&quot; When accepted, it measures page views and
              successful uses of the copy command button. The copy event records
              whether the octal or symbolic command was copied; it does not send
              the command text, filename, or permission value entered into the
              calculator.
            </p>
            <p>
              Google Analytics may use cookies and process information such as
              browser and device details, approximate location, referring pages,
              and interactions with this site. Google processes this information
              as our analytics provider. You can decline analytics on your first
              visit or change your choice at any time through &quot;Analytics
              settings&quot; in the footer. Your choice is saved in your
              browser&apos;s local storage. If you withdraw consent, we stop
              sending new Google Analytics events and remove Google Analytics
              cookies accessible to this site.
            </p>
          </>
        ) : (
          <p>
            Google Analytics is not currently enabled. Before it is enabled,
            this policy and the site will provide controls that prevent Google
            Analytics from loading unless a visitor explicitly accepts it.
          </p>
        )}
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
