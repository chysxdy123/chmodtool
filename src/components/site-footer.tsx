'use client';

import Link from 'next/link';
import messages from '@/i18n/messages/en.json';
import { openAnalyticsSettingsEvent } from '@/lib/analytics';

export function SiteFooter({
  showAnalyticsSettings,
}: {
  showAnalyticsSettings: boolean;
}) {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>© {new Date().getFullYear()} chmodtool.com</span>
        <nav aria-label="Legal">
          <Link href="/privacy-policy">{messages.footer.privacy}</Link>
          <Link href="/terms-of-service">{messages.footer.terms}</Link>
          {showAnalyticsSettings && (
            <button
              type="button"
              className="footer-link-button"
              onClick={() =>
                window.dispatchEvent(new Event(openAnalyticsSettingsEvent))
              }
            >
              Analytics settings
            </button>
          )}
        </nav>
      </div>
    </footer>
  );
}
