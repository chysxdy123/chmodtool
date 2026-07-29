import Image from 'next/image';
import Link from 'next/link';
import messages from '@/i18n/messages/en.json';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="chmodtool.com home">
          <Image src="/logo.png" alt="" width={32} height={32} priority />
          <span>{messages.site.name}</span>
        </Link>
      </div>
    </header>
  );
}
