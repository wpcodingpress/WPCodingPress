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

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    let serviceId: string | null = null
    let productId: string | null = null
    let productName: string | null = null
    let serviceName: string | null = null
    let productPrice = 0
    let freeDownloadUrl: string | null = null

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

    if (service && !productId) {
      const serviceRecord = await prisma.service.findUnique({
        where: { slug: service }
      })
      
      if (serviceRecord) {
        serviceId = serviceRecord.id
        serviceName = serviceRecord.name
      }
    }

    const isFreeProduct = productPrice === 0
    
    const orderAmount = amount || productPrice

    const order = await prisma.order.create({
      data: {
        serviceId,
        productId,
        userId: userId || null,
        packageType: packageType || 'basic',
        planType: product ? (isFreeProduct ? 'free' : 'pro') : null,
        clientName,
        clientEmail,
        clientPhone: clientPhone || "",
        message: message || "",
        status: isFreeProduct ? "completed" : "pending",
        paymentStatus: serviceId ? "pending" : (isFreeProduct ? "paid" : (orderAmount > 0 ? "unpaid" : "paid")),
        amount: orderAmount,
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
