import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ site: string }> }
) {
  try {
    const { site } = await params;

    const allSites = await prisma.site.findMany({
      where: { status: 'connected' },
    });

    const wpSite = allSites.find(s =>
      domainToSlug(s.domain) === site.toLowerCase() ||
      s.domain.toLowerCase() === site.toLowerCase()
    );

    if (!wpSite) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const latestDeployment = await prisma.deployment.findFirst({
      where: {
        siteId: wpSite.id,
        status: 'deployed',
        intelligenceData: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestDeployment || !latestDeployment.intelligenceData) {
      return NextResponse.json({ error: 'No deployment data available' }, { status: 404 });
    }

    const cached = JSON.parse(latestDeployment.intelligenceData);

    const result = {
      site: {
        settings: cached.site?.settings || {},
        navigation: cached.site?.navigation || [],
        categories: cached.site?.categories || [],
        tags: cached.site?.tags || [],
        authors: cached.site?.authors || [],
        hero: cached.site?.hero || null,
        services: cached.site?.services || [],
        portfolio: cached.site?.portfolio || [],
        products: cached.site?.products || [],
        testimonials: cached.site?.testimonials || [],
        team: cached.site?.team || [],
        faqs: cached.site?.faqs || [],
        gallery: cached.site?.gallery || [],
        stats: cached.site?.stats || [],
        cta: cached.site?.cta || null,
        contact: cached.site?.contact || null,
        newsletter: cached.site?.newsletter || null,
        footer: cached.site?.footer || null,
        posts: cached.site?.posts || [],
        media: cached.site?.media || [],
      },
      industry: cached.industry || null,
      features: cached.features || {},
      layout: cached.layout || null,
      industryLayout: cached.industryLayout || null,
      colors: cached.colors || null,
      typography: cached.typography || null,
      ai: {
        brand: cached.brand || null,
        homepage: cached.homepage || null,
        recommendations: cached.recommendations || null,
      },
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  } catch (error) {
    console.error('Site data endpoint error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch site data' },
      { status: 500 }
    );
  }
}
