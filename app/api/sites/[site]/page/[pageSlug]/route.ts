import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ site: string; pageSlug: string }> }
) {
  try {
    const { site, pageSlug } = await params;
    
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

    const wpSiteUrl = wpSite.wpSiteUrl.replace(/\/$/, '');
    const response = await fetch(`${wpSiteUrl}/wp-json/eyepress/v1/page/${pageSlug}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const page = await response.json();
    return NextResponse.json(page);
  } catch (error) {
    console.error('Page fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}