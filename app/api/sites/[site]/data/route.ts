import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchWordPressData } from '@/lib/deployment/wp-data';
import { analyzeWordPressSite } from '@/lib/engine/site-analyzer';
import { createAIEngine } from '@/lib/ai';

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

    const wpData = await fetchWordPressData(wpSite.wpSiteUrl, wpSite.wpApiKey || '');

    const analysis = analyzeWordPressSite(wpData as unknown as Record<string, unknown>, wpSite.wpSiteUrl);

    const engine = createAIEngine();
    const aiResult = engine.analyze(
      analysis.site,
      analysis.industry,
      analysis.features,
      wpData?.site_info as Record<string, unknown> | undefined,
      undefined,
      wpData as unknown as Record<string, unknown>
    );

    return NextResponse.json({
      site: analysis.site,
      industry: analysis.industry,
      features: analysis.features,
      layout: analysis.layout,
      industryLayout: analysis.industryLayout,
      colors: analysis.colors,
      typography: analysis.typography,
      spacing: analysis.spacing,
      animations: analysis.animations,
      cssVariables: analysis.cssVariables,
      ai: {
        template: aiResult.template,
        layout: aiResult.layout,
        sections: aiResult.sections,
        brand: aiResult.brand,
        homepage: aiResult.homepage,
        recommendations: aiResult.recommendations,
        adapters: aiResult.adapters,
      },
    });
  } catch (error) {
    console.error('Site data export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch site data' },
      { status: 500 }
    );
  }
}
