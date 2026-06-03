import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  requireAdminUser,
  unauthorizedResponse,
} from "@/lib/api/admin-campaigns"

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const status = req.nextUrl.searchParams.get("status")
    const where = status && status !== "all" ? { status } : {}

    const payouts = await prisma.payout.findMany({
      where,
      include: {
        submission: {
          include: {
            task: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: { name: true, email: true },
                    },
                  },
                },
              },
            },
          },
        },
        marketer: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ payouts })
  } catch (error) {
    console.error("Error fetching payouts:", error)
    return NextResponse.json(
      {
        error:
          "Failed to fetch payouts. Ensure DATABASE_URL is configured and Prisma migrations are applied.",
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { submissionId } = await req.json()

    if (!submissionId) {
      return NextResponse.json({ error: "submissionId is required" }, { status: 400 })
    }

    const submission = await prisma.contentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        task: true,
        payout: true,
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    if (submission.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Only approved submissions can be paid out" },
        { status: 400 }
      )
    }

    if (submission.payout) {
      return NextResponse.json(
        { error: "Payout already exists for this submission" },
        { status: 409 }
      )
    }

    const dbAdmin = await prisma.user.findUnique({
      where: { email: admin.email! },
    })

    if (!dbAdmin) {
      return NextResponse.json(
        {
          error:
            "Admin user not found in the database. Create a matching Prisma user for this email.",
        },
        { status: 400 }
      )
    }

    const payout = await prisma.payout.create({
      data: {
        submissionId: submission.id,
        marketerId: submission.marketerId,
        userId: dbAdmin.id,
        amount: submission.task.budget,
        status: "COMPLETED",
        paymentMethod: "PAYTM_UPI",
        processedAt: new Date(),
      },
    })

    return NextResponse.json({ payout }, { status: 201 })
  } catch (error) {
    console.error("Error processing payout:", error)
    return NextResponse.json({ error: "Failed to process payout" }, { status: 500 })
  }
}
