import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      shopName,
      shopUrl,
      description,
      category,
      contactEmail,
      website,
      socialLinks,
      userId
    } = body

    // Validate required fields
    if (!shopName || !shopUrl || !description || !category || !contactEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if shop URL already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { shopUrl }
    })

    if (existingSeller) {
      return NextResponse.json(
        { error: 'Shop URL already exists. Please choose a different shop name.' },
        { status: 409 }
      )
    }

    // Check if user already has a seller profile
    const existingUserSeller = await prisma.seller.findUnique({
      where: { userId }
    })

    if (existingUserSeller) {
      return NextResponse.json(
        { error: 'User already has a seller profile' },
        { status: 409 }
      )
    }

    // Create seller profile
    const seller = await prisma.seller.create({
      data: {
        shopName,
        shopUrl,
        description,
        category,
        contactEmail,
        website,
        socialLinks,
        userId,
        status: 'PENDING', // Initial status
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(seller)
  } catch (error) {
    console.error('Error creating seller:', error)
    return NextResponse.json(
      { error: 'Error creating seller profile' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const shopUrl = searchParams.get('shopUrl')

    if (!userId && !shopUrl) {
      return NextResponse.json(
        { error: 'User ID or Shop URL is required' },
        { status: 400 }
      )
    }

    let seller
    if (shopUrl) {
      seller = await prisma.seller.findUnique({
        where: { shopUrl }
      })
    } else {
      seller = await prisma.seller.findUnique({
        where: { userId }
      })
    }

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(seller)
  } catch (error) {
    console.error('Error fetching seller:', error)
    return NextResponse.json(
      { error: 'Error fetching seller profile' },
      { status: 500 }
    )
  }
} 