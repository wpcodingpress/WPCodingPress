"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Download, ArrowLeft, Check } from "lucide-react";
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
    enterprise?: { price: number; features: string[] };
  };
  features: string[];
  isActive: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

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
    { key: "free", name: "Free", price: product.pricing?.free?.price || 0 },
    { key: "pro", name: "Pro", price: product.pricing?.pro?.price || 0 },
    { key: "enterprise", name: "Enterprise", price: product.pricing?.enterprise?.price || 0 },
  ];

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
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedPlan === plan.key
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white capitalize">{plan.name}</span>
                    <span className="text-2xl font-bold text-white">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <Button className="w-full glow" size="lg">
              {selectedPlan === "free" ? (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Free
                </>
              ) : (
                <>
                  Purchase Now - ${plans.find(p => p.key === selectedPlan)?.price}
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
