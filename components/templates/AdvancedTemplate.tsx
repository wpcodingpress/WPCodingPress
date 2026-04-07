"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../advanced/Header";
import Footer from "../advanced/Footer";
import HeroSection from "../advanced/HeroSection";
import VideoSlider from "../advanced/VideoSlider";
import SubscribeForm from "../advanced/SubscribeForm";
import PostCard from "../advanced/PostCard";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
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
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
};

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
};

type SiteOptions = {
  logo?: string;
  urgentNotice?: string;
  youtubeUrl?: string;
  videos?: VideoPost[];
  ads?: Record<string, { image: string; link: string }>;
};

interface AdvancedTemplateProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  siteSlug?: string;
}

export default function AdvancedTemplate({ wpSiteUrl, apiKey, siteName, siteSlug = '' }: AdvancedTemplateProps) {
  const [locale, setLocale] = useState<"bn" | "en">("bn");
  const [loading, setLoading] = useState(true);
  const [siteLogo, setSiteLogo] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroPosts, setHeroPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [tickerItems, setTickerItems] = useState<{ title: string; slug: string }[]>([]);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [siteOptions, setSiteOptions] = useState<SiteOptions>({});

  const API_URL = wpSiteUrl.replace(/\/$/, "");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en")) setLocale("en");
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
          pagesRes,
          menusRes,
        ] = await Promise.all([
          fetch(`${API_URL}/wp-json/eyepress/v1/site-options?locale=${locale}`),
          fetch(`${API_URL}/wp-json/eyepress/v1/categories?locale=${locale}`),
          fetch(`${API_URL}/wp-json/eyepress/v1/posts?locale=${locale}&per_page=10`),
          fetch(`${API_URL}/wp-json/eyepress/v1/trending?locale=${locale}&per_page=10`),
          fetch(`${API_URL}/wp-json/eyepress/v1/posts?locale=${locale}&per_page=30`),
          fetch(`${API_URL}/wp-json/eyepress/v1/ticker?locale=${locale}&count=10`),
          fetch(`${API_URL}/wp-json/eyepress/v1/pages`),
          fetch(`${API_URL}/wp-json/eyepress/v1/menus?locale=${locale}`),
        ]);

        if (optionsRes.ok) {
          const data = await optionsRes.json();
          setSiteLogo(data.logo || "");
          setSiteOptions(data);
          
          // Transform videos from API format to component format
          if (data.videos && Array.isArray(data.videos)) {
            const formattedVideos = data.videos.map((v: { videoId?: string; url?: string; thumbnail?: string; type?: string }) => ({
              type: v.type || 'youtube',
              videoId: v.videoId || '',
              url: v.url || '',
              title: 'Video', // Required field, use default
              thumbnail: v.thumbnail || '',
              watchUrl: v.url ? `https://www.youtube.com/watch?v=${v.videoId}` : '',
            }));
            setVideos(formattedVideos);
          }
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(Array.isArray(data) ? data : []);
        }
        if (postsRes.ok) {
          const data = await postsRes.json();
          setHeroPosts(Array.isArray(data) ? data : []);
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
        if (pagesRes.ok) {
          const data = await pagesRes.json();
          setPages(Array.isArray(data) ? data : []);
        }
        if (menusRes.ok) {
          const data = await menusRes.json();
          setMenuItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("API_URL:", API_URL);
        console.log("locale:", locale);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_URL, locale]);

  const featuredPost = heroPosts[0];
  const secondaryPosts = heroPosts.slice(1, 5);

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

  return (
    <div className="min-h-screen bg-gray-50">
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

      <Header
        siteName={siteName}
        siteLogo={siteLogo}
        menuItems={menuItems}
        apiBaseUrl={API_URL}
        siteSlug={siteSlug}
      />

      <main className="bg-gray-50 min-h-screen pt-24 sm:pt-28 lg:pt-32">
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

        {/* Hero Section */}
        <HeroSection
          featuredPost={featuredPost}
          secondaryPosts={secondaryPosts}
          trendingPosts={trendingPosts}
          locale={locale}
        />

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <VideoSlider videos={videos} locale={locale} />
          </section>
        )}

        {/* Latest News */}
        <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#A41E22]" />
            <h2 className="text-xl md:text-2xl font-bold text-[#6C1312]">
              {locale === "bn" ? "সর্বশেষ খবর" : "Latest News"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {latestPosts.slice(0, 16).map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="container mx-auto px-2 md:px-4 py-6 md:py-8">
          <SubscribeForm variant="hero" className="" apiBaseUrl={API_URL} />
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#A41E22]" />
              <h2 className="text-xl md:text-2xl font-bold text-[#6C1312]">
                {locale === "bn" ? "বিভাগসমূহ" : "Categories"}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/category/${cat.slug}`}
                  className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
                >
                  <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                  <span className="text-xs text-gray-500">{cat.count || 0} posts</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer
        siteName={siteName}
        siteLogo={siteLogo}
        menuItems={menuItems}
        categories={categories}
        locale={locale}
        siteSlug={siteSlug}
      />
    </div>
  );
}
