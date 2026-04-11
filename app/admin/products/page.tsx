"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  Package,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  type: string;
  price: number;
  freeDownloadUrl: string | null;
  proDownloadUrl: string | null;
  features: any;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    type: "plugin",
    price: 0,
    freeDownloadUrl: "",
    proDownloadUrl: "",
    features: "",
    isActive: true,
    isFeatured: false,
    order: 0
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const featuresArray = formData.features 
        ? formData.features.split('\n').filter(f => f.trim()) 
        : [];
        
      const payload = {
        ...formData,
        features: featuresArray
      };

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    let freeUrl = product.freeDownloadUrl || "";
    let proUrl = product.proDownloadUrl || "";
    
    if (freeUrl.includes('drive.google.com/file/') && !freeUrl.includes('uc?export=download')) {
      const match = freeUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        freeUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    if (proUrl.includes('drive.google.com/file/') && !proUrl.includes('uc?export=download')) {
      const match = proUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        proUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc || "",
      type: product.type,
      price: product.price || 0,
      freeDownloadUrl: freeUrl,
      proDownloadUrl: proUrl,
      features: Array.isArray(product.features) ? product.features.join('\n') : "",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      order: product.order
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive })
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      shortDesc: "",
      type: "plugin",
      price: 0,
      freeDownloadUrl: "",
      proDownloadUrl: "",
      features: "",
      isActive: true,
      isFeatured: false,
      order: 0
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-muted-foreground">Manage your products (plugins, MCP servers)</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Pricing</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.slug}</p>
                      </div>
                      {product.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full capitalize">
                      {product.type}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.price === 0 ? (
                      <span className="text-green-400 font-medium">Free</span>
                    ) : (
                      <span className="text-white font-medium">${product.price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-muted-foreground hover:text-white"
                      >
                        <a href={`/products/${product.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(product)}
                        className="text-muted-foreground hover:text-white"
                      >
                        {product.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-muted-foreground hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {editingProduct ? "Update product details below" : "Create a new product for your store"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                    <span>Name</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                    <span>Slug</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Short Description</label>
                <Input
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Brief description for product cards (optional)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
                  <span>Description</span>
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Detailed product description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Product Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="plugin" className="bg-slate-800">WordPress Plugins</option>
                    <option value="theme" className="bg-slate-800">WordPress Themes</option>
                    <option value="template" className="bg-slate-800">Next.js Templates</option>
                    <option value="mcp_server" className="bg-slate-800">MCP Servers</option>
                    <option value="ai_agent" className="bg-slate-800">AI Agents</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Free Download URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.freeDownloadUrl}
                      onChange={(e) => setFormData({ ...formData, freeDownloadUrl: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="https://drive.google.com/uc?export=download&id=..."
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-white whitespace-nowrap"
                      onClick={() => {
                        const link = formData.freeDownloadUrl;
                        if (link.includes('drive.google.com')) {
                          const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
                          if (match) {
                            setFormData({ ...formData, freeDownloadUrl: `https://drive.google.com/uc?export=download&id=${match[1]}` });
                          } else {
                            alert('Invalid Google Drive link. Make sure it contains the file ID.');
                          }
                        }
                      }}
                      title="Convert Google Drive link to direct download"
                    >
                      Convert
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">Paste Google Drive share link and click Convert</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Pro Download URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.proDownloadUrl}
                      onChange={(e) => setFormData({ ...formData, proDownloadUrl: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="https://drive.google.com/uc?export=download&id=..."
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-white whitespace-nowrap"
                      onClick={() => {
                        const link = formData.proDownloadUrl;
                        if (link.includes('drive.google.com')) {
                          const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
                          if (match) {
                            setFormData({ ...formData, proDownloadUrl: `https://drive.google.com/uc?export=download&id=${match[1]}` });
                          } else {
                            alert('Invalid Google Drive link. Make sure it contains the file ID.');
                          }
                        }
                      }}
                      title="Convert Google Drive link to direct download"
                    >
                      Convert
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">For pro products (price greater than $0)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Price (USD)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-slate-500">Set 0 for free products, any amount for paid products</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all"></div>
                    <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="group-hover:text-white transition-colors">Active</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-white/30 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all"></div>
                    <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="group-hover:text-white transition-colors">Featured</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0">
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
