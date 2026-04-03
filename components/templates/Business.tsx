import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: { sourceUrl: string; altText: string; };
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
  count: number;
}

interface SiteData {
  posts: Post[];
  categories: Category[];
  site_info: { name: string; description: string; };
}

interface BusinessTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function fetchWPData(wpSiteUrl: string, apiKey: string): Promise<SiteData | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = { 'X-API-Key': apiKey, 'Content-Type': 'application/json' };

    const [exportRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers, next: { revalidate: 60 } }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!exportRes.ok) return null;
    const exportData = await exportRes.json();
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

    return { posts: exportData.posts || [], categories: categoriesData, site_info: exportData.site_info || { name: 'Business Site', description: '' } };
  } catch { return null; }
}

export default async function BusinessTemplate({ wpSiteUrl, apiKey, siteName }: BusinessTemplateProps) {
  const data = await fetchWPData(wpSiteUrl, apiKey);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site Temporarily Unavailable</h1>
          <p className="text-slate-600">Unable to connect to the WordPress server.</p>
        </div>
      </div>
    );
  }

  const { posts, categories, site_info } = data;
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/sites/${siteSlug}`}>
            <h1 className="text-xl font-bold text-slate-800">{site_info.name || siteName}</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/sites/${siteSlug}`} className="text-slate-600 hover:text-blue-600 font-medium">Home</Link>
            {categories.slice(0, 4).map((cat) => (
              <Link key={cat.id} href={`/sites/${siteSlug}/category/${cat.slug}`} className="text-slate-500 hover:text-blue-600">{cat.name}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{site_info.name}</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">{site_info.description || 'Professional business insights and updates'}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-12">
            <Link href={`/sites/${siteSlug}/post/${featuredPost.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  {featuredPost.featuredImage?.node?.sourceUrl ? (
                    <img src={featuredPost.featuredImage.node.sourceUrl} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
                  )}
                </div>
                <div>
                  {featuredPost.categories?.nodes?.[0] && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">{featuredPost.categories.nodes[0].name}</span>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition">{featuredPost.title}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{featuredPost.excerpt || featuredPost.content.slice(0, 200)}...</p>
                  <div className="flex items-center text-sm text-slate-500">
                    <span>{featuredPost.author?.node?.name || 'Team'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Articles Grid */}
        {otherPosts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">More Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <article key={post.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition group">
                  <div className="aspect-[16/9] overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                  </div>
                  <div className="p-5">
                    {post.categories?.nodes?.[0] && (
                      <span className="text-xs text-blue-600 font-medium">{post.categories.nodes[0].name}</span>
                    )}
                    <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                      <h4 className="font-semibold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition">{post.title}</h4>
                    </Link>
                    <p className="text-sm text-slate-500">{formatDate(post.date)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {site_info.name}. All rights reserved.</p>
          <p className="text-sm mt-2 text-slate-500">Powered by WPCodingPress</p>
        </div>
      </footer>
    </div>
  );
}