import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getDisplayName } from "@/lib/project-management"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get("boardId")
    const columnId = searchParams.get("columnId")

    const where: any = {}
    if (boardId) where.boardId = boardId
    if (columnId) where.columnId = columnId

    const tasks = await prisma.projectTask.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        comments: { orderBy: { createdAt: "desc" }, take: 3 },
        attachments: true,
        checklists: { orderBy: { order: "asc" } },
        assignees: true,
        column: { select: { id: true, title: true, color: true } },
      },
    })
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { boardId, columnId, title, description, priority, dueDate, estimatedHours } = body

    if (!boardId || !columnId || !title) {
      return NextResponse.json({ error: "boardId, columnId, and title are required" }, { status: 400 })
    }

    // Get the max order in the column
    const lastTask = await prisma.projectTask.findFirst({
      where: { columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const task = await prisma.projectTask.create({
      data: {
        boardId,
        columnId,
        title,
        description: description || null,
        priority: priority || "medium",
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        order: (lastTask?.order ?? -1) + 1,
      },
      include: {
        comments: true,
        attachments: true,
        checklists: true,
        assignees: true,
        column: { select: { id: true, title: true, color: true } },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId,
        taskId: task.id,
        userId: session.user.id,
        userName: getDisplayName(session.user),
        action: "task_created",
        details: `Created task "${title}"`,
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tasks } = body

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "tasks array is required" }, { status: 400 })
    }

    // Bulk update for drag-drop reorder
    const updates = tasks.map((t: { id: string; columnId?: string; order: number }) =>
      prisma.projectTask.update({
        where: { id: t.id },
        data: {
          ...(t.columnId ? { columnId: t.columnId } : {}),
          order: t.order,
        },
      })
    )
    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error bulk updating tasks:", error)
    return NextResponse.json({ error: "Failed to update tasks" }, { status: 500 })
  }
}
