import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; slug: string }> }
) {
  try {
    const { slug: siteSlug, slug: pageSlug } = await params;
    
    // Find site by slug
    const allSites = await prisma.site.findMany({
      where: { status: 'connected' },
    });

    const site = allSites.find(s => 
      domainToSlug(s.domain) === siteSlug.toLowerCase() || 
      s.domain.toLowerCase() === siteSlug.toLowerCase()
    );

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const wpSiteUrl = site.wpSiteUrl.replace(/\/$/, '');
    
    // Fetch page from WordPress
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