"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import SubscribeForm from "@/components/advanced/SubscribeForm";

export default function SubscribePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [locale, setLocale] = useState("bn");

  return (
    <div className="min-h-screen bg-gray-50">
      <SubscribeForm apiBaseUrl={`/api/sites/${slug}`} variant="page" />
    </div>
  );
}