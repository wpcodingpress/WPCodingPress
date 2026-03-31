import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { sendOrderConfirmation } from "@/lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productSlug = searchParams.get('productSlug')

    let whereClause: any = {}
    
    if (userId) {
      whereClause.userId = userId
    } else if (session?.user?.role === 'client') {
      whereClause.userId = session?.user?.id
    }

    if (productSlug) {
      whereClause.product = { slug: productSlug }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        service: true,
        product: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("DEBUG: Full request body:", JSON.stringify(body))
    const { 
      service, product, packageType, clientName, clientEmail, 
      clientPhone, message, userId, amount 
    } = body

    console.log("DEBUG: service=", service, "product=", product, "amount=", amount)
    console.log("DEBUG: service is truthy:", !!service, "service value:", service)

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    let serviceId: string | null = null
    let productId: string | null = null
    let productName: string | null = null
    let serviceName: string | null = null
    let productPrice = 0
    let freeDownloadUrl: string | null = null
    let orderAmount = amount || 0

    if (product) {
      const productRecord = await prisma.product.findUnique({
        where: { slug: product }
      })
      
      if (productRecord) {
        productId = productRecord.id
        productName = productRecord.name
        productPrice = productRecord.price || 0
        freeDownloadUrl = productRecord.freeDownloadUrl
      }
    }

    console.log("DEBUG: Looking for service with slug:", service)
    
    if (service && !productId) {
      const serviceRecord = await prisma.service.findUnique({
        where: { slug: service }
      })
      console.log("DEBUG: serviceRecord found:", serviceRecord)
      
      if (serviceRecord) {
        serviceId = serviceRecord.id
        serviceName = serviceRecord.name
        if (packageType === 'basic') orderAmount = serviceRecord.basicPrice
        else if (packageType === 'standard') orderAmount = serviceRecord.standardPrice
        else if (packageType === 'premium') orderAmount = serviceRecord.premiumPrice
      }
    }

    const isFreeProduct = productPrice === 0
    const isService = !!serviceId

    // For status determination, check if service was provided in request (even if not found in DB)
    // This handles the case where service record doesn't exist in database
    const isServiceOrder = !!service || !!serviceId

    let defaultStatus = "pending"
    console.log("DEBUG: isFreeProduct=", isFreeProduct, "isService=", isService, "isServiceOrder=", isServiceOrder, "productId=", productId, "serviceId=", serviceId)
    if (isServiceOrder) {
      defaultStatus = "approved"
    } else if (isFreeProduct) {
      defaultStatus = "completed"
    }

    if (productId && userId && isFreeProduct) {
      const existingOrder = await prisma.order.findFirst({
        where: {
          productId,
          userId,
          planType: 'free'
        }
      })
      
      if (existingOrder && existingOrder.downloadCount >= existingOrder.downloadLimit) {
        return NextResponse.json({ 
          error: "You have already reached the download limit for this free product. Download limit: 3 times per product." 
        }, { status: 400 })
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      // For Pro products without Stripe, auto-complete payment (test mode)
      const isProProduct = productId && !isFreeProduct
      const paymentStatus = isProProduct ? "paid" : (isServiceOrder ? "pending" : (isFreeProduct ? "paid" : (orderAmount > 0 ? "unpaid" : "paid")))
      const orderStatus = isProProduct ? "completed" : defaultStatus
      
      console.log("DEBUG: Creating order with status:", orderStatus, "isService:", isService, "isProProduct:", isProProduct)
      const order = await tx.order.create({
        data: {
          clientName,
          clientEmail,
          clientPhone: clientPhone || "",
          message: message || "",
          status: orderStatus,
          paymentStatus: paymentStatus,
          amount: orderAmount,
          packageType: packageType || 'basic',
          downloadCount: 0,
          downloadLimit: 3,
        }
      })

      if (productId) {
        await tx.order.update({
          where: { id: order.id },
          data: { 
            productId, 
            planType: isFreeProduct ? 'free' : 'pro',
            userId: userId || undefined 
          }
        })
      } else if (serviceId) {
        await tx.order.update({
          where: { id: order.id },
          data: { 
            serviceId, 
            userId: userId || undefined 
          }
        })
      }

      return await tx.order.findUnique({ where: { id: order.id } })
    })
    
    console.log("DEBUG: Final order from DB - status:", order?.status)

    if (!order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    if (clientEmail) {
      await sendOrderConfirmation(
        clientEmail,
        clientName,
        order.id.slice(-8).toUpperCase(),
        {
          productName: productName || undefined,
          serviceName: serviceName || undefined,
          packageType: packageType || 'basic',
          amount: orderAmount
        }
      )
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Error creating order:", error.message || error)
    return NextResponse.json({ error: "Failed to create order: " + (error.message || 'Unknown error') }, { status: 500 })
  }
}
