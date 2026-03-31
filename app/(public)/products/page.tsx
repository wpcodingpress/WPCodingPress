"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Download, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  type: string;
  pricing: {
    free?: { price: number; features: string[] };
    pro?: { price: number; features: string[] };
    enterprise?: { price: number; features: string[] };
  };
  isFeatured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    return Download;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-primary">Products</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium WordPress plugins, MCP servers, and tools to boost your workflow
          </p>
        </motion.div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
                          {product.type}
                        </span>
                        {product.isFeatured && (
                          <span className="flex items-center gap-1 text-yellow-400 text-xs">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {product.shortDesc || product.name}
                      </p>

                      <div className="space-y-3 mb-6">
                        {product.pricing?.free && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Free</span>
                            <span className="text-white font-bold">
                              ${product.pricing.free.price}
                            </span>
                          </div>
                        )}
                        {product.pricing?.pro && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Pro</span>
                            <span className="text-white font-bold">
                              ${product.pricing.pro.price}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link href={`/products/${product.slug}`}>
                        <Button className="w-full glow">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
