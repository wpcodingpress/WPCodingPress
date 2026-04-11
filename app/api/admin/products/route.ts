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
  let body: any = null;
  
  try {
    body = await request.json()
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

    const product = await prisma.product.create({
      data: {
        name: String(name),
        slug: String(slug).toLowerCase().replace(/\s+/g, '-'),
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

  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.code === 'P2002' && body) {
      const slugValue = String(body.slug).toLowerCase().replace(/\s+/g, '-')
      await prisma.product.delete({
        where: { slug: slugValue }
      })
      
      const retryProduct = await prisma.product.create({
        data: {
          name: String(body.name),
          slug: slugValue,
          description: String(body.description),
          shortDesc: body.shortDesc || null,
          type: body.type || 'plugin',
          images: body.images || null,
          price: body.price ? Number(body.price) : 0,
          features: body.features || null,
          freeDownloadUrl: body.freeDownloadUrl || null,
          proDownloadUrl: body.proDownloadUrl || null,
          isActive: body.isActive ?? true,
          isFeatured: body.isFeatured ?? false,
          order: body.order || 0,
        }
      })
      return NextResponse.json(retryProduct, { status: 201 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create product: ' + String(error) },
      { status: 500 }
    )
  }
}