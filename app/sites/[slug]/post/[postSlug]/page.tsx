import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

interface PageProps {
  params: Promise<{ slug: string; postSlug: string }>;
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

export default async function PostPage({ params }: PageProps) {
  const { slug, postSlug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  return (
    <PostPageRenderer
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
      postSlug={postSlug}
    />
  );
}

interface PostRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  postSlug: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

async function PostPageRenderer({ wpSiteUrl, apiKey, siteName, postSlug }: PostRendererProps) {
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = { 'X-API-Key': apiKey, 'Content-Type': 'application/json' };

    const response = await fetch(`${baseUrl}/wp-json/eyepress/v1/post/${postSlug}`, { headers, next: { revalidate: 60 } });
    
    if (!response.ok) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Article Not Found</h1>
            <p className="text-slate-600">The article you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      );
    }

    const post = await response.json();

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-slate-900">{siteName}</h1>
          </div>
        </header>

        <article className="max-w-4xl mx-auto px-4 py-12">
          {post.categories?.nodes?.[0] && (
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              {post.categories.nodes[0].name}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-slate-500 pb-8 border-b border-slate-200 mb-8">
            {post.author?.node?.name && <span>By {post.author.node.name}</span>}
            <span>{formatDate(post.date)}</span>
          </div>

          {post.featuredImage?.node?.sourceUrl && (
            <figure className="mb-10">
              <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full rounded-xl" />
            </figure>
          )}

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <footer className="bg-slate-900 text-slate-400 py-8 text-center">
          <p>© {new Date().getFullYear()} {siteName}. Powered by WPCodingPress</p>
        </footer>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <h1 className="text-2xl">Error loading article</h1>
      </div>
    );
  }
}