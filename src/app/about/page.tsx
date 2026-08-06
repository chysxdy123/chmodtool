import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'About chmodtool',
  description:
    'chmodtool is a free chmod permission calculator and fix reference. Learn what it does and how to get in touch.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <main className="document-page">
      <article className="shell prose">
        <h1>About chmodtool</h1>

        <h2>What chmodtool does</h2>
        <p>
          chmodtool is a free permission calculator and troubleshooting
          reference. It converts Unix permissions between octal values, symbolic
          notation, and checkbox selections, then explains when common modes
          such as <Link href="/chmod-755">755</Link>, 644, 600, and 400 are
          appropriate.
        </p>

        <h2>Why it exists</h2>
        <p>
          Permission numbers are easy to forget, and errors such as
          &quot;permissions too open&quot; can interrupt work with SSH and AWS
          private keys. This site brings the conversion, practical explanation,
          and common fixes together so you can find an answer and get back to
          the task at hand.
        </p>

        <h2>How to use it</h2>
        <p>
          No registration or login is required, and the site is free to use.
          Start with the <Link href="/">chmod calculator</Link> or open the
          guide for the permission or error you are working with.
        </p>

        <h2>Contact</h2>
        <p>
          For general questions, email{' '}
          <a href="mailto:support@chmodtool.com">support@chmodtool.com</a>. For
          privacy questions, email{' '}
          <a href="mailto:privacy@chmodtool.com">privacy@chmodtool.com</a>. You
          can also read the <Link href="/privacy-policy">Privacy Policy</Link>{' '}
          and <Link href="/terms-of-service">Terms of Service</Link>.
        </p>

        <h2>Featured on</h2>
        <a
          href="https://www.producthunt.com/products/chmodtool-com?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-chmodtool-com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="chmodtool.com - Stop googling what chmod 755 means | Product Hunt"
            width="250"
            height="54"
            loading="lazy"
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1215233&theme=light&t=1785986566695"
          />
        </a>
      </article>
    </main>
  );
}
