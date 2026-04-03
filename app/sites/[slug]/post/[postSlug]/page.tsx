import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import HeadlessPostRenderer from './HeadlessPostRenderer';

interface PageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function getSiteBySlug(slug: string) {
  const allSites = await prisma.site.findMany({
    where: { status: 'connected' },
    include: {
      jobs: {
        where: { status: 'completed' },
        orderBy: { completedAt: 'desc' },
        take: 1,
      },
    },
  });

  const matchingSite = allSites.find(site => {
    const siteSlug = domainToSlug(site.domain);
    return siteSlug === slug.toLowerCase() || site.domain.toLowerCase() === slug.toLowerCase();
  });

  return matchingSite || null;
}

export default async function PostPage({ params }: PageProps) {
  const { slug, postSlug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  return (
    <HeadlessPostRenderer
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
      postSlug={postSlug}
    />
  );
}