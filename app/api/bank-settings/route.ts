import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only admin can access bank settings
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bankSettings = await prisma.bankSettings.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // If no settings exist, return empty array
    return NextResponse.json(bankSettings || [])
  } catch (error) {
    console.error("Error fetching bank settings:", error)
    return NextResponse.json({ error: "Failed to fetch bank settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only admin can access bank settings
    if (!session?.user || session.user.role !== 'admin') {
      console.log("Unauthorized access attempt to bank-settings POST")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Admin session confirmed:", session.user.email)

    const body = await request.json()
    console.log("Received body:", body)

    const { 
      bankName, accountName, accountNumber, sortCode, iban, swift, 
      bankAddress, country, currency, instructions, isActive 
    } = body

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json({ error: "Bank name, account name, and account number are required" }, { status: 400 })
    }

    // Create new bank settings
    const bankSettings = await prisma.bankSettings.create({
      data: {
        bankName: bankName || "",
        accountName: accountName || "",
        accountNumber: accountNumber || "",
        sortCode: sortCode || "",
        iban: iban || "",
        swift: swift || "",
        bankAddress: bankAddress || "",
        country: country || "",
        currency: currency || "USD",
        instructions: instructions || "",
        isActive: isActive !== false
      }
    })

    console.log("Bank settings created:", bankSettings.id)
    return NextResponse.json(bankSettings, { status: 201 })
  } catch (error: any) {
    console.error("Error creating bank settings:", error.message)
    return NextResponse.json({ error: "Failed to create bank settings: " + error.message }, { status: 500 })
  }
}