import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PermissionGuidePage } from '@/components/permission-guide-page';
import {
  getPermissionGuide,
  permissionGuides,
} from '@/content/chmod-permissions';
import { createPageMetadata } from '@/lib/seo';

type GuideRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return permissionGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuideRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPermissionGuide(slug);

  if (!guide) return {};

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/${guide.slug}`,
  });
}

export default async function GuideRoute({ params }: GuideRouteProps) {
  const { slug } = await params;
  const guide = getPermissionGuide(slug);

  if (!guide) notFound();

  return <PermissionGuidePage guide={guide} />;
}
