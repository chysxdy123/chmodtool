import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@/components/google-analytics';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { defaultLocale } from '@/i18n/config';
import messages from '@/i18n/messages/en.json';
import { siteConfig } from '@/lib/config';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  icons: {
    icon: '/favicon.ico',
  },
  verification: siteConfig.googleSiteVerification
    ? { google: siteConfig.googleSiteVerification }
    : undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale}>
      <body>
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
          <SiteHeader />
          {children}
          <SiteFooter
            showAnalyticsSettings={Boolean(siteConfig.googleAnalyticsId)}
          />
        </NextIntlClientProvider>
        <GoogleAnalytics id={siteConfig.googleAnalyticsId} />
      </body>
    </html>
  );
}
