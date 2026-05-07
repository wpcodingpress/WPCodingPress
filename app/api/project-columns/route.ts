import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get("boardId")

    if (!boardId) {
      return NextResponse.json({ error: "boardId is required" }, { status: 400 })
    }

    const columns = await prisma.projectColumn.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
      include: { _count: { select: { tasks: true } } },
    })
    return NextResponse.json({ columns })
  } catch (error) {
    console.error("Error fetching columns:", error)
    return NextResponse.json({ error: "Failed to fetch columns" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { boardId, title, color } = body

    if (!boardId || !title) {
      return NextResponse.json({ error: "boardId and title are required" }, { status: 400 })
    }

    const lastCol = await prisma.projectColumn.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const column = await prisma.projectColumn.create({
      data: {
        boardId,
        title,
        color: color || "#6366f1",
        order: (lastCol?.order ?? -1) + 1,
      },
    })
    return NextResponse.json({ column }, { status: 201 })
  } catch (error) {
    console.error("Error creating column:", error)
    return NextResponse.json({ error: "Failed to create column" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, color, order } = body

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (color !== undefined) updateData.color = color
    if (order !== undefined) updateData.order = order

    const column = await prisma.projectColumn.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ column })
  } catch (error) {
    console.error("Error updating column:", error)
    return NextResponse.json({ error: "Failed to update column" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    // Check if column has tasks
    const col = await prisma.projectColumn.findUnique({
      where: { id },
      include: { _count: { select: { tasks: true } } },
    })

    if (col && col._count.tasks > 0) {
      return NextResponse.json({
        error: `Column "${col.title}" has ${col._count.tasks} tasks. Move them first.`,
      }, { status: 400 })
    }

    await prisma.projectColumn.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting column:", error)
    return NextResponse.json({ error: "Failed to delete column" }, { status: 500 })
  }
}
