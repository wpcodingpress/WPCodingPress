import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { readFile } from "fs/promises"
import path from "path"

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

    const filePath = path.join(process.cwd(), "public", attachment.fileUrl)
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
    return NextResponse.json({ error: "File not found or inaccessible" }, { status: 404 })
  }
}
