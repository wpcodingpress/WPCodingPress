// components/advanced/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";

type MenuItem = {
  label: string;
  url: string;
};

type FooterProps = {
  siteName?: string;
  siteLogo?: string;
  menuItems?: MenuItem[];
  categories?: { id: string; name: string; slug: string }[];
  locale?: string;
  siteSlug?: string;
};

export default function Footer({
  siteName,
  siteLogo,
  menuItems = [],
  categories = [],
  locale = "bn",
  siteSlug = "",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white py-8">
      <div className="container mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
              {locale === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
            </h3>
            <p className="text-sm text-gray-400">
              {siteName} - {locale === "bn" ? "স্বাধীন ডিজিটাল সংবাদ প্ল্যাটফর্ম" : "Independent Digital News Platform"}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
              {locale === "bn" ? "দ্রুত লিংক" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/sites/${siteSlug}`} className="hover:text-white">Home</Link></li>
              <li><Link href={`/sites/${siteSlug}/login`} className="hover:text-white">Login</Link></li>
              <li><Link href={`/sites/${siteSlug}/contact`} className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-[#A41E22] pb-2">
              {locale === "bn" ? "বিভাগসমূহ" : "Categories"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/sites/${siteSlug}/category/${cat.slug}`} className="hover:text-white">
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
          © {currentYear} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
