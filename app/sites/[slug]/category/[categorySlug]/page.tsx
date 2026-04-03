import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import NewsMagazineTemplate from '@/components/templates/NewsMagazine';
import BusinessTemplate from '@/components/templates/Business';
import ModernTemplate from '@/components/templates/Modern';

interface PageProps {
  params: Promise<{ slug: string; categorySlug: string }>;
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug, categorySlug } = await params;
  
  const site = await getSiteBySlug(slug);

  if (!site || !site.jobs[0]) {
    notFound();
  }

  const template = site.template || 'news';

  return (
    <CategoryPageRenderer
      wpSiteUrl={site.wpSiteUrl}
      apiKey={site.wpApiKey || ''}
      siteName={site.domain}
      categorySlug={categorySlug}
    />
  );
}

interface CategoryRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  categorySlug: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function CategoryPageRenderer({ wpSiteUrl, apiKey, siteName, categorySlug }: CategoryRendererProps) {
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = { 'X-API-Key': apiKey, 'Content-Type': 'application/json' };

    const response = await fetch(`${baseUrl}/wp-json/eyepress/v1/category/${categorySlug}`, { headers, next: { revalidate: 60 } });
    
    if (!response.ok) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Category Not Found</h1>
            <p className="text-slate-600">The category you're looking for doesn't exist or has no posts.</p>
          </div>
        </div>
      );
    }

    const data = await response.json();
    const { category, posts } = data;

    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-slate-900">{siteName}</h1>
          </div>
        </header>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold">{category?.name || 'Category'}</h1>
            {category?.description && <p className="mt-2 text-blue-100">{category.description}</p>}
            <p className="mt-2 text-blue-200">{posts?.length || 0} articles</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {!posts || posts.length === 0 ? (
            <p className="text-slate-500 text-center">No posts in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden border border-slate-100">
                  <div className="aspect-[16/10] overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-slate-900 line-clamp-2">{post.title}</h2>
                    <p className="text-slate-600 mt-2 text-sm line-clamp-3">{post.excerpt || post.content?.slice(0, 100)}...</p>
                    <p className="text-sm text-slate-500 mt-3">{formatDate(post.date)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="bg-slate-900 text-slate-400 py-8 text-center">
          <p>© {new Date().getFullYear()} {siteName}. Powered by WPCodingPress</p>
        </footer>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <h1 className="text-2xl">Error loading category</h1>
      </div>
    );
  }
}