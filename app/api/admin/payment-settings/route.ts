import { NextResponse } from "next/server"
import {
  requireAdminUser,
  unauthorizedResponse,
} from "@/lib/api/admin-campaigns"
import { getAdminSupabaseClient } from "@/lib/supabase/admin-db"

const SETTINGS_ID = "default"

export async function GET(req: Request) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      paytmUpiId: data?.paytm_upi_id ?? "",
      merchantName: data?.merchant_name ?? "Digital Marketplace",
      currency: data?.currency ?? "INR",
      updatedAt: data?.updated_at ?? null,
    })
  } catch (error) {
    console.error("Error loading payment settings:", error)
    return NextResponse.json(
      { error: "Failed to load payment settings" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  const admin = await requireAdminUser(req)
  if (!admin) return unauthorizedResponse()

  try {
    const body = await req.json()
    const paytmUpiId = String(body.paytmUpiId ?? "").trim()
    const merchantName = String(body.merchantName ?? "Digital Marketplace").trim()
    const currency = String(body.currency ?? "INR").trim()

    if (!paytmUpiId) {
      return NextResponse.json({ error: "Paytm UPI ID is required" }, { status: 400 })
    }

    const supabase = await getAdminSupabaseClient()
    const { data, error } = await supabase
      .from("payment_settings")
      .upsert({
        id: SETTINGS_ID,
        paytm_upi_id: paytmUpiId,
        merchant_name: merchantName,
        currency,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: "Run supabase/admin-setup.sql in your Supabase SQL editor to create the payment_settings table.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paytmUpiId: data.paytm_upi_id,
      merchantName: data.merchant_name,
      currency: data.currency,
      updatedAt: data.updated_at,
    })
  } catch (error) {
    console.error("Error saving payment settings:", error)
    return NextResponse.json(
      { error: "Failed to save payment settings" },
      { status: 500 }
    )
  }
}
