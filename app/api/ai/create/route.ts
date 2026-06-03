import { NextRequest } from "next/server"
import { getAuthContext } from "@/lib/auth/campaign-auth"
import { aiCreateRequestSchema } from "@/lib/validators/ai-create"
import { streamAICreation } from "@/lib/services/openrouter-stream.service"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const bearerToken = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null
  const auth = await getAuthContext(bearerToken)
  if (!auth) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const limited = rateLimit(`ai-create:${auth.userId}`, 10, 60_000)
  if (!limited.ok) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Try again in a minute.",
        resetAt: limited.resetAt,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(limited.remaining),
          "X-RateLimit-Reset": String(limited.resetAt),
        },
      }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const parsed = aiCreateRequestSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.errors[0]?.message ?? "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      await streamAICreation(
        parsed.data.message,
        parsed.data.history,
        (event) => {
          send(event)
          if (event.type === "done" || event.type === "error") {
            controller.close()
          }
        }
      )
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
