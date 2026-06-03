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

    // Get all counts
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      pendingSellers,
      pendingProducts,
      approvedSellers,
      approvedProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.seller.count(),
      prisma.product.count(),
      prisma.seller.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { status: 'PENDING' } }),
      prisma.seller.count({ where: { status: 'APPROVED' } }),
      prisma.product.count({ where: { status: 'APPROVED' } })
    ])

    // Calculate total revenue (10% commission on all approved products)
    const approvedProductsData = await prisma.product.findMany({
      where: { status: 'APPROVED' },
      select: { price: true }
    })

    const totalRevenue = approvedProductsData.reduce((sum, product) => {
      return sum + (product.price * 0.10) // 10% commission
    }, 0)

    const stats = {
      totalUsers,
      totalSellers,
      totalProducts,
      pendingSellers,
      pendingProducts,
      approvedSellers,
      approvedProducts,
      totalRevenue: Math.round(totalRevenue * 100) / 100 // Round to 2 decimal places
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Error fetching admin statistics' },
      { status: 500 }
    )
  }
} 