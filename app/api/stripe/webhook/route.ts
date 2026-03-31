import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import prisma from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia"
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      const { productId, productSlug, userId, price } = session.metadata || {}
      
      if (!productId || !userId) {
        console.error("Missing metadata in webhook")
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        console.error("Product not found:", productId)
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Get customer info from Stripe
      const customer = session.customer_details
      
      // Create the order in database
      const order = await prisma.order.create({
        data: {
          clientName: customer?.name || "Customer",
          clientEmail: customer?.email || "",
          clientPhone: customer?.phone || "",
          message: "Purchased via Stripe",
          status: "completed", // Payment successful so order is completed
          paymentStatus: "paid",
          amount: parseFloat(price || "0"),
          packageType: "pro",
          planType: "pro",
          downloadCount: 0,
          downloadLimit: 3,
          productId: productId,
          userId: userId
        }
      })

      // Send confirmation email
      if (customer?.email) {
        await sendOrderConfirmation(
          customer.email,
          customer.name || "Customer",
          order.id.slice(-8).toUpperCase(),
          {
            productName: product.name,
            packageType: "pro",
            amount: parseFloat(price || "0")
          }
        )
      }

      console.log("Order created from webhook:", order.id)
      return NextResponse.json({ success: true, orderId: order.id })
    } catch (error: any) {
      console.error("Error processing webhook:", error.message)
      return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}