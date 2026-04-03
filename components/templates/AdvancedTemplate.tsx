"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  categories?: { nodes: Array<{ name: string; slug: string }> };
  author?: { node: { name: string; slug: string } };
};

type Category = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};

type MenuItem = {
  label: string;
  url: string;
  ID?: number;
};

type SiteOptions = {
  name?: string;
  description?: string;
  logo?: string;
  siteIcon?: string;
};

type VideoPost = {
  type: string;
  videoId?: string;
  url?: string;
  title: string;
  thumbnail?: string;
  embedUrl?: string;
  watchUrl?: string;
  slug?: string;
  featuredImage?: { node: { sourceUrl: string } };
};

interface AdvancedTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

const AdvancedTemplate: React.FC<AdvancedTemplateProps> = ({
  wpSiteUrl,
  apiKey,
  siteName,
}) => {
  const [locale, setLocale] = useState<"bn" | "en">("bn");
  const [loading, setLoading] = useState(true);
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroPosts, setHeroPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [tickerItems, setTickerItems] = useState<{ title: string; slug: string }[]>([]);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const sectionsRef = useRef<HTMLDivElement>(null);

  const API_URL = wpSiteUrl.replace(/\/$/, "") + "/wp-json/eyepress/v1";

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en")) {
      setLocale("en");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          optionsRes,
          categoriesRes,
          postsRes,
          trendingRes,
          latestRes,
          tickerRes,
          videosRes,
          menusRes,
        ] = await Promise.all([
          fetch(`${API_URL}/site-options?locale=${locale}`),
          fetch(`${API_URL}/categories?locale=${locale}`),
          fetch(`${API_URL}/posts?locale=${locale}&per_page=10`),
          fetch(`${API_URL}/trending?locale=${locale}&per_page=10`),
          fetch(`${API_URL}/posts?locale=${locale}&per_page=30`),
          fetch(`${API_URL}/ticker?locale=${locale}&count=10`),
          fetch(`${API_URL}/videos?locale=${locale}`),
          fetch(`${API_URL}/menus?locale=${locale}`),
        ]);

        if (optionsRes.ok) {
          const data = await optionsRes.json();
          setSiteOptions(data);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(Array.isArray(data) ? data : []);
        }
        if (postsRes.ok) {
          const data = await postsRes.json();
          setHeroPosts(Array.isArray(data) ? data.slice(0, 5) : []);
        }
        if (trendingRes.ok) {
          const data = await trendingRes.json();
          setTrendingPosts(Array.isArray(data) ? data : []);
        }
        if (latestRes.ok) {
          const data = await latestRes.json();
          setLatestPosts(Array.isArray(data) ? data : []);
        }
        if (tickerRes.ok) {
          const data = await tickerRes.json();
          setTickerItems(Array.isArray(data) ? data : []);
        }
        if (videosRes.ok) {
          const data = await videosRes.json();
          setVideos(Array.isArray(data) ? data : []);
        }
        if (menusRes.ok) {
          const data = await menusRes.json();
          setMenuItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_URL, locale]);

  useEffect(() => {
    const checkSubscription = async () => {
      const userData = localStorage.getItem("wp_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.email) {
            const res = await fetch(`${API_URL}/subscription-status`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            if (data.subscribed) {
              setIsUserSubscribed(true);
            }
          }
        } catch (e) {
          console.log("Error checking subscription:", e);
        }
      }
    };
    checkSubscription();
  }, [API_URL]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (locale === "bn") {
      const bnNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      const day = date.getDate().toString().split("").map((n) => bnNums[parseInt(n)] || n).join("");
      const month = date.toLocaleString("bn-BD", { month: "short" });
      return `${day} ${month}`;
    }
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const getDiversePosts = (posts: Post[], count: number): Post[] => {
    const seenCategories = new Set<string>();
    const diversePosts: Post[] = [];
    for (const post of posts) {
      if (diversePosts.length >= count) break;
      const catName = post.categories?.nodes?.[0]?.name || "";
      if (!seenCategories.has(catName)) {
        seenCategories.add(catName);
        diversePosts.push(post);
      }
    }
    if (diversePosts.length < count) {
      for (const post of posts) {
        if (diversePosts.length >= count) break;
        if (!diversePosts.find((p) => p.id === post.id)) {
          diversePosts.push(post);
        }
      }
    }
    return diversePosts;
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A41E22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">{locale === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </main>
    );
  }

  const diverseHeroPosts = getDiversePosts(heroPosts, 5);
  const featuredPost = diverseHeroPosts[0];
  const secondaryPosts = diverseHeroPosts.slice(1, 5);

  const heroSidebarTrending = trendingPosts.slice(0, 6);

  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-animate {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-animate:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50"
      >
        <div className="mx-auto flex items-center justify-between px-2 md:px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6 text-[#A41E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <Link href="/">
              {siteOptions?.logo ? (
                <img
                  src={siteOptions.logo}
                  alt={siteOptions.name || siteName}
                  className={`h-10 md:h-12 object-contain transition-all ${isScrolled ? "scale-90" : ""}`}
                />
              ) : (
                <span className="text-xl md:text-2xl font-bold text-[#A41E22]">{siteName}</span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-[#A41E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {!isUserSubscribed && (
              <Link
                href={`/${locale}/subscribe`}
                className="px-3 py-1.5 bg-[#A41E22] text-white rounded-full text-sm font-semibold hover:bg-[#8a1a1d]"
              >
                {locale === "bn" ? "সাবস্ক্রাইব" : "Subscribe"}
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden xl:block border-t border-gray-100">
          <nav className="flex items-center justify-center gap-1 px-2 py-2">
            {menuItems.slice(0, 8).map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="px-3 py-1.5 text-sm font-bold text-gray-800 hover:text-[#A41E22] hover:bg-gray-50 rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white fixed top-auto left-0 right-0 z-50 shadow-lg max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col py-2 px-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="px-3 py-2.5 font-bold text-sm text-gray-800 hover:text-[#A41E22] border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Ticker */}
        {tickerItems.length > 0 && (
          <div className="xl:hidden px-2 py-2 bg-[#A41E22]">
            <div className="flex items-center overflow-hidden">
              <span className="font-extrabold uppercase text-xs flex-shrink-0 whitespace-nowrap px-3 py-1 bg-[#A41E22] text-white">
                {locale === "bn" ? "সর্বশেষ:" : "LATEST:"}
              </span>
              <div className="flex overflow-hidden whitespace-nowrap">
                <div className="ticker-animate flex">
                  {[...tickerItems, ...tickerItems].map((item, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/${item.slug}`}
                      className="text-white hover:text-cyan-200 text-xs mx-4"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main ref={sectionsRef} className="bg-gray-50 min-h-screen pt-24 sm:pt-28 lg:pt-32">
        {/* Hero Section */}
        <section className="bg-white py-4 md:py-6">
          <div className="container mx-auto px-2 md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
              {/* Main Featured */}
              <div className="lg:col-span-3">
                {featuredPost && (
                  <Link href={`/${locale}/${featuredPost.slug}`} className="group block">
                    <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-lg">
                      {featuredPost.featuredImage?.node?.sourceUrl ? (
                        <img
                          src={featuredPost.featuredImage.node.sourceUrl}
                          alt={featuredPost.featuredImage.node.altText || featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      {featuredPost.categories?.nodes?.[0] && (
                        <div className="absolute top-2 md:top-3 left-2 md:left-3">
                          <span className="px-2 md:px-3 py-1 bg-[#A41E22] text-white text-xs font-bold uppercase rounded">
                            {featuredPost.categories.nodes[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mt-2 md:mt-3 group-hover:text-[#A41E22] transition-colors line-clamp-2">
                      {featuredPost.title}
                    </h2>
                  </Link>
                )}
              </div>

              {/* Secondary Posts */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${locale}/${post.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg"
                  >
                    <div className="relative h-32 md:h-36 overflow-hidden rounded-t-lg">
                      {post.featuredImage?.node?.sourceUrl ? (
                        <img
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      {post.categories?.nodes?.[0] && (
                        <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2">
                          <span className="px-2 py-0.5 bg-[#A41E22] text-white text-xs font-bold uppercase rounded">
                            {post.categories.nodes[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 md:p-3">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#A41E22] line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Trending Sidebar */}
              <div className="lg:col-span-3 bg-gray-50 rounded-lg p-3 md:p-4">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="w-1 h-5 md:h-6 bg-[#A41E22]" />
                  <h3 className="text-base md:text-lg font-bold text-[#6C1312] uppercase">
                    {locale === "bn" ? "আলোচিত" : "Trending"}
                  </h3>
                </div>
                <div className="space-y-3">
                  {heroSidebarTrending.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/${locale}/${post.slug}`}
                      className="group flex gap-2 md:gap-3 items-start"
                    >
                      <span className="text-lg md:text-xl font-bold text-[#A41E22] opacity-50 min-w-[16px]">
                        {index + 1}
                      </span>
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                        {post.featuredImage?.node?.sourceUrl ? (
                          <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 group-hover:text-[#A41E22] line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-xs text-gray-700">{formatDate(post.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker - Desktop */}
        {tickerItems.length > 0 && (
          <div className="hidden xl:block bg-[#A41E22] py-2">
            <div className="container mx-auto px-4">
              <div className="flex items-center overflow-hidden">
                <span className="font-extrabold uppercase text-sm flex-shrink-0 whitespace-nowrap px-4 py-1 bg-[#A41E22] text-white mr-4">
                  {locale === "bn" ? "সর্বশেষ:" : "LATEST:"}
                </span>
                <div className="flex overflow-hidden whitespace-nowrap flex-1">
                  <div className="ticker-animate flex">
                    {[...tickerItems, ...tickerItems].map((item, index) => (
                      <Link
                        key={index}
                        href={`/${locale}/${item.slug}`}
                        className="text-white hover:text-cyan-200 text-sm mx-4"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-1 h-6 md:h-8 bg-[#A41E22]" />
              <h2 className="text-xl md:text-2xl font-bold text-[#6C1312]">
                {locale === "bn" ? "ভিডিও" : "Videos"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.slice(0, 4).map((video) => (
                <Link
                  key={video.slug || video.videoId}
                  href={video.slug ? `/${locale}/${video.slug}` : "#"}
                  className="group block"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                    {video.featuredImage?.node?.sourceUrl ? (
                      <img
                        src={video.featuredImage.node.sourceUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#A41E22] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mt-2 group-hover:text-[#A41E22] line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest News */}
        <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-1 h-6 md:h-8 bg-[#A41E22]" />
            <h2 className="text-xl md:text-2xl font-bold text-[#6C1312]">
              {locale === "bn" ? "সর্বশেষ খবর" : "Latest News"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {latestPosts.slice(0, 16).map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/${post.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="p-3 md:p-4">
                  {post.categories?.nodes?.[0] && (
                    <span className="inline-block px-2 py-0.5 bg-[#A41E22] text-white text-xs font-bold rounded mb-2">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                  <h3 className="text-sm md:text-base font-bold text-gray-800 group-hover:text-[#A41E22] line-clamp-2">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-700 mt-2 block">
                    {formatDate(post.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="container mx-auto px-2 md:px-4 py-6 md:py-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#A41E22] via-[#8a1a1d] to-[#6C1312] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {locale === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe"}
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              {locale === "bn"
                ? "সর্বশেষ খবর পেতে আমাদের সাথে যুক্ত থাকুন"
                : "Stay connected to get the latest news"}
            </p>
            <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={locale === "bn" ? "আপনার ইমেইল" : "Enter your email"}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#A41E22] rounded-lg font-bold hover:bg-gray-100"
              >
                {locale === "bn" ? "সাবস্ক্রাইব" : "Subscribe"}
              </button>
            </form>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
                >
                  <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                  <span className="text-xs text-gray-500">{cat.count} posts</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-8">
        <div className="container mx-auto px-2 md:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
                {locale === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
              </h3>
              <p className="text-sm text-gray-400">
                {siteOptions?.description || siteName}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
                {locale === "bn" ? "দ্রুত লিংক" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}`} className="hover:text-white">Home</Link></li>
                <li><Link href={`/${locale}/about`} className="hover:text-white">About</Link></li>
                <li><Link href={`/${locale}/contact`} className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
                {locale === "bn" ? "বিভাগসমূহ" : "Categories"}
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/${locale}/category/${cat.slug}`} className="hover:text-white">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
                {locale === "bn" ? "অনুসরণ করুন" : "Follow Us"}
              </h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-[#A41E22] flex items-center justify-center hover:bg-white hover:text-[#A41E22]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#A41E22] flex items-center justify-center hover:bg-white hover:text-[#A41E22]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-2"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="p-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "bn" ? "এখানে খুঁজুন..." : "Search here..."}
                className="w-full px-4 py-3 text-lg rounded-lg outline-none text-gray-900 border-2 border-[#A41E22]"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedTemplate;
