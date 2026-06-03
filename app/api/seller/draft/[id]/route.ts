import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const updates = await req.json()

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get draft
    const draft = await prisma.productDraft.findUnique({
      where: { id },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check authorization
    if (draft.sellerId !== user.id) {
      const seller = await prisma.seller.findUnique({
        where: { userId: user.id },
      })

      if (!seller || draft.sellerId !== seller.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    // Update draft - allow specific fields only
    const allowedFields = [
      "title",
      "shortDescription",
      "longDescription",
      "category",
      "tags",
      "price",
      "deliveryType",
      "benefits",
      "features",
      "targetAudience",
      "requirements",
      "faqs",
      "productImage",
    ]

    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    )

    const updatedDraft = await prisma.productDraft.update({
      where: { id },
      data: {
        ...safeUpdates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      draft: updatedDraft,
    })
  } catch (error) {
    console.error("Draft Update Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get seller
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id },
    })

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 })
    }

    // Get draft with conversation
    const draft = await prisma.productDraft.findFirst({
      where: {
        id,
        sellerId: seller.id,
      },
      include: {
        conversationThread: true,
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      draft,
    })
  } catch (error) {
    console.error("Draft Fetch Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Fetch failed",
      },
      { status: 500 }
    )
  }
}
