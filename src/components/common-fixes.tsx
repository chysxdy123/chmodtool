import Link from 'next/link';
import { commonFixes } from '@/content/common-fixes';

export function CommonFixes() {
  return (
    <section className="common-fixes" aria-labelledby="common-fixes-title">
      <div className="common-heading">
        <p className="section-kicker">Troubleshooting</p>
        <h2 id="common-fixes-title">Common fixes</h2>
      </div>
      <div className="common-fix-list">
        {commonFixes.map((fix) => (
          <Link
            className="common-fix-link"
            href={`/${fix.slug}`}
            key={fix.slug}
          >
            <strong>{fix.title}</strong>
            <span>{fix.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
