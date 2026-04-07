// components/advanced/PostCard.tsx
"use client";

import React from "react";
import Link from "next/link";

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

type PostCardProps = {
  post: Post;
  variant?: "large" | "medium" | "small" | "list";
  showCategory?: boolean;
  locale?: string;
  className?: string;
};

export default function PostCard({
  post,
  variant = "medium",
  showCategory = true,
  locale = "bn",
  className = "",
}: PostCardProps) {
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

  const category = post.categories?.nodes?.[0];
  const imageUrl = post.featuredImage?.node?.sourceUrl;

  if (variant === "list") {
    return (
      <Link
        href={`/${locale}/${post.slug}`}
        className={`group flex gap-3 p-2 bg-white hover:bg-gray-50 ${className}`}
      >
        {imageUrl && (
          <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
            <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col justify-center flex-1">
          {showCategory && category && (
            <span className="text-xs font-bold text-[#A41E22]">{category.name}</span>
          )}
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#A41E22] line-clamp-2">
            {post.title}
          </h3>
          <span className="text-xs text-gray-700 mt-1">{formatDate(post.date)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/${post.slug}`}
      className={`group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg ${className}`}
    >
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.featuredImage?.node?.altText || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        {showCategory && category && (
          <div className="absolute top-1.5 left-1.5">
            <span className="px-2 py-0.5 bg-[#A41E22] text-white text-xs font-bold rounded">
              {category.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm md:text-base font-bold text-gray-800 group-hover:text-[#A41E22] line-clamp-2">
          {post.title}
        </h3>
        <span className="text-xs text-gray-700 mt-2 block">{formatDate(post.date)}</span>
      </div>
    </Link>
  );
}
