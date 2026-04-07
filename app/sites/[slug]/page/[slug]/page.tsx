"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
};

export default function PageRoute() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [locale, setLocale] = useState<"bn" | "en">("bn");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/en")) setLocale("en");
  }, []);

  useEffect(() => {
    async function fetchPage() {
      if (!slug) return;
      
      setLoading(true);
      setError("");
      
      try {
        // Get the site URL from the URL path
        const pathParts = window.location.pathname.split('/');
        const sitesIndex = pathParts.indexOf('sites');
        const siteSlug = sitesIndex >= 0 ? pathParts[sitesIndex + 1] : '';
        
        if (!siteSlug) {
          setError("Site not found");
          setLoading(false);
          return;
        }

        // Fetch page from WordPress
        const response = await fetch(`/api/sites/${siteSlug}/page/${slug}`);
        
        if (!response.ok) {
          setError("Page not found");
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setPage(data);
      } catch (err) {
        setError("Failed to load page");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A41E22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">{locale === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#A41E22] mb-4">404</h1>
          <p className="text-gray-600">{locale === "bn" ? "পেজ পাওয়া যায়নি" : "Page not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {page.title}
          </h1>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>
    </div>
  );
}