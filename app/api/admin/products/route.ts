import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDesc: true,
        type: true,
        price: true,
        images: true,
        isActive: true,
        isFeatured: true,
        order: true,
        createdAt: true,
        freeDownloadUrl: true,
        proDownloadUrl: true,
        features: true,
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Creating product with body:', JSON.stringify(body, null, 2))
    
    const { 
      name, slug, description, shortDesc, type, images, price,
      features, freeDownloadUrl, proDownloadUrl, documentation, isActive, isFeatured, order 
    } = body

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: 'Name, slug, and description are required' },
        { status: 400 }
      )
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: String(name),
        slug: String(slug),
        description: String(description),
        shortDesc: shortDesc || null,
        type: type || 'plugin',
        images: images || null,
        price: price ? Number(price) : 0,
        features: features || null,
        freeDownloadUrl: freeDownloadUrl || null,
        proDownloadUrl: proDownloadUrl || null,
        documentation: documentation || null,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        order: order || 0,
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product: ' + String(error) },
      { status: 500 }
    )
  }
}