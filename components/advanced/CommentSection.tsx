// components/advanced/CommentSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Comment = {
  id: number;
  author_name: string;
  author_email?: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: {
    24: string;
    48: string;
    96: string;
  };
};

type CommentSectionProps = {
  postId: number;
  locale: string;
  apiBaseUrl?: string;
};

export default function CommentSection({ postId, locale, apiBaseUrl = "" }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    comment: "",
  });

  const labels = {
    title: locale === "bn" ? "মতামত" : "Comments",
    leaveComment: locale === "bn" ? "মতামত দিন" : "Leave a Comment",
    name: locale === "bn" ? "আপনার নাম" : "Your Name",
    email: locale === "bn" ? "ইমেইল ঠিকানা" : "Email Address",
    website: locale === "bn" ? "ওয়েবসাইট (ঐচ্ছিক)" : "Website (optional)",
    comment: locale === "bn" ? "আপনার মতামত" : "Your Comment",
    submit: locale === "bn" ? "জমা দিন" : "Submit",
    loading: locale === "bn" ? "লোড হচ্ছে..." : "Loading...",
    noComments: locale === "bn" ? "এখনো কোনো মতামত নেই। প্রথম মতামত দিন!" : "No comments yet. Be the first to comment!",
    success: locale === "bn" ? "মতামত সফলভাবে জমা হয়েছে!" : "Comment submitted successfully!",
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/wp-json/wp/v2/comments?post=${postId}&per_page=50&order=desc`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId && apiBaseUrl) {
      fetchComments();
    }
  }, [postId, apiBaseUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) {
      setSubmitError(locale === "bn" ? "সব তথ্য প্রয়োজন" : "All fields required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/wp-json/eyepress/v1/guest-comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          name: formData.name,
          email: formData.email,
          website: formData.website || undefined,
          comment: formData.comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      setSuccessMessage(labels.success);
      setFormData({ name: "", email: "", website: "", comment: "" });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit comment");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-1 h-6 md:h-8 bg-[#A41E22]" />
        <h2 className="text-xl md:text-2xl font-bold text-[#6C1312]">
          {labels.title} ({comments.length})
        </h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">{labels.leaveComment}</h3>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels.name} *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A41E22] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels.email} *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A41E22] outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.website}</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A41E22] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{labels.comment} *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A41E22] outline-none resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#A41E22] text-white font-semibold rounded-lg hover:bg-[#8B1A1D] disabled:opacity-50"
          >
            {submitting ? labels.loading : labels.submit}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">{labels.loading}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{labels.noComments}</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md">
              <div className="flex items-start gap-4">
                {comment.author_avatar_urls?.[96] ? (
                  <Image
                    src={comment.author_avatar_urls[96]}
                    alt={comment.author_name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#A41E22] flex items-center justify-center text-white font-bold text-lg">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{comment.author_name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.date)}</span>
                  </div>
                  <div
                    className="text-gray-700 text-sm"
                    dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
