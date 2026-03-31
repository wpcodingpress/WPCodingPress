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

    let whereClause = {}
    
    if (userId) {
      whereClause = { userId }
    } else if (session?.user?.role === 'client') {
      whereClause = { userId: session?.user?.id }
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
    const { 
      service, product, packageType, clientName, clientEmail, 
      clientPhone, message, userId, amount 
    } = body

    if (!clientName || !clientEmail || !clientPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let serviceId: string | null = null
    let productId: string | null = null
    let productName: string | null = null
    let serviceName: string | null = null
    let pricing: any = null

    if (product) {
      const productRecord = await prisma.product.findUnique({
        where: { slug: product }
      })
      
      if (productRecord) {
        productId = productRecord.id
        productName = productRecord.name
        pricing = productRecord.pricing as any
      }
    }

    if (service && !productId) {
      const serviceRecord = await prisma.service.findUnique({
        where: { slug: service }
      })
      
      if (serviceRecord) {
        serviceId = serviceRecord.id
        serviceName = serviceRecord.name
      }
    }

    let orderAmount = amount || 0
    
    if (!orderAmount && pricing && packageType) {
      const pricingTier = pricing[packageType?.toLowerCase()]
      if (pricingTier) {
        orderAmount = pricingTier.price || 0
      }
    }

    const order = await prisma.order.create({
      data: {
        serviceId,
        productId,
        userId: userId || null,
        packageType: packageType || 'basic',
        clientName,
        clientEmail,
        clientPhone,
        message: message || "",
        status: "pending",
        amount: orderAmount,
        paymentStatus: orderAmount > 0 ? "unpaid" : "paid"
      }
    })

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
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
