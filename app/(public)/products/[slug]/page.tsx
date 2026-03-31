"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Download, ArrowLeft, Check, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  type: string;
  pricing: {
    free?: { price: number; features: string[] };
    pro?: { price: number; features: string[] };
  };
  features: string[];
  freeDownloadUrl: string | null;
  proDownloadUrl: string | null;
  isActive: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
      checkSession();
    }
  }, [params.slug]);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setUser(data?.user || null);
    } catch (err) {
      console.error("Session error:", err);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        if (data.pricing?.free) {
          setSelectedPlan("free");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsProcessing(true);
    try {
      const planType = selectedPlan;
      const pricing = product?.pricing?.[planType as keyof typeof product.pricing];
      const price = pricing?.price || 0;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product?.slug,
          packageType: planType,
          clientName: user.name || "User",
          clientEmail: user.email,
          clientPhone: user.phone || "",
          userId: user.id,
          amount: price
        })
      });

      if (response.ok) {
        const order = await response.json();
        
        if (planType === "free" && product?.freeDownloadUrl) {
          setDownloadUrl(product.freeDownloadUrl);
        }
        
        setOrderSuccess(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const plans = [
    { key: "free", name: "Free", price: product.pricing?.free?.price || 0, features: product.pricing?.free?.features || [] },
    { key: "pro", name: "Pro", price: product.pricing?.pro?.price || 0, features: product.pricing?.pro?.features || [] },
  ];

  const selectedPlanData = plans.find(p => p.key === selectedPlan);

  if (orderSuccess) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {selectedPlan === "free" ? "Download Ready!" : "Order Placed!"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {selectedPlan === "free" 
                ? `Your order for ${product.name} (Free) has been placed. You can download it from your dashboard.`
                : `Your order for ${product.name} (Pro) has been placed. Check your dashboard for updates.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {downloadUrl && (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2">
                    <Download className="h-5 w-5" />
                    Download Now
                  </Button>
                </a>
              )}
              <Link href="/dashboard/orders">
                <Button variant="outline" size="lg" className="gap-2">
                  View My Orders
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full capitalize mb-6">
              {product.type}
            </span>
            <p className="text-lg text-muted-foreground mb-8">{product.shortDesc || product.description}</p>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
            
            <div className="space-y-4 mb-8">
              {plans.map((plan) => (
                <button
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedPlan === plan.key
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white capitalize">{plan.name}</span>
                      {plan.key === "free" && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Free</span>
                      )}
                      {plan.key === "pro" && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Premium</span>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                  </div>
                  {plan.features.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {plan.features.slice(0, 2).join(" • ")}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button 
              className="w-full glow" 
              size="lg" 
              onClick={handleDownload}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : selectedPlan === "free" ? (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Download Free
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now - ${selectedPlanData?.price}
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Instant access to files after purchase
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}