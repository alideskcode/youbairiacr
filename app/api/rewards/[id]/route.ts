import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use Supabase auth instead.' },
    { status: 401 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use Supabase auth instead.' },
    { status: 401 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use Supabase auth instead.' },
    { status: 401 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use Supabase auth instead.' },
    { status: 401 }
  );
}
