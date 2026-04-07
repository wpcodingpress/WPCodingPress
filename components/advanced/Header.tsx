// components/advanced/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

type MenuItem = {
  label: string;
  url: string;
};

type HeaderProps = {
  siteName: string;
  siteLogo?: string;
  menuItems?: MenuItem[];
  apiBaseUrl?: string;
  siteSlug?: string;
};

export default function Header({
  siteName,
  siteLogo,
  menuItems = [],
  apiBaseUrl = "",
  siteSlug = "",
}: HeaderProps) {
  const [locale, setLocale] = useState("bn");
  const [tickerItems, setTickerItems] = useState<{ title: string; slug: string }[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en")) setLocale("en");
  }, []);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/wp-json/eyepress/v1/ticker?locale=${locale}&count=10`);
        if (res.ok) {
          const data = await res.json();
          setTickerItems(data);
        }
      } catch (e) {
        console.error("Ticker error:", e);
      }
    };
    if (apiBaseUrl) fetchTicker();
  }, [locale, apiBaseUrl]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${locale}/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

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
        .menu-item:hover { color: #A41E22; }
      `}</style>

      <header className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
        <div className="mx-auto flex items-center justify-between px-2 md:px-4 py-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6 text-[#A41E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 flex justify-center">
            <Link href="/">
              {siteLogo ? (
                <img
                  src={siteLogo}
                  alt={siteName}
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
            <Link
              href={`/sites/${siteSlug}/subscribe`}
              className="px-3 py-1.5 bg-[#A41E22] text-white rounded-full text-sm font-semibold hover:bg-[#8a1a1d]"
            >
              {locale === "bn" ? "সাবস্ক্রাইব" : "Subscribe"}
            </Link>
            <Link
              href={`/sites/${siteSlug}/login`}
              className="px-3 py-1.5 text-[#A41E22] border border-[#A41E22] rounded-full text-sm font-semibold hover:bg-[#A41E22] hover:text-white"
            >
              {locale === "bn" ? "লগইন" : "Login"}
            </Link>
          </div>
        </div>

        <div className="hidden xl:block border-t border-gray-100">
          <nav className="flex items-center justify-center gap-1 px-2 py-2">
            {menuItems.slice(0, 8).map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="px-3 py-1.5 text-sm font-bold text-gray-800 hover:text-[#A41E22] hover:bg-gray-50 rounded-md menu-item"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

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
}
