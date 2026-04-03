import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import NewsMagazineTemplate from '@/components/templates/NewsMagazine';
import BusinessTemplate from '@/components/templates/Business';
import ModernTemplate from '@/components/templates/Modern';
import { TEMPLATES } from '@/components/templates';

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
    },
  });

  const matchingSite = allSites.find(site => {
    const siteSlug = domainToSlug(site.domain);
    return siteSlug === slug.toLowerCase() || site.domain.toLowerCase() === slug.toLowerCase();
  });

  return matchingSite || null;
}

function getTemplateComponent(template: string) {
  switch (template) {
    case 'business':
      return BusinessTemplate;
    case 'modern':
      return ModernTemplate;
    case 'news':
    default:
      return NewsMagazineTemplate;
  }
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  const template = site.template || 'news';
  const TemplateComponent = getTemplateComponent(template);
  const templateInfo = TEMPLATES.find(t => t.id === template);

  return (
    <TemplateComponent
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
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