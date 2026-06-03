import { NextResponse } from 'next/server'

// NextAuth route removed - using Supabase auth instead
export async function GET(request: Request) {
  return NextResponse.json(
    { error: 'This endpoint is no longer used. Use Supabase authentication instead.' },
    { status: 410 }
  )
}

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'This endpoint is no longer used. Use Supabase authentication instead.' },
    { status: 410 }
  )
}
