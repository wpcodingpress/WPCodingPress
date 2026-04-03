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
    node: { name: string };
  };
}

interface CategoryData {
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
  posts: Post[];
}

interface HeadlessCategoryRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  categorySlug: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

async function fetchCategoryPosts(wpSiteUrl: string, apiKey: string, categorySlug: string): Promise<CategoryData | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${baseUrl}/wp-json/eyepress/v1/category/${categorySlug}`,
      { headers, next: { revalidate: 60 } }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function HeadlessCategoryRenderer({
  wpSiteUrl,
  apiKey,
  siteName,
  categorySlug,
}: HeadlessCategoryRendererProps) {
  const data = await fetchCategoryPosts(wpSiteUrl, apiKey, categorySlug);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Category Not Found</h1>
          <p className="text-slate-600">The category you're looking for doesn't exist or has no posts.</p>
          <Link href={`/sites/${siteSlug}`} className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { category, posts } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/sites/${siteSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">{siteName}</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/sites/${siteSlug}`} className="text-sm font-medium text-slate-700 hover:text-red-600 transition">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href={`/sites/${siteSlug}`} className="text-red-200 hover:text-white transition">Home</Link>
            <span className="text-red-300">/</span>
            <span className="text-white">{category.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-red-100 max-w-2xl">{category.description}</p>
          )}
          <p className="mt-4 text-red-200">{posts.length} articles</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No posts in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden group border border-slate-100">
                <div className="aspect-[16/10] overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-slate-500 mb-3">
                    <span className="text-red-600 font-semibold">{category.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-slate-600 mt-3 line-clamp-3 text-sm">
                    {post.excerpt || post.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                    {post.author?.node?.name && (
                      <div className="flex items-center text-sm text-slate-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {post.author.node.name}
                      </div>
                    )}
                    <Link
                      href={`/sites/${siteSlug}/post/${post.slug}`}
                      className="ml-auto text-red-600 font-semibold text-sm hover:text-red-700"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} {siteName}. Powered by <span className="text-red-500">WPCodingPress</span></p>
        </div>
      </footer>
    </div>
  );
}