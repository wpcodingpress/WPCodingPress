"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, CheckCircle, Copy, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
          paymentMethod: "bank_transfer"
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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bankDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No Bank Details Available</h2>
            <p className="text-muted-foreground mb-4">
              Bank transfer details are not configured yet. Please contact support.
            </p>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Bank Transfer Details</h1>
                <p className="text-muted-foreground mt-2">
                  Please transfer the amount below to complete your purchase
                </p>
              </div>

              {/* Product Info */}
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-semibold">{productName || "Premium Product"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-2xl font-bold text-primary">${productPrice || 0}</p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Bank Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{bankDetails.bankName}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.bankName, "bankName")}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedField === "bankName" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Account Name</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{bankDetails.accountName}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountName, "accountName")}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedField === "accountName" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bankDetails.accountNumber, "accountNumber")}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {copiedField === "accountNumber" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {bankDetails.sortCode && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Sort Code</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{bankDetails.sortCode}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.sortCode!, "sortCode")}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {copiedField === "sortCode" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {bankDetails.iban && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">IBAN</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-sm">{bankDetails.iban}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.iban!, "iban")}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {copiedField === "iban" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {bankDetails.swift && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">SWIFT/BIC</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{bankDetails.swift}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.swift!, "swift")}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {copiedField === "swift" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {bankDetails.country && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-semibold">{bankDetails.country}</span>
                  </div>
                )}
              </div>

              {bankDetails.instructions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions</h4>
                  <p className="text-yellow-700 text-sm">{bankDetails.instructions}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Important</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Please include your email as payment reference</li>
                  <li>• Transfer the exact amount shown above</li>
                  <li>• Take a screenshot of your payment confirmation</li>
                  <li>• Your order will be processed after payment confirmation</li>
                </ul>
              </div>

              <Button 
                onClick={handleConfirmTransfer}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I Have Made the Transfer
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                By clicking above, you confirm that you have made the bank transfer
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function BankTransferLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
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