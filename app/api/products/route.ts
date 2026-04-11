import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 100
    })
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching products:', error?.message || error)
    return NextResponse.json(
      { error: 'Database error', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}