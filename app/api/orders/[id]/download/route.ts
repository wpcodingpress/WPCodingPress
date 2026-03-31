import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: orderId } = await params

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        product: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.downloadCount >= order.downloadLimit) {
      return NextResponse.json({ 
        error: 'Download limit reached',
        downloadCount: order.downloadCount,
        downloadLimit: order.downloadLimit
      }, { status: 403 })
    }

    let downloadUrl: string | null = null

    if (order.planType === 'free' && order.product?.freeDownloadUrl) {
      downloadUrl = order.product.freeDownloadUrl
    } else if (order.planType === 'pro' && order.product?.proDownloadUrl) {
      downloadUrl = order.product.proDownloadUrl
    }

    if (!downloadUrl) {
      return NextResponse.json({ error: 'No download URL available' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        downloadCount: order.downloadCount + 1,
        lastDownloadedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      downloadUrl,
      downloadCount: updatedOrder.downloadCount,
      downloadLimit: updatedOrder.downloadLimit
    })

  } catch (error) {
    console.error('Error processing download:', error)
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 })
  }
}