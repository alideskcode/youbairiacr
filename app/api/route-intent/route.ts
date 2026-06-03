import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-5-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are Youbairia AI.

Analyze the user's request.

Determine whether they want:

- product
- campaign

Return ONLY valid JSON.

Required schema:

{
  "intent": "product" | "campaign",
  "title": "",
  "description": "",
  "price": "",
  "category": "",
  "tags": []
}

Rules:
- No markdown
- No explanations
- No code blocks
- JSON only
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    console.log("AI RESPONSE:", content);

    if (!content) {
      throw new Error("Empty AI response");
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("JSON Parse Error:", err);

      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          raw: content,
        },
        { status: 500 }
      );
    }

    if (
      parsed.intent !== "product" &&
      parsed.intent !== "campaign"
    ) {
      parsed.intent = "product";
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Intent Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate listing",
      },
      {
        status: 500,
      }
    );
  }
}