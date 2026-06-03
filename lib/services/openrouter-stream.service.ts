import OpenAI from "openai"
import { AI_SYSTEM_PROMPT, parseAIResponse } from "@/lib/services/ai-create.service"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export type StreamEvent =
  | { type: "delta"; content: string }
  | { type: "done"; data: ReturnType<typeof parseAIResponse> extends infer T ? T : never }
  | { type: "error"; error: string }

export async function streamAICreation(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  onEvent: (event: StreamEvent) => void
): Promise<void> {
  if (!process.env.OPENROUTER_API_KEY) {
    onEvent({ type: "error", error: "OPENROUTER_API_KEY is not configured" })
    return
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: AI_SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ]

  try {
    const stream = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.3,
      stream: true,
      response_format: { type: "json_object" },
      messages,
    })

    let full = ""

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? ""
      if (text) {
        full += text
        onEvent({ type: "delta", content: text })
      }
    }

    let data
    try {
      data = parseAIResponse(full)
    } catch (parseErr) {
      onEvent({
        type: "error",
        error: parseErr instanceof Error ? parseErr.message : "Failed to parse AI response",
      })
      return
    }
    onEvent({ type: "done", data })
  } catch (err) {
    onEvent({
      type: "error",
      error: err instanceof Error ? err.message : "AI request failed",
    })
  }
}
