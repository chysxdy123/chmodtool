import Link from 'next/link';
import { permissionGuides } from '@/content/chmod-permissions';

type CommonPermissionsProps = {
  currentSlug?: string;
};

export function CommonPermissions({ currentSlug }: CommonPermissionsProps) {
  const guides = permissionGuides.filter((guide) => guide.slug !== currentSlug);

  return (
    <section className="common-permissions" aria-labelledby="common-title">
      <div className="common-heading">
        <p className="section-kicker">Linux permission guides</p>
        <h2 id="common-title">Common permissions</h2>
      </div>
      <div className="common-permission-list">
        {guides.map((guide) => (
          <Link
            className="common-permission-link"
            href={`/${guide.slug}`}
            key={guide.slug}
          >
            <strong>{guide.mode}</strong>
            <span>{guide.homeSummary}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
