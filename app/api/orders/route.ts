import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, companyName, city, phone, email, productId } = body

    // Validate required fields
    if (!name || !city || !phone || !email || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        name,
        companyName,
        city,
        phone,
        email,
        productId,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Delete the order
    await prisma.order.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    const { status } = await request.json()
    
    if (!status || !['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      )
    }
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    })
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    const orders = await prisma.order.findMany({
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (format === 'csv') {
      const csv = [
        'Order ID,Customer Name,Company,City,Phone,Email,Product,Price,Status,Date',
        ...orders.map(order => [
          order.id,
          order.name,
          order.companyName || '',
          order.city,
          order.phone,
          order.email,
          order.product.name,
          order.product.price,
          order.status,
          order.createdAt.toISOString(),
        ].join(','))
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=orders.csv',
        },
      })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Order retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    )
  }
} 