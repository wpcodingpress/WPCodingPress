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
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 })
    }

    const checklists = await prisma.taskChecklistItem.findMany({
      where: { taskId },
      orderBy: { order: "asc" },
    })
    return NextResponse.json({ checklists })
  } catch (error) {
    console.error("Error fetching checklists:", error)
    return NextResponse.json({ error: "Failed to fetch checklists" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, title } = body

    if (!taskId || !title) {
      return NextResponse.json({ error: "taskId and title are required" }, { status: 400 })
    }

    const lastItem = await prisma.taskChecklistItem.findFirst({
      where: { taskId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const item = await prisma.taskChecklistItem.create({
      data: {
        taskId,
        title,
        order: (lastItem?.order ?? -1) + 1,
      },
    })
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error("Error creating checklist item:", error)
    return NextResponse.json({ error: "Failed to create checklist item" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, completed, title } = body

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const updateData: any = {}
    if (completed !== undefined) updateData.completed = completed
    if (title !== undefined) updateData.title = title

    const item = await prisma.taskChecklistItem.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error updating checklist item:", error)
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 })
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

    await prisma.taskChecklistItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting checklist item:", error)
    return NextResponse.json({ error: "Failed to delete checklist item" }, { status: 500 })
  }
}
