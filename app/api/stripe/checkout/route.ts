import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Only initialize Stripe if API key is available
let stripe: any = null
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = require("stripe")
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia"
  })
}

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
  }
  
  try {
    const body = await request.json()
    const { productSlug, userId, userEmail, userName } = body

    if (!productSlug || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { slug: productSlug }
    })

    if (!product || product.price === 0) {
      return NextResponse.json({ error: "Product not found or is free" }, { status: 404 })
    }

    // Create or get Stripe customer
    let customerId: string | undefined
    
    // For demo purposes, create a simple customer ID from user email
    // In production, you'd create a proper Stripe customer
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 })
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName || "Customer",
        metadata: { userId }
      })
      customerId = customer.id
    }

    // Create Stripe product if it doesn't exist
    let stripeProductId: string
    
    try {
      // List existing products and check if our product exists
      const existingProducts = await stripe.products.list({ limit: 100, active: true })
      const existingProduct = existingProducts.data.find((p: any) => p.metadata?.productId === product.id)
      
      if (existingProduct) {
        stripeProductId = existingProduct.id
      } else {
        const stripeProduct = await stripe.products.create({
          name: product.name,
          description: product.description || product.shortDesc || "Product",
          metadata: { productId: product.id }
        })
        stripeProductId = stripeProduct.id
      }
    } catch {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description || product.shortDesc || "Product",
        metadata: { productId: product.id }
      })
      stripeProductId = stripeProduct.id
    }

    // Create price for the product
    const price = await stripe.prices.create({
      product: stripeProductId,
      unit_amount: product.price * 100, // Convert to cents
      currency: "usd"
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productSlug}?payment=cancelled`,
      metadata: {
        productId: product.id,
        productSlug: product.slug,
        userId: userId,
        price: product.price.toString()
      }
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error.message)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}