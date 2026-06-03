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

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error approving product:', error)
    return NextResponse.json(
      { error: 'Error approving product' },
      { status: 500 }
    )
  }
} 