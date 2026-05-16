import { notFound } from 'next/navigation';
import React from 'react';
import prisma from '@/lib/prisma';
import NewsMagazineTemplate from '@/components/templates/NewsMagazine';
import BusinessTemplate from '@/components/templates/Business';
import ModernTemplate from '@/components/templates/Modern';
import AdvancedTemplate from '@/components/templates/AdvancedTemplate';
import AdaptiveTemplate from '@/components/templates/AdaptiveTemplate';
import { TEMPLATES } from '@/components/templates';
import { fetchWordPressData } from '@/lib/deployment/wp-data';
import { normalizeWPData } from '@/lib/engine/content-mapper';

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
    case 'adaptive':
      return AdaptiveTemplate;
    case 'business':
      return BusinessTemplate;
    case 'modern':
      return ModernTemplate;
    case 'advanced':
      return AdvancedTemplate;
    case 'news':
    default:
      return NewsMagazineTemplate;
  }
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site) {
    notFound();
  }

  const template = site.template || 'adaptive';
  const TemplateComponent = getTemplateComponent(template) as React.ComponentType<any>;

  if (template === 'adaptive' && site.status === 'connected') {
    try {
      const wpData = await fetchWordPressData(site.wpSiteUrl, site.wpApiKey || '');
      const normalizedData = normalizeWPData(wpData as unknown as Record<string, unknown>, site.wpSiteUrl);
      return (
        <TemplateComponent
          site={normalizedData}
          wpRaw={wpData as unknown as Record<string, unknown>}
          siteName={site.domain}
        />
      );
    } catch (error) {
      console.error('Failed to fetch WP data for preview:', error);
    }
  }

  return (
    <TemplateComponent
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
      siteSlug={slug}
    />
  );
}

export async function generateStaticParams() {
  return [];
}