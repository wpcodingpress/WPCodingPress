import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage?: { node: { sourceUrl: string; altText: string; }; };
  categories?: { nodes: Array<{ name: string; slug: string }>; };
  author?: { node: { name: string; }; };
}

interface Category { id: number; name: string; slug: string; count: number; }

interface SiteData {
  posts: Post[];
  categories: Category[];
  site_info: { name: string; description: string; };
}

interface ModernTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
    return { posts: exportData.posts || [], categories: categoriesData, site_info: exportData.site_info || { name: 'Modern Blog', description: '' } };
  } catch { return null; }
}

export default async function ModernTemplate({ wpSiteUrl, apiKey, siteName }: ModernTemplateProps) {
  const data = await fetchWPData(wpSiteUrl, apiKey);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-light text-stone-800">Site unavailable</h1>
        </div>
      </div>
    );
  }

  const { posts, categories, site_info } = data;
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href={`/sites/${siteSlug}`}>
            <span className="text-lg font-semibold tracking-tight text-stone-900">{site_info.name || siteName}</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href={`/sites/${siteSlug}`} className="text-sm text-stone-500 hover:text-stone-900 transition">Home</Link>
            {categories.slice(0, 3).map((cat) => (
              <Link key={cat.id} href={`/sites/${siteSlug}/category/${cat.slug}`} className="text-sm text-stone-500 hover:text-stone-900 transition">{cat.name}</Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <Link href={`/sites/${siteSlug}/post/${featuredPost.slug}`} className="group block">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-6">
              {featuredPost.featuredImage?.node?.sourceUrl ? (
                <img src={featuredPost.featuredImage.node.sourceUrl} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {featuredPost.categories?.nodes?.[0] && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full mb-3">{featuredPost.categories.nodes[0].name}</span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{featuredPost.title}</h2>
                <p className="text-stone-200 line-clamp-2 max-w-2xl">{featuredPost.excerpt || featuredPost.content.slice(0, 150)}</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Posts */}
      {otherPosts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-8">Recent Stories</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                  <div className="aspect-[3/2] rounded-xl overflow-hidden mb-4">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                  </div>
                </Link>
                <div>
                  {post.categories?.nodes?.[0] && (
                    <span className="text-xs font-medium text-stone-400">{post.categories.nodes[0].name}</span>
                  )}
                  <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                    <h4 className="text-lg font-semibold text-stone-800 mt-1 mb-2 group-hover:text-stone-600 transition line-clamp-2">{post.title}</h4>
                  </Link>
                  <p className="text-sm text-stone-500">{formatDate(post.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-stone-100 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-stone-400">© {new Date().getFullYear()} {site_info.name}</p>
        </div>
      </footer>
    </div>
  );
}