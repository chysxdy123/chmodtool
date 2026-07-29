import type { Metadata } from 'next';
import { AdSlot } from '@/components/ad-slot';
import { ChmodToolShell } from '@/components/chmod-tool-shell';
import messages from '@/i18n/messages/en.json';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'chmod calculator',
  description: messages.home.description,
});

export default function HomePage() {
  return (
    <main>
      <section className="tool-band">
        <div className="shell tool-layout">
          <div className="page-heading">
            <h1>chmod calculator</h1>
            <p>{messages.home.description}</p>
          </div>
          <ChmodToolShell />
          <AdSlot name="home-after-tool" className="ad-slot" />
        </div>
      </section>
    </main>
  );
}
