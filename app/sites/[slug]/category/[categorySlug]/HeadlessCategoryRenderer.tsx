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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Category not found</h1>
        </div>
      </div>
    );
  }

  const { category, posts } = data;
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <a href={`/sites/${siteSlug}`} className="text-indigo-200 hover:text-white mb-4 inline-block">← Back to Home</a>
          <h1 className="text-4xl font-bold">{category.name}</h1>
          {category.description && <p className="mt-2 text-indigo-100">{category.description}</p>}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-slate-600">No posts in this category.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-slate-200">
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="aspect-video relative overflow-hidden">
                    <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="object-cover w-full h-full" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{post.excerpt || post.content.slice(0, 100)}...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
                    <a href={`/sites/${siteSlug}/post/${post.slug}`} className="text-indigo-600 font-medium hover:underline">Read More</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}