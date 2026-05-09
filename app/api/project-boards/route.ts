import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getInitialBoardData, getDisplayName } from "@/lib/project-management"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get("subscriptionId")

    if (subscriptionId) {
      const board = await prisma.projectBoard.findUnique({
        where: { subscriptionId },
        include: {
          columns: {
            orderBy: { order: "asc" },
            include: { _count: { select: { tasks: true } } },
          },
          tasks: {
            orderBy: { order: "asc" },
            include: {
              comments: { orderBy: { createdAt: "desc" }, take: 3 },
              attachments: true,
              checklists: { orderBy: { order: "asc" } },
              assignees: true,
              activity: { orderBy: { createdAt: "desc" }, take: 5 },
            },
          },
          activity: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      })
      if (!board) {
        return NextResponse.json({ board: null, needsSetup: true })
      }
      return NextResponse.json({ board })
    }

    // Get all boards for the user
    const userBoards = await prisma.projectBoard.findMany({
      where: {
        subscription: { userId: session.user.id },
      },
      include: {
        columns: { orderBy: { order: "asc" } },
        _count: { select: { tasks: true } },
      },
    })
    return NextResponse.json({ boards: userBoards })
  } catch (error) {
    console.error("Error fetching boards:", error)
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subscriptionId, onboardingFormId } = body

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 })
    }

    const existing = await prisma.projectBoard.findUnique({
      where: { subscriptionId },
    })
    if (existing) {
      return NextResponse.json({ board: existing, error: "Board already exists" }, { status: 409 })
    }

    const boardData = getInitialBoardData(subscriptionId, onboardingFormId)
    const board = await prisma.projectBoard.create({
      data: boardData,
      include: {
        columns: { orderBy: { order: "asc" } },
      },
    })

    // Log PM assignment activity
    if (boardData.projectManagerName) {
      await prisma.activityLog.create({
        data: {
          boardId: board.id,
          userId: session.user.id,
          userName: getDisplayName(session.user),
          action: "task_created",
          details: `🎉 Project Manager ${boardData.projectManagerName} has been assigned to your project`,
        },
      })
    }

    return NextResponse.json({ board }, { status: 201 })
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 })
  }
}
