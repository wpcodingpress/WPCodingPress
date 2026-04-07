"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function RegisterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState("bn");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/sites/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-4">
            {locale === "bn" ? "রেজিস্ট্রেশন সফল!" : "Registration Successful!"}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === "bn" ? "এখন লগইন করুন" : "Please login to continue"}
          </p>
          <a href={`/sites/${slug}/login`} className="inline-block bg-[#A41E22] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a1a1d]">
            {locale === "bn" ? "লগইন করুন" : "Login"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {locale === "bn" ? "রেজিস্ট্রেশন" : "Register"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {locale === "bn" ? "ইউজারনেম" : "Username"}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A41E22]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {locale === "bn" ? "ইমেইল" : "Email"}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A41E22]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              {locale === "bn" ? "পাসওয়ার্ড" : "Password"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A41E22]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A41E22] text-white py-3 rounded-lg font-semibold hover:bg-[#8a1a1d] disabled:opacity-50"
          >
            {loading ? (locale === "bn" ? "অপেক্ষা করুন..." : "Please wait...") : (locale === "bn" ? "রেজিস্ট্রেশন" : "Register")}
          </button>
        </form>
      </div>
    </div>
  );
}