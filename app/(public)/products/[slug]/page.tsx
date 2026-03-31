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
  price: number;
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
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    console.log("Download clicked, user:", user, "product:", product);
    
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!product) return;

    setIsProcessing(true);
    try {
      const isFree = product.price === 0;
      const downloadLink = isFree ? product.freeDownloadUrl : product.proDownloadUrl;

      console.log("Creating order, isFree:", isFree, "downloadLink:", downloadLink);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.slug,
          packageType: isFree ? "free" : "pro",
          clientName: user.name || "User",
          clientEmail: user.email,
          clientPhone: user.phone || "",
          userId: user.id,
          amount: product.price
        })
      });

      const data = await response.json();
      console.log("Order response:", response.status, data);

      if (response.ok) {
        const order = await response.json();
        
        if (isFree && downloadLink) {
          setDownloadUrl(downloadLink);
        }
        
        setOrderSuccess(true);
      } else {
        alert(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
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

  const isFree = product.price === 0;

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
              {isFree ? "Download Ready!" : "Order Placed!"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isFree 
                ? `Your order for ${product.name} has been placed. You can download it from your dashboard.`
                : `Your order for ${product.name} has been placed. Check your dashboard for payment.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isFree && downloadUrl && (
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
            
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                {isFree ? (
                  <span className="text-5xl font-bold text-green-400">Free</span>
                ) : (
                  <span className="text-5xl font-bold text-white">${product.price}</span>
                )}
              </div>
              <span className={`text-sm px-4 py-1 rounded-full ${isFree ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                {isFree ? 'Free Download' : 'Premium Product'}
              </span>
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
              ) : isFree ? (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Download Free
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now - ${product.price}
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {isFree ? 'Instant download after order' : 'Instant access after payment'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}