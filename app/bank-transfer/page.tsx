"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle, Copy, ArrowLeft, Loader2, CreditCard, Banknote, Globe, Info, Shield, Clock, QrCode, Wallet, ArrowRightLeft, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  swift: string;
  bankAddress: string;
  country: string;
  currency: string;
  instructions: string;
}

interface ProductInfo {
  name: string;
  price: number;
  slug: string;
}

function BankTransferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const productSlug = searchParams.get("product");
  const productName = searchParams.get("name");
  const productPrice = searchParams.get("price");

  useEffect(() => {
    if (!productSlug) {
      router.push("/products");
      return;
    }
    fetchBankDetails();
  }, [productSlug]);

  const fetchBankDetails = async () => {
    try {
      const res = await fetch("/api/bank-details");
      if (res.ok) {
        const data = await res.json();
        setBankDetails(data);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTransfer = async () => {
    setShowConfirmModal(true);
  };

  const handleSubmitOrder = async () => {
    if (!productSlug || !productPrice) return;

    setIsSubmitting(true);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (!sessionData?.user) {
        router.push(`/login?redirect=/bank-transfer?product=${productSlug}&name=${productName}&price=${productPrice}`);
        return;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productSlug,
          packageType: "pro",
          clientName: sessionData.user.name || "User",
          clientEmail: sessionData.user.email,
          clientPhone: sessionData.user.phone || "",
          userId: sessionData.user.id,
          amount: parseInt(productPrice) || 0,
          paymentMethod: "bank_transfer",
          transactionId: transactionId || null
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        router.push(`/dashboard/orders?payment=pending&order=${data.id}`);
      } else {
        alert(data.error || "Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!bankDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
        <Card className="max-w-md bg-white/10 backdrop-blur-xl border-slate-700/50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-10 w-10 text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Payment Not Available</h2>
            <p className="text-slate-400 mb-6">
              Bank transfer details are not configured yet. Please contact support for alternative payment methods.
            </p>
            <Button onClick={() => router.push("/products")} className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 text-slate-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white/10 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Bank Transfer Payment
                </h1>
                <p className="text-slate-400 mt-2">
                  Transfer the amount below to complete your purchase
                </p>
              </div>

              {/* Product Info Card */}
              <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">Product</p>
                    <p className="font-semibold text-white text-lg">{productName || "Premium Product"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Total Amount</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      ${productPrice || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Banknote className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-semibold text-white">Bank Details</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Bank Name</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{bankDetails.bankName}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.bankName, "bankName")}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {copiedField === "bankName" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Account Name</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{bankDetails.accountName}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountName, "accountName")}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {copiedField === "accountName" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-white">{bankDetails.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber, "accountNumber")}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {copiedField === "accountNumber" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {bankDetails.sortCode && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">Sort Code</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white">{bankDetails.sortCode}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.sortCode!, "sortCode")}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {copiedField === "sortCode" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {bankDetails.iban && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">IBAN</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white text-sm">{bankDetails.iban}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.iban!, "iban")}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {copiedField === "iban" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {bankDetails.swift && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                      <span className="text-slate-400">SWIFT/BIC</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-white">{bankDetails.swift}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.swift!, "swift")}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {copiedField === "swift" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {bankDetails.country && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400">Country</span>
                      <span className="font-semibold text-white">{bankDetails.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              {bankDetails.instructions && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-amber-400" />
                    <h4 className="font-semibold text-amber-400">Payment Instructions</h4>
                  </div>
                  <p className="text-amber-200/80 text-sm">{bankDetails.instructions}</p>
                </div>
              )}

              {/* Important Info */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-blue-400">Important Notes</h4>
                </div>
                <ul className="text-blue-200/80 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Include your email address as payment reference</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Transfer the exact amount shown above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Save your payment confirmation receipt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Your order will be processed after payment verification</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <Button 
                onClick={handleConfirmTransfer}
                disabled={isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-500 hover:to-fuchsia-600 text-white text-lg font-semibold shadow-lg shadow-violet-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Confirm Transfer
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Enter your transaction ID after making the payment
              </p>

              {/* Transaction ID Input */}
              <div className="mt-4 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Hash className="w-4 h-4" />
                  Transaction ID / Reference Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your bank transaction ID"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>
        </motion.div>
      </div>
    </div>
);
}

export default function BankTransferPage() {
  return (
    <Suspense fallback={<BankTransferLoading />}>
      <BankTransferContent />
    </Suspense>
  );
}