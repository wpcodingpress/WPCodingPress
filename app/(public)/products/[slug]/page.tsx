"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Download, 
  ArrowLeft, 
  Check, 
  ShoppingCart, 
  Zap, 
  FileText, 
  Star, 
  Shield, 
  Clock,
  ChevronRight,
  Layers,
  Code,
  Box,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  type: string;
  price: number;
  images: any;
  features: string[] | string;
  freeDownloadUrl: string | null;
  proDownloadUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; gradient: string; label: string }> = {
  plugin: { icon: Code, color: 'blue', gradient: 'from-blue-500 to-cyan-400', label: 'WordPress Plugin' },
  theme: { icon: Layers, color: 'green', gradient: 'from-green-500 to-emerald-400', label: 'WordPress Theme' },
  template: { icon: Box, color: 'violet', gradient: 'from-violet-500 to-purple-400', label: 'Next.js Template' },
  mcp_server: { icon: Cpu, color: 'pink', gradient: 'from-pink-500 to-rose-400', label: 'MCP Server' },
  ai_agent: { icon: Zap, color: 'orange', gradient: 'from-orange-500 to-amber-400', label: 'AI Agent' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

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
      
      if (data?.user?.id && params.slug) {
        const orderRes = await fetch(`/api/orders?userId=${data.user.id}&productSlug=${params.slug}`);
        const orders = await orderRes.json();
        
        const existingOrder = orders.find((o: any) => o.planType === 'free' && o.product?.slug === params.slug);
        if (existingOrder && existingOrder.downloadCount >= existingOrder.downloadLimit) {
          setHasReachedLimit(true);
        }
      }
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

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${(price / 100).toFixed(2)}`;
  };

  const getDisplayPrice = (price: number) => {
    if (price >= 100) return price / 100;
    return price;
  };

  const handleDownload = async () => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!product) return;

    setIsProcessing(true);
    try {
      const isFree = product.price === 0;

      if (isFree) {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: product.slug,
            packageType: "free",
            clientName: user.name || "User",
            clientEmail: user.email,
            clientPhone: user.phone || "",
            userId: user.id,
            amount: 0
          })
        });

        const data = await response.json();

        if (response.status === 201) {
          router.push("/dashboard/orders");
        } else {
          alert(data.error || "Failed to create order. Please try again.");
        }
        return;
      }

      const params = new URLSearchParams({
        product: product.slug,
        name: product.name,
        price: product.price.toString()
      });
      router.push(`/bank-transfer?${params.toString()}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFeaturesArray = (features: string[] | string | undefined) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  const getTypeConfig = (type: string) => {
    return typeConfig[type] || { icon: Package, color: 'gray', gradient: 'from-gray-500 to-slate-400', label: type };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-slate-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFree = product.price === 0;
  const features = getFeaturesArray(product.features);
  const typeInfo = getTypeConfig(product.type);
  const TypeIcon = typeInfo.icon;
  const images = product.images as { featuredImage?: string } | null;
  const featuredImage = images?.featuredImage;

  if (orderSuccess) {
    return (
      <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {isFree ? "Download Ready!" : "Order Placed!"}
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              {isFree 
                ? `Your order for ${product.name} has been placed. You can download it from your dashboard.`
                : `Your order for ${product.name} has been placed. Check your dashboard for payment.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isFree && downloadUrl && (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white gap-2">
                    <Download className="h-5 w-5" />
                    Download Now
                  </Button>
                </a>
              )}
              <Link href="/dashboard/orders">
                <Button variant="outline" size="lg" className="border-slate-600 text-white hover:bg-slate-800 gap-2">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Breadcrumb */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/products" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <Link href={`/products/${product.type === 'plugin' ? 'plugins' : product.type === 'theme' ? 'themes' : product.type === 'template' ? 'templates' : product.type === 'mcp_server' ? 'mcp-servers' : 'ai-agents'}`} className="text-slate-400 hover:text-white transition-colors">
              {typeInfo.label}s
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Badge & Title */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${typeInfo.gradient} text-white text-sm font-medium`}>
                <TypeIcon className="w-4 h-4" />
                {typeInfo.label}
              </span>
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{product.name}</h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">{product.shortDesc || product.description}</p>

            {/* Product Image */}
            {featuredImage && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-slate-700/50">
                <img 
                  src={featuredImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-purple-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Description
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                {product.description.split('\n').map((para, i) => (
                  para.trim() ? <p key={i} className="mb-4">{para}</p> : null
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Purchase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {isFree ? (
                    <span className="text-5xl font-bold text-green-400">Free</span>
                  ) : (
                    <span className="text-6xl font-bold text-white">${getDisplayPrice(product.price)}</span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isFree 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300'
                }`}>
                  {isFree ? (
                    <>
                      <Zap className="w-4 h-4" />
                      Free Download
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Premium License
                    </>
                  )}
                </span>
              </div>

              {/* Purchase Button */}
              <Button 
                className={`w-full py-4 text-lg font-semibold ${
                  isFree 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
                    : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600'
                }`}
                size="lg"
                onClick={handleDownload}
                disabled={isProcessing || hasReachedLimit}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : hasReachedLimit ? (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Download Limit Reached
                  </>
                ) : isFree ? (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Free
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Purchase Now - ${getDisplayPrice(product.price)}
                  </>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/50">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Secure Payment</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Instant Access</p>
                </div>
                <div className="text-center">
                  <Download className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Lifetime Updates</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
                <h4 className="font-medium text-white mb-3">What's Included:</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Full source code
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Free updates
                  </li>
                  {isFree ? (
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      Basic support
                    </li>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        Commercial license
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products / Back Link */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <Link 
            href={`/products/${product.type === 'plugin' ? 'plugins' : product.type === 'theme' ? 'themes' : product.type === 'template' ? 'templates' : product.type === 'mcp_server' ? 'mcp-servers' : 'ai-agents'}`}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View all {typeInfo.label}s
          </Link>
        </div>
      </div>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}