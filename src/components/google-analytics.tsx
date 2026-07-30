'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  openAnalyticsSettingsEvent,
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from '@/lib/analytics';

function removeGoogleAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();

    if (!name || (name !== '_ga' && !name.startsWith('_ga_'))) continue;

    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;

    if (window.location.hostname.includes('.')) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}; SameSite=Lax`;
    }
  }
}

export function GoogleAnalytics({ id }: { id: string }) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [settingsAreOpen, setSettingsAreOpen] = useState(false);
  const validId = /^G-[A-Z0-9]+$/.test(id) ? id : '';

  useEffect(() => {
    const initializationFrame = window.requestAnimationFrame(() => {
      setConsent(readAnalyticsConsent());
      setIsReady(true);
    });

    function openSettings() {
      setSettingsAreOpen(true);
    }

    window.addEventListener(openAnalyticsSettingsEvent, openSettings);

    return () => {
      window.cancelAnimationFrame(initializationFrame);
      window.removeEventListener(openAnalyticsSettingsEvent, openSettings);
    };
  }, []);

  if (!validId) {
    return null;
  }

  const showConsentPanel = isReady && (consent === null || settingsAreOpen);

  function chooseConsent(nextConsent: AnalyticsConsent) {
    if (nextConsent === 'declined' && consent === 'accepted') {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      removeGoogleAnalyticsCookies();
    }

    if (nextConsent === 'accepted' && consent === 'declined') {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    writeAnalyticsConsent(nextConsent);
    setConsent(nextConsent);
    setSettingsAreOpen(false);
  }

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.gtag('js',new Date());window.gtag('config','${validId}');`}
          </Script>
        </>
      )}

      {showConsentPanel && (
        <section
          className="analytics-consent"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <div className="analytics-consent-copy">
            <h2 id="analytics-consent-title">Analytics choices</h2>
            <p id="analytics-consent-description">
              With your permission, Google Analytics will measure page views and
              copied chmod commands. Google may store cookies and process usage
              data. Cloudflare Web Analytics remains active either way. See our{' '}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
          <div className="analytics-consent-actions">
            <button
              type="button"
              className="consent-button secondary"
              onClick={() => chooseConsent('declined')}
            >
              Decline
            </button>
            <button
              type="button"
              className="consent-button primary"
              onClick={() => chooseConsent('accepted')}
            >
              Accept analytics
            </button>
            {consent !== null && (
              <button
                type="button"
                className="consent-close"
                aria-label="Close analytics choices"
                onClick={() => setSettingsAreOpen(false)}
              >
                Close
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
