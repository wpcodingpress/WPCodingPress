import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import prisma from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia"
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const { productId, productSlug, userId, price } = session.metadata || {}

    if (!productId || !userId) {
      return NextResponse.json({ error: "Missing order metadata" }, { status: 400 })
    }

    // Check if order already exists (from webhook)
    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        productId: productId,
        paymentStatus: "paid"
      }
    })

    if (existingOrder) {
      return NextResponse.json({ order: existingOrder, alreadyCreated: true })
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
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
        status: "completed",
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

    return NextResponse.json({ order, success: true })
  } catch (error: any) {
    console.error("Verify payment error:", error.message)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}