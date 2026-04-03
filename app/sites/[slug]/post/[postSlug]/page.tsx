import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import HeadlessPostRenderer from './HeadlessPostRenderer';

interface PageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

async function getSiteBySlug(slug: string) {
  const site = await prisma.site.findFirst({
    where: {
      domain: slug.toLowerCase(),
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