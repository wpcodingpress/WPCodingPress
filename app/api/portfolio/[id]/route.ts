import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: body
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.portfolio.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
  }
}
