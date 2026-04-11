import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const order = await prisma.customOrder.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const bankSettings = await prisma.bankSettings.findFirst({
      where: { isActive: true }
    })

    const receiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - WPCodingPress</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
    <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #7c3aed; margin: 0;">WPCodingPress</h1>
        <p style="color: #64748b; margin: 5px 0 0;">Payment Receipt</p>
      </div>
      
      <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 18px;">Project Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Project Name:</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${order.projectName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Service Type:</td>
            <td style="padding: 8px 0; color: #1e293b;">${order.serviceType || 'Custom Project'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Order ID:</td>
            <td style="padding: 8px 0; color: #1e293b; font-family: monospace;">${order.id.slice(0, 8)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Date:</td>
            <td style="padding: 8px 0; color: #1e293b;">${new Date(order.createdAt).toLocaleDateString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 18px;">Client Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Name:</td>
            <td style="padding: 8px 0; color: #1e293b;">${order.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Email:</td>
            <td style="padding: 8px 0; color: #1e293b;">${order.clientEmail}</td>
          </tr>
          ${order.clientPhone ? `<tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; color: #1e293b;">${order.clientPhone}</td></tr>` : ''}
        </table>
      </div>
      
      <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 18px;">Payment Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Total Project Cost:</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 18px;">$${order.totalAmount}</td>
          </tr>
          ${order.advanceAmount > 0 ? `
          <tr>
            <td style="padding: 8px 0; color: #059669;">Advance Payment (${Math.round((order.advanceAmount / order.totalAmount) * 100)}%):</td>
            <td style="padding: 8px 0; color: #059669; font-weight: 600;">$${order.advanceAmount} ${order.advancePaid ? '✓' : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${order.remainingPaid ? '#059669' : '#64748b'};">Remaining Payment (${Math.round((order.remainingAmount / order.totalAmount) * 100)}%):</td>
            <td style="padding: 8px 0; color: ${order.remainingPaid ? '#059669' : '#1e293b'}; font-weight: 600;">$${order.remainingAmount} ${order.remainingPaid ? '✓' : '(Due)'}</td>
          </tr>
          ` : `
          <tr>
            <td style="padding: 8px 0; color: #64748b;">Payment Terms:</td>
            <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">Full payment after completion</td>
          </tr>
          `}
        </table>
      </div>
      
      ${bankSettings ? `
      <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 18px;">Payment Details</h2>
        <p style="color: #64748b; margin-bottom: 15px;">Please make payment to the following bank account:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Bank Name:</td>
            <td style="padding: 6px 0; color: #1e293b;">${bankSettings.bankName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Account Name:</td>
            <td style="padding: 6px 0; color: #1e293b;">${bankSettings.accountName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Account Number:</td>
            <td style="padding: 6px 0; color: #1e293b;">${bankSettings.accountNumber}</td>
          </tr>
          ${bankSettings.swift ? `<tr><td style="padding: 6px 0; color: #64748b;">SWIFT:</td><td style="padding: 6px 0; color: #1e293b;">${bankSettings.swift}</td></tr>` : ''}
        </table>
        ${bankSettings.instructions ? `<p style="color: #64748b; margin-top: 15px; font-style: italic;">${bankSettings.instructions}</p>` : ''}
      </div>
      ` : ''}
      
      <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 30px;">
        <p>Thank you for choosing WPCodingPress!</p>
        <p>For any queries, contact: contact@wpcodingpress.com</p>
      </div>
    </div>
  </body>
</html>
`

    console.log("Sending receipt to:", order.clientEmail)
    console.log("Receipt HTML length:", receiptHtml.length)
    
    await prisma.customOrder.update({
      where: { id },
      data: { 
        receiptSent: true,
        receiptSentAt: new Date()
      }
    })

    return NextResponse.json({ success: true, message: "Receipt generated" })
  } catch (error) {
    console.error("Error sending receipt:", error)
    return NextResponse.json({ error: "Failed to send receipt" }, { status: 500 })
  }
}