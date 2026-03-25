import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        service: true
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
    const { serviceId, packageType, clientName, clientEmail, clientPhone, message } = body

    if (!serviceId || !packageType || !clientName || !clientEmail || !clientPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        serviceId,
        packageType,
        clientName,
        clientEmail,
        clientPhone,
        message: message || "",
        status: "pending"
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
