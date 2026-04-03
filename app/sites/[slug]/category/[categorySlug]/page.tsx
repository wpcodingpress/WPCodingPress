import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import HeadlessCategoryRenderer from './HeadlessCategoryRenderer';

interface PageProps {
  params: Promise<{ slug: string; categorySlug: string }>;
}

async function getSiteBySlug(slug: string) {
  const site = await prisma.site.findFirst({
    where: {
      domain: {
        equals: slug,
        mode: 'insensitive',
      },
      status: 'connected',
    },
    include: {
      jobs: {
        where: { status: 'completed' },
        orderBy: { completedAt: 'desc' },
        take: 1,
      },
    },
  });
  return site;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug, categorySlug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  return (
    <HeadlessCategoryRenderer
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
      categorySlug={categorySlug}
    />
  );
}