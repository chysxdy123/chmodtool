import type { Metadata } from 'next';
import { AdSlot } from '@/components/ad-slot';
import { ChmodToolShell } from '@/components/chmod-tool-shell';
import { CommonPermissions } from '@/components/common-permissions';
import { HomePermissionGuide } from '@/components/home-permission-guide';
import messages from '@/i18n/messages/en.json';
import { siteConfig } from '@/lib/config';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: messages.home.title,
  description: messages.home.description,
});

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: messages.home.h1,
      url: siteConfig.url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: messages.home.structuredDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: messages.home.guide.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <main>
        <section className="tool-band">
          <div className="shell tool-layout">
            <div className="page-heading">
              <h1>{messages.home.h1}</h1>
              <p>{messages.home.description}</p>
            </div>
            <ChmodToolShell />
            <AdSlot name="home-after-tool" className="ad-slot" />
            <CommonPermissions />
            <HomePermissionGuide />
          </div>
        </section>
      </main>
    </>
  );
}
