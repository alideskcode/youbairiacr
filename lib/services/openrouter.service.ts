import OpenAI from "openai"
import type { AIGeneratedCampaign } from "@/lib/types/campaign"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

const SYSTEM_PROMPT = `You are a content rewards campaign strategist.
Return ONLY valid JSON with this schema:
{
  "description": "string (2-4 paragraphs)",
  "requirements": ["string"],
  "hashtags": ["string"],
  "hooks": ["string"],
  "audience_suggestions": ["string"],
  "category": "string"
}
No markdown. No code fences.`

export async function generateCampaignContent(
  title: string,
  topic?: string
): Promise<AIGeneratedCampaign> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured")
  }

  const userPrompt = topic
    ? `Campaign title: ${title}\nTopic/focus: ${topic}`
    : `Campaign title: ${title}`

  const completion = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  })

  const content = completion.choices?.[0]?.message?.content?.trim()
  if (!content) throw new Error("Empty AI response")

  const cleaned = content.replace(/^```json\s*/i, "").replace(/```\s*$/i, "")
  const parsed = JSON.parse(cleaned) as AIGeneratedCampaign

  if (!parsed.description || !Array.isArray(parsed.requirements)) {
    throw new Error("AI returned invalid campaign structure")
  }

  return {
    description: parsed.description,
    requirements: parsed.requirements ?? [],
    hashtags: parsed.hashtags ?? [],
    hooks: parsed.hooks ?? [],
    audience_suggestions: parsed.audience_suggestions ?? [],
    category: parsed.category ?? "General",
  }
}
