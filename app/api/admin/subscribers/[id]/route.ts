import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { plan, status } = body

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(plan && { plan }),
        ...(status && { status })
      }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const sub = await prisma.subscription.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!sub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      const board = await tx.projectBoard.findUnique({
        where: { subscriptionId: id },
        select: { id: true },
      })

      if (board) {
        await tx.taskAssignee.deleteMany({ where: { task: { boardId: board.id } } })
        await tx.taskChecklistItem.deleteMany({ where: { task: { boardId: board.id } } })
        await tx.taskAttachment.deleteMany({ where: { task: { boardId: board.id } } })
        await tx.taskComment.deleteMany({ where: { task: { boardId: board.id } } })
        await tx.activityLog.deleteMany({ where: { boardId: board.id } })
        await tx.activityLog.deleteMany({ where: { task: { boardId: board.id } } })
        await tx.projectTask.deleteMany({ where: { boardId: board.id } })
        await tx.projectColumn.deleteMany({ where: { boardId: board.id } })
        await tx.projectBoard.delete({ where: { id: board.id } })
      }

      await tx.onboardingForm.deleteMany({ where: { subscriptionId: id } })
      await tx.subscription.delete({ where: { id } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 })
  }
}