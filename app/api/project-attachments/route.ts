import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/project-management"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const taskId = formData.get("taskId") as string | null

    if (!file || !taskId) {
      return NextResponse.json({ error: "file and taskId are required" }, { status: 400 })
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `File type "${file.type}" is not allowed. Accepted: ${ALLOWED_FILE_TYPES.join(", ")}`,
      }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size of 50MB" }, { status: 400 })
    }

    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      select: { boardId: true, title: true },
    })
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Save file locally
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects", taskId)
    await mkdir(uploadsDir, { recursive: true })

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const timestamp = Date.now()
    const fileName = `${timestamp}-${sanitizedName}`
    const filePath = path.join(uploadsDir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const fileUrl = `/uploads/projects/${taskId}/${fileName}`

    const attachment = await prisma.taskAttachment.create({
      data: {
        taskId,
        userId: session.user.id,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
      },
    })

    return NextResponse.json({ attachment }, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
