import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('[Admin Product API] Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', details: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('[Admin Product API] Updating product:', id, body)

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name ?? existingProduct.name,
        slug: body.slug ? String(body.slug).toLowerCase().replace(/\s+/g, '-') : existingProduct.slug,
        description: body.description ?? existingProduct.description,
        shortDesc: body.shortDesc !== undefined ? (body.shortDesc || null) : existingProduct.shortDesc,
        type: body.type ?? existingProduct.type,
        images: body.images !== undefined ? (body.images || null) : existingProduct.images,
        price: body.price !== undefined ? (body.price ? Number(body.price) : 0) : existingProduct.price,
        features: body.features !== undefined ? (body.features || null) : existingProduct.features,
        freeDownloadUrl: body.freeDownloadUrl !== undefined ? (body.freeDownloadUrl || null) : existingProduct.freeDownloadUrl,
        proDownloadUrl: body.proDownloadUrl !== undefined ? (body.proDownloadUrl || null) : existingProduct.proDownloadUrl,
        isActive: body.isActive !== undefined ? body.isActive : existingProduct.isActive,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existingProduct.isFeatured,
        order: body.order !== undefined ? body.order : existingProduct.order,
      }
    })

    console.log('[Admin Product API] Product updated:', product.id, product.name)
    return NextResponse.json(product)
  } catch (error) {
    console.error('[Admin Product API] Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', details: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[Admin Product API] Deleting product:', id)

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id }
    })

    console.log('[Admin Product API] Product deleted:', id)
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('[Admin Product API] Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product', details: String(error) },
      { status: 500 }
    )
  }
}