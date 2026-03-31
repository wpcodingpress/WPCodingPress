import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { 
      bankName, accountName, accountNumber, sortCode, iban, swift, 
      bankAddress, country, currency, instructions, isActive 
    } = body

    const bankSettings = await prisma.bankSettings.update({
      where: { id },
      data: {
        ...(bankName !== undefined && { bankName }),
        ...(accountName !== undefined && { accountName }),
        ...(accountNumber !== undefined && { accountNumber }),
        ...(sortCode !== undefined && { sortCode }),
        ...(iban !== undefined && { iban }),
        ...(swift !== undefined && { swift }),
        ...(bankAddress !== undefined && { bankAddress }),
        ...(country !== undefined && { country }),
        ...(currency !== undefined && { currency }),
        ...(instructions !== undefined && { instructions }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json(bankSettings)
  } catch (error) {
    console.error("Error updating bank settings:", error)
    return NextResponse.json({ error: "Failed to update bank settings" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    await prisma.bankSettings.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bank settings:", error)
    return NextResponse.json({ error: "Failed to delete bank settings" }, { status: 500 })
  }
}