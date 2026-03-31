import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get active bank settings (users will see this when making payment)
    const bankSettings = await prisma.bankSettings.findFirst({
      where: { isActive: true }
    })

    // If no bank settings configured, return empty/null
    if (!bankSettings) {
      return NextResponse.json(null)
    }

    // Return only safe fields (hide sensitive info like full account numbers if needed)
    // For now, return all - can be adjusted based on requirements
    return NextResponse.json({
      bankName: bankSettings.bankName,
      accountName: bankSettings.accountName,
      accountNumber: bankSettings.accountNumber,
      sortCode: bankSettings.sortCode,
      iban: bankSettings.iban,
      swift: bankSettings.swift,
      bankAddress: bankSettings.bankAddress,
      country: bankSettings.country,
      currency: bankSettings.currency,
      instructions: bankSettings.instructions
    })
  } catch (error) {
    console.error("Error fetching bank details:", error)
    return NextResponse.json(null)
  }
}