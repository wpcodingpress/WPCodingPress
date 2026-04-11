import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

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
    const { clientName, clientEmail, clientPhone, projectName, projectDescription, serviceType, totalAmount, advanceAmount, remainingAmount, notes } = body

    const order = await prisma.customOrder.create({
      data: {
        clientName,
        clientEmail,
        clientPhone: clientPhone || "",
        projectName,
        projectDescription: projectDescription || "",
        serviceType: serviceType || "",
        totalAmount,
        advanceAmount,
        remainingAmount,
        advancePaid: false,
        remainingPaid: false,
        status: "pending",
        notes: notes || "",
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating custom order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}