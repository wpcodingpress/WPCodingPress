import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { type } = body

    const order = await prisma.customOrder.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (type === "advance") {
      await prisma.customOrder.update({
        where: { id },
        data: { advancePaid: false }
      })
    } else if (type === "remaining") {
      await prisma.customOrder.update({
        where: { id },
        data: { remainingPaid: false }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reverting payment:", error)
    return NextResponse.json({ error: "Failed to revert payment" }, { status: 500 })
  }
}