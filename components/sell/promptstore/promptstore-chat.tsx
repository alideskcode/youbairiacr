"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  Send,
  Sparkles,
  Bot,
  User,
  AlertCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { authHeaders } from "@/lib/supabase/auth-headers"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { AICreateResponse, ChatMessage } from "@/lib/types/ai-create"

const STARTERS = [
  "Create a clipping campaign for David Dobrik",
  "Create a prompt pack for Shopify stores",
  "Launch a TikTok clipping campaign for a fitness brand",
  "Build an AI writing prompts bundle for marketers",
]

type Props = {
  onDraft: (draft: AICreateResponse | null) => void
  isAuthenticated: boolean
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function PromptstoreChat({ onDraft, isAuthenticated }: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streaming, scrollToBottom])

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return

    if (!isAuthenticated) {
      router.push("/login?callbackUrl=/sell/promptstore")
      return
    }

    setError(null)
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setStreaming(true)

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content:
        m.role === "assistant" && m.draft?.message ? m.draft.message : m.content,
    }))

    try {
      const headers = await authHeaders()
      const res = await fetch("/api/ai/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: text.trim(), history }),
      })

      if (res.status === 401) {
        setError("Session expired. Please sign in again.")
        router.push("/login?callbackUrl=/sell/promptstore")
        return
      }

      if (res.status === 429) {
        const json = await res.json()
        setError(json.error ?? "Too many requests. Wait a minute and try again.")
        return
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? `Request failed (${res.status})`)
      }

      if (!res.body) throw new Error("No response stream")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let sseBuffer = ""
      let draft: AICreateResponse | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        sseBuffer += decoder.decode(value, { stream: true })
        const parts = sseBuffer.split("\n\n")
        sseBuffer = parts.pop() ?? ""

        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith("data: ")) continue

          const event = JSON.parse(line.slice(6)) as {
            type: string
            content?: string
            data?: AICreateResponse
            error?: string
          }

          if (event.type === "error") {
            throw new Error(event.error ?? "AI error")
          }
          if (event.type === "done" && event.data) {
            draft = event.data
          }
        }
      }

      if (!draft) throw new Error("AI did not return structured data. Try again.")

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: draft.message,
        timestamp: Date.now(),
        draft,
      }

      setMessages((prev) => [...prev, assistantMsg])
      onDraft(draft)
    } catch (err) {
      console.error("AI chat error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Create with AI
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Describe a clipping campaign or digital product. AI will generate
                a preview you can save to Supabase.
              </p>

              {!isAuthenticated && (
                <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
                  <Link href="/login?callbackUrl=/sell/promptstore" className="font-medium underline">
                    Sign in
                  </Link>{" "}
                  to start chatting
                </div>
              )}

              <div className="mt-8 grid w-full max-w-lg gap-2">
                {STARTERS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={streaming}
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-all hover:border-primary/40 hover:bg-muted/60 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "border border-border bg-card shadow-sm rounded-tl-sm"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {streaming && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating your {messages.length ? "update" : "creation"}...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void sendMessage(input)
              }
            }}
            placeholder={
              isAuthenticated
                ? "Create a clipping campaign for..."
                : "Sign in to start creating..."
            }
            disabled={streaming}
            rows={1}
            className="min-h-[48px] max-h-36 resize-none rounded-xl"
          />
          <Button
            type="button"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-xl"
            disabled={streaming || !input.trim()}
            onClick={() => void sendMessage(input)}
          >
            {streaming ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
