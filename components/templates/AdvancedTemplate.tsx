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

interface AdvancedTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateBengali(dateString: string) {
  return new Date(dateString).toLocaleDateString('bn-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdvancedTemplate({ wpSiteUrl, apiKey, siteName }: AdvancedTemplateProps) {
  const apiBase = `${wpSiteUrl}/wp-json/eyepress/v1`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#A41E22] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{siteName}</h1>
            <nav className="hidden md:flex gap-6">
              <Link href={`/${apiBase}/posts`} className="hover:text-gray-200">Home</Link>
              <Link href={`/${apiBase}/categories`} className="hover:text-gray-200">Categories</Link>
              <Link href={`/${apiBase}/contact`} className="hover:text-gray-200">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Hero */}
            <div className="md:col-span-2">
              <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
                <span className="text-gray-500">Featured Post Image</span>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 bg-[#A41E22] text-white text-xs font-bold rounded">
                  FEATURED
                </span>
                <h2 className="text-xl md:text-2xl font-bold mt-2 text-gray-800">
                  Welcome to Your Advanced News Site
                </h2>
                <p className="text-gray-600 mt-2">
                  This is the Advanced template powered by WPCodingPress. 
                  It includes all the features from the original EyePress template.
                </p>
                <p className="text-sm text-gray-500 mt-2">{formatDate(new Date().toISOString())}</p>
              </div>
            </div>

            {/* Sidebar - Trending */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4 text-[#A41E22] border-b pb-2">
                Trending Posts
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Link key={i} href={`#`} className="flex gap-3 group">
                    <div className="w-16 h-12 bg-gray-300 rounded flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#A41E22] line-clamp-2">
                        Trending Article Title {i}
                      </h4>
                      <span className="text-xs text-gray-500">{formatDate(new Date().toISOString())}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-[#A41E22] text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            <span className="font-bold animate-marquee">Breaking News:</span>
            <span className="whitespace-nowrap">Latest updates from your site...</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#A41E22]" />
              <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Link key={i} href={`#`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-[#A41E22] text-white text-xs font-bold rounded mb-2">
                      Category
                    </span>
                    <h3 className="font-bold text-gray-800 group-hover:text-[#A41E22] line-clamp-2">
                      Sample Article Title {i}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      This is a sample excerpt for the article. It shows a brief description of the content.
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <span>By Author</span>
                      <span>•</span>
                      <span>{formatDate(new Date().toISOString())}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4 text-[#A41E22]">Categories</h3>
              <div className="space-y-2">
                {['Politics', 'Sports', 'Technology', 'Entertainment', 'Business'].map((cat) => (
                  <Link 
                    key={cat} 
                    href={`#`}
                    className="flex justify-between items-center py-2 border-b border-gray-100 hover:text-[#A41E22]"
                  >
                    <span>{cat}</span>
                    <span className="text-sm text-gray-500">{Math.floor(Math.random() * 50)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-4 text-[#A41E22]">Subscribe</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest news delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A41E22]"
                />
                <button 
                  type="submit"
                  className="w-full bg-[#A41E22] text-white py-2 rounded-lg font-semibold hover:bg-[#8a1a1d]"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Ads Placeholder */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <span className="text-gray-400 text-sm">Advertisement</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">About</h4>
              <p className="text-gray-400 text-sm">
                Powered by WPCodingPress - Convert your WordPress site to a modern Next.js headless website.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white">Home</Link></li>
                <li><Link href="#" className="hover:text-white">Categories</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Email: info@example.com<br />
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {siteName}. All rights reserved. Powered by WPCodingPress
          </div>
        </div>
      </footer>
    </div>
  );
}
