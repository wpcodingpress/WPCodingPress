import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findMany({
      orderBy: { order: "asc" }
    })
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, category, imageUrl, description, order } = body

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        category,
        imageUrl,
        description: description || "",
        order: order || 0
      }
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
}
