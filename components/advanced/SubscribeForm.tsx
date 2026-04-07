// components/advanced/SubscribeForm.tsx
"use client";

import React, { useState, useEffect } from "react";

type SubscribeFormProps = {
  variant?: "inline" | "popup" | "page" | "hero";
  className?: string;
  apiBaseUrl?: string;
};

export default function SubscribeForm({
  variant = "inline",
  className = "",
  apiBaseUrl = "",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);
  const locale = "bn";

  useEffect(() => {
    const checkSubscription = async () => {
      const userData = localStorage.getItem("wp_user") || localStorage.getItem("eyepress_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user?.email && apiBaseUrl) {
            const res = await fetch(`${apiBaseUrl}/wp-json/eyepress/v1/subscription-status`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            if (data.subscribed) {
              setIsSubscribed(true);
            }
          }
        } catch (e) {
          console.log("Error checking subscription:", e);
        }
      }
      setIsLoadingCheck(false);
    };
    checkSubscription();
  }, [apiBaseUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage(locale === "bn" ? "সঠিক ইমেইল ঠিকানা লিখুন" : "Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${apiBaseUrl}/wp-json/eyepress/v1/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setIsSubscribed(true);
        setMessage(locale === "bn" 
          ? "ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।" 
          : "Thank you! You have successfully subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || (locale === "bn" 
          ? "এই ইমেইল ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে।" 
          : "This email is already subscribed."));
      }
    } catch (error) {
      setStatus("error");
      setMessage(locale === "bn"
        ? "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।"
        : "Network error. Please try again.");
    }
  };

  const labels = {
    title: locale === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe",
    description: locale === "bn"
      ? "সর্বশেষ খবর পেতে আমাদের সাথে যুক্ত থাকুন"
      : "Stay connected to get the latest news",
    placeholder: locale === "bn" ? "আপনার ইমেইল লিখুন" : "Enter your email address",
    button: locale === "bn" ? "সাবস্ক্রাইব" : "Subscribe",
  };

  if (!isLoadingCheck && isSubscribed) {
    return null;
  }

  if (isLoadingCheck) {
    return null;
  }

  if (variant === "hero") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#A41E22] via-[#8a1a1d] to-[#6C1312] rounded-2xl p-8 md:p-12 text-center ${className}`}>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">{labels.title}</h3>
        <p className="text-white/80 mb-8 max-w-xl mx-auto text-base md:text-lg">{labels.description}</p>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={labels.placeholder}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              required
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-[#A41E22] rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50"
            >
              {status === "loading" ? "..." : labels.button}
            </button>
          </div>
          {message && (
            <p className={`mt-4 text-sm font-medium ${status === "error" ? "text-yellow-300" : "text-green-300"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={labels.placeholder}
          className="flex-1 px-4 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A41E22] bg-white placeholder-gray-400 text-sm border border-gray-200"
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 bg-[#A41E22] text-white rounded-lg font-semibold text-sm hover:bg-[#8a1a1d] transition-all disabled:opacity-50"
        >
          {status === "loading" ? "..." : labels.button}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-xs font-medium ${status === "error" ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
