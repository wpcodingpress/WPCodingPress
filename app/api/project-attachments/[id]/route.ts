import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { readFile, access } from "fs/promises"
import path from "path"
import { constants } from "fs"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const attachment = await prisma.taskAttachment.findUnique({
      where: { id },
    })

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    const filePaths = [
      path.join(process.cwd(), "public", attachment.fileUrl),
      path.join(process.cwd(), "uploads", attachment.fileUrl),
      path.join(process.cwd(), "public", "uploads", "projects", attachment.taskId, attachment.fileName),
    ]

    let filePath = filePaths[0]
    let fileFound = false
    for (const fp of filePaths) {
      try {
        await access(fp, constants.R_OK)
        filePath = fp
        fileFound = true
        break
      } catch {
        continue
      }
    }

    if (!fileFound) {
      return NextResponse.json({
        error: "This file was lost during the last deployment. Please ask the user to re-upload it.",
      }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": attachment.fileType,
        "Content-Disposition": `attachment; filename="${attachment.fileName}"`,
        "Content-Length": String(attachment.fileSize),
      },
    })
  } catch (error) {
    console.error("Error downloading attachment:", error)
    return NextResponse.json({
      error: "This file was lost during the last deployment. Please ask the user to re-upload it.",
    }, { status: 404 })
  }
}
