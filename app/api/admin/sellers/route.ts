import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const sellers = await prisma.seller.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(sellers)
  } catch (error) {
    console.error('Error fetching sellers:', error)
    return NextResponse.json(
      { error: 'Error fetching sellers' },
      { status: 500 }
    )
  }
} 