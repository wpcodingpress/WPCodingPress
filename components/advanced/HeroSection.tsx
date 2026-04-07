// components/advanced/HeroSection.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  categories?: { nodes: Array<{ name: string; slug: string }> };
};

type HeroSectionProps = {
  featuredPost?: Post;
  secondaryPosts?: Post[];
  trendingPosts?: Post[];
  locale?: string;
  className?: string;
};

export default function HeroSection({
  featuredPost,
  secondaryPosts = [],
  trendingPosts = [],
  locale = "bn",
  className = "",
}: HeroSectionProps) {
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

  return (
    <section className={`bg-white py-4 md:py-6 ${className}`}>
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
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-[#A41E22] text-white text-xs font-bold uppercase rounded">
                        {featuredPost.categories.nodes[0].name}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mt-2 group-hover:text-[#A41E22] line-clamp-2">
                  {featuredPost.title}
                </h2>
              </Link>
            )}
          </div>

          {/* Secondary Posts */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {secondaryPosts.slice(0, 4).map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/${post.slug}`}
                className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg"
              >
                <div className="relative h-32 md:h-36 overflow-hidden rounded-t-lg">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
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
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#A41E22]" />
              <h3 className="text-base md:text-lg font-bold text-[#6C1312] uppercase">
                {locale === "bn" ? "আলোচিত" : "Trending"}
              </h3>
            </div>
            <div className="space-y-3">
              {trendingPosts.slice(0, 6).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/${locale}/${post.slug}`}
                  className="group flex gap-2 items-start"
                >
                  <span className="text-lg font-bold text-[#A41E22] opacity-50 min-w-[16px]">
                    {index + 1}
                  </span>
                  <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                    {post.featuredImage?.node?.sourceUrl && (
                      <img src={post.featuredImage.node.sourceUrl} alt={post.title} className="w-full h-full object-cover" />
                    )}
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
  );
}
