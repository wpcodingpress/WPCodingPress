import { notFound } from 'next/navigation';

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

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

interface SiteData {
  posts: Post[];
  categories: Category[];
  pages: Page[];
  site_info: {
    name: string;
    description: string;
  };
}

interface HeadlessSiteRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  userEmail?: string;
}

async function fetchWPData(wpSiteUrl: string, apiKey: string): Promise<SiteData | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const [exportRes, categoriesRes, pagesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers, next: { revalidate: 60 } }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers, next: { revalidate: 60 } }),
      fetch(`${baseUrl}/wp-json/eyepress/v1/posts?per_page=100`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!exportRes.ok) {
      console.error('WP API error:', exportRes.status);
      return null;
    }

    const exportData = await exportRes.json();
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
    const pagesData = pagesRes.ok ? await pagesRes.json() : [];

    return {
      posts: exportData.posts || [],
      categories: categoriesData,
      pages: pagesData.slice(0, 10) as Page[],
      site_info: exportData.site_info || {
        name: 'WordPress Site',
        description: '',
      },
    };
  } catch (error) {
    console.error('Failed to fetch WP data:', error);
    return null;
  }
}

export default async function HeadlessSiteRenderer({
  wpSiteUrl,
  apiKey,
  siteName,
}: HeadlessSiteRendererProps) {
  const data = await fetchWPData(wpSiteUrl, apiKey);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Site Temporarily Unavailable</h1>
          <p className="text-slate-400">
            Unable to connect to the WordPress site. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { posts, categories, site_info } = data;
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {site_info.name || siteName}
          </h1>
          {site_info.description && (
            <p className="text-xl text-indigo-100">{site_info.description}</p>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-4 overflow-x-auto">
            <a href={`/sites/${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`} className="hover:text-indigo-400 whitespace-nowrap">Home</a>
            {categories.slice(0, 6).map((cat) => (
              <a
                key={cat.id}
                href={`/sites/${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}/category/${cat.slug}`}
                className="hover:text-indigo-400 whitespace-nowrap"
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {featuredPost.featuredImage?.node?.sourceUrl && (
              <div className="aspect-video relative overflow-hidden rounded-xl">
                <img
                  src={featuredPost.featuredImage.node.sourceUrl}
                  alt={featuredPost.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div>
              <span className="text-indigo-600 font-semibold">Featured</span>
              <h2 className="text-3xl font-bold mt-2 mb-4 text-slate-900">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 mb-4 line-clamp-3">
                {featuredPost.excerpt || featuredPost.content.slice(0, 200)}...
              </p>
              <a
                href={`/sites/${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}/post/${featuredPost.slug}`}
                className="inline-flex items-center text-indigo-600 font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  {post.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {post.excerpt || post.content.slice(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <a
                        href={`/sites/${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}/post/${post.slug}`}
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/sites/${siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}/category/${cat.slug}`}
                className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
              >
                {cat.name} ({cat.count})
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Powered by WPCodingPress Headless</p>
          <p className="text-sm mt-2">
            WordPress Site: {wpSiteUrl}
          </p>
        </div>
      </footer>
    </div>
  );
}