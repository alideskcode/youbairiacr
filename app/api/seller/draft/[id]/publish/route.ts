import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function POST(
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

    // Get draft
    const draft = await prisma.productDraft.findFirst({
      where: {
        id,
        sellerId: seller.id,
      },
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Validate required fields
    const requiredFields = ["title", "shortDescription", "longDescription", "category", "price"]
    const missingFields = requiredFields.filter((field) => !Boolean((draft as any)[field]))

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 }
      )
    }

    // Create product from draft
    const product = await prisma.product.create({
      data: {
        title: draft.title!,
        description: draft.longDescription || "",
        shortDescription: draft.shortDescription || "",
        longDescription: draft.longDescription || "",
        price: draft.price || 0,
        category: draft.category || "",
        tags: draft.tags,
        image: draft.productImage || "/placeholder.jpg",
        sellerId: seller.id,
        status: "PENDING", // Requires admin approval
      },
    })

    // Update draft status
    const updatedDraft = await prisma.productDraft.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })

    // Archive conversation
    if (draft.conversationThreadId) {
      await prisma.conversationThread.update({
        where: { id: draft.conversationThreadId },
        data: { status: "ARCHIVED" },
      })
    }

    return NextResponse.json({
      success: true,
      product,
      draft: updatedDraft,
      message: "Product published successfully! It's pending admin approval.",
    })
  } catch (error) {
    console.error("Publish Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Publish failed",
      },
      { status: 500 }
    )
  }
}
