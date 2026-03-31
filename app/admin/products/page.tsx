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
      const payload = {
        ...formData,
        features: formData.features ? JSON.parse(formData.features) : []
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
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc || "",
      type: product.type,
      price: product.price || 0,
      freeDownloadUrl: product.freeDownloadUrl || "",
      proDownloadUrl: product.proDownloadUrl || "",
      features: Array.isArray(product.features) ? JSON.stringify(product.features, null, 2) : "",
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 border border-white/20 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Slug *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Short Description</label>
                <Input
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  className="bg-white/5 border-white/10"
                  placeholder="Brief description for product cards"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  >
                    <option value="plugin">WordPress Plugin</option>
                    <option value="mcp_server">MCP Server</option>
                    <option value="service">Service</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Free Download URL</label>
                  <Input
                    value={formData.freeDownloadUrl}
                    onChange={(e) => setFormData({ ...formData, freeDownloadUrl: e.target.value })}
                    className="bg-white/5 border-white/10"
                    placeholder="https://your-server.com/files/free.zip"
                  />
                  <p className="text-xs text-slate-400">For free products (price = $0)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Pro Download URL</label>
                  <Input
                    value={formData.proDownloadUrl}
                    onChange={(e) => setFormData({ ...formData, proDownloadUrl: e.target.value })}
                    className="bg-white/5 border-white/10"
                    placeholder="https://your-server.com/files/pro.zip"
                  />
                  <p className="text-xs text-slate-400">For pro products (price greater than $0)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Price (USD)</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="bg-white/5 border-white/10"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-slate-400">Set 0 for free products, any amount for paid products</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="glow">
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
