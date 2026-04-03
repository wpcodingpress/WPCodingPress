import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
  author?: {
    node: { name: string; slug: string };
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

interface SiteData {
  posts: Post[];
  categories: Category[];
  site_info: {
    name: string;
    description: string;
  };
}

interface NewsMagazineTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

async function fetchWPData(wpSiteUrl: string, apiKey: string): Promise<SiteData | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const [exportRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers, next: { revalidate: 60 } }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!exportRes.ok) return null;

    const exportData = await exportRes.json();
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

    return {
      posts: exportData.posts || [],
      categories: categoriesData,
      site_info: exportData.site_info || { name: 'News Site', description: '' },
    };
  } catch {
    return null;
  }
}

export default async function NewsMagazineTemplate({ wpSiteUrl, apiKey, siteName }: NewsMagazineTemplateProps) {
  const data = await fetchWPData(wpSiteUrl, apiKey);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site Temporarily Unavailable</h1>
          <p className="text-slate-600">Unable to connect to the WordPress server.</p>
        </div>
      </div>
    );
  }

  const { posts, categories, site_info } = data;
  
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Posts Found</h1>
          <p className="text-slate-600">This site doesn't have any content yet.</p>
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const trendingPosts = posts.slice(1, 4);
  const remainingPosts = posts.slice(4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/sites/${siteSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">{site_info.name || siteName}</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/sites/${siteSlug}`} className="text-sm font-medium text-slate-700 hover:text-red-600 transition">Home</Link>
              {categories.slice(0, 5).map((cat) => (
                <Link key={cat.id} href={`/sites/${siteSlug}/category/${cat.slug}`} className="text-sm font-medium text-slate-600 hover:text-red-600 transition">
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded mr-4 uppercase">Breaking</span>
          <span className="text-sm truncate">{featuredPost?.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {featuredPost && (
              <article className="relative group cursor-pointer">
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  {featuredPost.featuredImage?.node?.sourceUrl ? (
                    <img src={featuredPost.featuredImage.node.sourceUrl} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {featuredPost.categories?.nodes?.[0] && (
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase">{featuredPost.categories.nodes[0].name}</span>
                  )}
                  <Link href={`/sites/${siteSlug}/post/${featuredPost.slug}`}>
                    <h1 className="text-2xl md:text-4xl font-bold text-white hover:text-red-400 transition line-clamp-2">{featuredPost.title}</h1>
                  </Link>
                  <div className="flex items-center mt-4 text-sm text-slate-400">
                    <span>{featuredPost.author?.node?.name || 'Editor'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </article>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Trending
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <article key={post.id} className="flex items-start space-x-4 group cursor-pointer">
                    <span className="text-3xl font-bold text-slate-200">{index + 1}</span>
                    <div>
                      <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                        <h4 className="font-semibold text-slate-900 group-hover:text-red-600 transition line-clamp-2">{post.title}</h4>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(post.date)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {remainingPosts.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {remainingPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                      <h3 className="font-bold text-slate-900 mt-2 line-clamp-2 group-hover:text-red-600 transition">{post.title}</h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-2">{formatDate(post.date)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} {site_info.name}. Powered by WPCodingPress</p>
        </div>
      </footer>
    </div>
  );
}