import { NextResponse } from "next/server"

export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = { success: false; error: string; details?: unknown }

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data } satisfies ApiSuccess<T>, {
    status,
  })
}

export function fail(error: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error, details } satisfies ApiError,
    { status }
  )
}
