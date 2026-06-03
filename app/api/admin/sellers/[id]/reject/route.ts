import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const seller = await prisma.seller.update({
      where: { id: id },
      data: {
        status: 'REJECTED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json(seller)
  } catch (error) {
    console.error('Error rejecting seller:', error)
    return NextResponse.json(
      { error: 'Error rejecting seller' },
      { status: 500 }
    )
  }
} 