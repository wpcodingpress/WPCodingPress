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
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 })
    }

    const comments = await prisma.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, content } = body

    if (!taskId || !content) {
      return NextResponse.json({ error: "taskId and content are required" }, { status: 400 })
    }

    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      select: { boardId: true, title: true },
    })
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        userId: session.user.id,
        userName: getDisplayName(session.user),
        userAvatar: null,
        content,
      },
    })

    await prisma.activityLog.create({
      data: {
        boardId: task.boardId,
        taskId,
        userId: session.user.id,
        userName: getDisplayName(session.user),
        action: "comment_added",
        details: `Added comment on "${task.title}"`,
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
