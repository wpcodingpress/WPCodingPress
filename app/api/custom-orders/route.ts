import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { createNotification, notifyAdmins } from "@/lib/notifications"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching custom orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Creating custom order with body:", body)
    
    const { clientName, clientEmail, clientPhone, projectName, projectDescription, serviceType, totalAmount, advanceAmount, remainingAmount, notes, bankAccountId } = body

    if (!clientName || !clientEmail || !projectName || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.customOrder.create({
      data: {
        clientName,
        clientEmail,
        clientPhone: clientPhone || "",
        projectName,
        projectDescription: projectDescription || "",
        serviceType: serviceType || "",
        totalAmount: Number(totalAmount),
        advanceAmount: Number(advanceAmount) || 0,
        remainingAmount: Number(remainingAmount) || 0,
        advancePaid: false,
        remainingPaid: false,
        status: "pending",
        notes: notes || "",
        bankAccountId: bankAccountId || "",
      }
    })

    console.log("Custom order created successfully:", order.id)

    await notifyAdmins({
      type: 'custom_order',
      title: 'New Custom Order',
      message: `${clientName} - "${projectName}" - $${totalAmount}`,
      link: '/admin/custom-orders',
      priority: 'high'
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Error creating custom order:", error.message)
    return NextResponse.json({ error: "Failed to create order: " + error.message }, { status: 500 })
  }
}