import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const bankSettings = await prisma.bankSettings.findFirst({
      where: { isActive: true }
    })
    return NextResponse.json(bankSettings || null)
  } catch (error) {
    console.error("Error fetching bank settings:", error)
    return NextResponse.json(null)
  }
}