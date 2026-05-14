import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { analyzeWordPressSite } from '@/lib/engine/site-analyzer';
import { createAIEngine } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, wpSiteUrl, wpApiKey, rawData } = body;

    let wpData: Record<string, unknown>;

    if (rawData) {
      wpData = rawData;
    } else if (siteId) {
      const site = await prisma.site.findFirst({
        where: { id: siteId, userId: session.user.id },
      });
      if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }
      const cleanUrl = site.wpSiteUrl.startsWith('http') ? site.wpSiteUrl : `https://${site.wpSiteUrl}`;
      const verifyResponse = await fetch(`${cleanUrl}/wp-json/headless/v1/export`, {
        headers: { 'X-API-Key': site.wpApiKey || '' },
      });
      if (!verifyResponse.ok) {
        return NextResponse.json({ error: 'Failed to fetch WordPress data' }, { status: 400 });
      }
      wpData = await verifyResponse.json();
    } else if (wpSiteUrl && wpApiKey) {
      const cleanUrl = wpSiteUrl.startsWith('http') ? wpSiteUrl : `https://${wpSiteUrl}`;
      const verifyResponse = await fetch(`${cleanUrl}/wp-json/headless/v1/export`, {
        headers: { 'X-API-Key': wpApiKey },
      });
      if (!verifyResponse.ok) {
        return NextResponse.json({ error: 'Failed to fetch WordPress data' }, { status: 400 });
      }
      wpData = await verifyResponse.json();
    } else {
      return NextResponse.json(
        { error: 'Provide siteId, or wpSiteUrl+wpApiKey, or rawData' },
        { status: 400 }
      );
    }

    const baseUrl = typeof wpData?.site_info === 'object' && wpData.site_info !== null
      ? String((wpData.site_info as Record<string, unknown>).url || wpSiteUrl || '')
      : wpSiteUrl || '';

    const analysis = analyzeWordPressSite(wpData, baseUrl);
    const engine = createAIEngine();
    const aiResult = engine.analyze(
      analysis.site,
      analysis.industry,
      analysis.features,
      wpData.site_info as Record<string, unknown> | undefined,
      undefined,
      wpData
    );

    return NextResponse.json({
      industry: analysis.industry,
      features: analysis.features,
      layout: analysis.layout,
      colors: analysis.colors,
      typography: analysis.typography,
      spacing: analysis.spacing,
      animations: analysis.animations,
      cssVariables: analysis.cssVariables,
      site: {
        name: analysis.site.settings.name,
        description: analysis.site.settings.description,
        postsCount: analysis.site.posts.length,
        pagesCount: analysis.site.pages.length,
        categoriesCount: analysis.site.categories.length,
        servicesCount: analysis.site.services.length,
        productsCount: analysis.site.products.length,
        testimonialsCount: analysis.site.testimonials.length,
        teamCount: analysis.site.team.length,
        faqsCount: analysis.site.faqs.length,
      },
      ai: {
        template: aiResult.template,
        layout: aiResult.layout,
        sections: aiResult.sections,
        brand: aiResult.brand,
        contentScores: aiResult.contentScores,
        homepage: aiResult.homepage,
        recommendations: aiResult.recommendations,
        adapters: aiResult.adapters,
        processingTime: aiResult.processingTime,
        modelVersion: aiResult.modelVersion,
      },
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI analysis failed' },
      { status: 500 }
    );
  }
}
