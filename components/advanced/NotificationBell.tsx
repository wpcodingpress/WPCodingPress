// components/advanced/NotificationBell.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Notification = {
  id: number;
  email: string;
  comment_id: number;
  post_id: number;
  post_slug: string;
  post_title: string;
  status: string;
  notification_read: number;
  created_at: string;
};

type NotificationBellProps = {
  locale: string;
  apiBaseUrl?: string;
};

export default function NotificationBell({ locale, apiBaseUrl = "" }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("wp_user") || localStorage.getItem("eyepress_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) {
          setUserEmail(parsed.email);
          fetchNotifications(parsed.email);
        }
      } catch (e) {
        console.error("Error:", e);
      }
    }
  }, []);

  const fetchNotifications = async (email: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/wp-json/eyepress/v1/notifications?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return locale === "bn" ? `${diffMins} মিনিট আগে` : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return locale === "bn" ? `${diffHours} ঘণ্টা আগে` : `${diffHours}h ago`;
    return locale === "bn" ? "আগে" : "ago";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-[#A41E22] hover:bg-gray-100"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-lg shadow-xl bg-white border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">
              {locale === "bn" ? "নোটিফিকেশন" : "Notifications"}
            </h3>
          </div>
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {locale === "bn" ? "কোনো নোটিফিকেশন নেই" : "No notifications"}
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <Link
                  key={notification.id}
                  href={`/${locale}/${notification.post_slug || notification.post_id}`}
                  className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${!notification.notification_read ? "bg-blue-50" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm text-gray-900 font-medium truncate">{notification.post_title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {notification.status === "1" || notification.status === "approved"
                      ? (locale === "bn" ? "অনুমোদিত" : "Approved")
                      : (locale === "bn" ? "অপেক্ষায়" : "Pending")
                    }
                  </p>
                  <span className="text-xs text-gray-400">{formatDate(notification.created_at)}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
