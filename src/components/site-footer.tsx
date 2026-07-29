import Link from 'next/link';
import messages from '@/i18n/messages/en.json';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>© {new Date().getFullYear()} chmodtool.com</span>
        <nav aria-label="Legal">
          <Link href="/privacy-policy">{messages.footer.privacy}</Link>
          <Link href="/terms-of-service">{messages.footer.terms}</Link>
        </nav>
      </div>
    </footer>
  );
}
