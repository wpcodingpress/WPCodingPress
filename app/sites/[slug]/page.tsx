import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import HeadlessSiteRenderer from './HeadlessSiteRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
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
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  const matchingSite = allSites.find(site => {
    const siteSlug = domainToSlug(site.domain);
    return siteSlug === slug.toLowerCase() || site.domain.toLowerCase() === slug.toLowerCase();
  });

  return matchingSite || null;
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  const latestJob = site.jobs[0];
  const wpSiteUrl = site.wpSiteUrl;
  const apiKey = site.wpApiKey || '';

  return (
    <HeadlessSiteRenderer
      wpSiteUrl={wpSiteUrl}
      apiKey={apiKey}
      siteName={site.domain}
      userEmail={site.user?.email}
    />
  );
}

export async function generateStaticParams() {
  try {
    const sites = await prisma.site.findMany({
      where: { status: 'connected' },
      select: { domain: true },
    });
    
    return sites.map((site) => ({
      slug: domainToSlug(site.domain),
    }));
  } catch {
    return [];
  }
}