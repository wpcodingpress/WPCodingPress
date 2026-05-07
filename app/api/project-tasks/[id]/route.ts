import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: taskId } = await params
    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      include: {
        comments: { orderBy: { createdAt: "desc" } },
        attachments: { orderBy: { createdAt: "desc" } },
        checklists: { orderBy: { order: "asc" } },
        assignees: true,
        column: { select: { id: true, title: true, color: true } },
        board: { select: { id: true, title: true } },
        activity: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: taskId } = await params
    const body = await request.json()

    const existingTask = await prisma.projectTask.findUnique({
      where: { id: taskId },
      select: { boardId: true, title: true, columnId: true },
    })
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updateData: any = {}
    const changes: string[] = []

    if (body.title !== undefined && body.title !== existingTask.title) {
      updateData.title = body.title
      changes.push(`Renamed to "${body.title}"`)
    }
    if (body.description !== undefined) {
      updateData.description = body.description
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority
      changes.push(`Priority set to ${body.priority}`)
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
      if (body.dueDate) changes.push(`Due date set to ${new Date(body.dueDate).toLocaleDateString()}`)
    }
    if (body.estimatedHours !== undefined) {
      updateData.estimatedHours = body.estimatedHours ? parseFloat(body.estimatedHours) : null
    }
    if (body.columnId !== undefined && body.columnId !== existingTask.columnId) {
      updateData.columnId = body.columnId
      const newCol = await prisma.projectColumn.findUnique({
        where: { id: body.columnId },
        select: { title: true },
      })
      changes.push(`Moved to ${newCol?.title || "another column"}`)

      // Update order: place at end of new column
      const lastTask = await prisma.projectTask.findFirst({
        where: { columnId: body.columnId },
        orderBy: { order: "desc" },
        select: { order: true },
      })
      updateData.order = (lastTask?.order ?? -1) + 1
    }

    if (changes.length === 0 && Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No changes detected" })
    }

    const task = await prisma.projectTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        comments: true,
        attachments: true,
        checklists: true,
        assignees: true,
        column: { select: { id: true, title: true, color: true } },
      },
    })

    if (changes.length > 0) {
      await prisma.activityLog.create({
        data: {
          boardId: existingTask.boardId,
          taskId,
          userId: session.user.id,
          userName: session.user.name || "Unknown",
          action: "task_updated",
          details: changes.join(", "),
        },
      })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: taskId } = await params
    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      select: { boardId: true, title: true },
    })
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.projectTask.delete({ where: { id: taskId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
