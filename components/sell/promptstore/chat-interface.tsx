"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useSellerDraftStore } from "@/lib/seller-draft-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const STARTER_PROMPTS = [
  "I want to sell an AI Resume Builder for job seekers",
  "Create a template library with Figma design components",
  "Launch a SaaS tool for project management",
  "Start a course on React development",
  "Offer UX design consulting services",
  "Build a community for digital creators",
]

export function ChatInterface() {
  const [userInput, setUserInput] = useState("")
  const [showStarters, setShowStarters] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const {
    draftId,
    setDraftId,
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    isSending,
    setIsSending,
    draft,
    setDraft,
    setStage,
  } = useSellerDraftStore()

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || isSending) return

    setShowStarters(false)
    setUserInput("")
    setIsSending(true)

    // Add user message immediately
    addMessage("user", text)

    try {
      const response = await fetch("/api/seller/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          draftId,
          conversationHistory: messages,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Chat failed")
      }

      const data = await response.json()

      if (data.success) {
        // Update draft ID on first message
        if (!draftId) {
          setDraftId(data.draft.id)
        }

        // Update store with AI response
        setDraft(data.draft)
        setStage(data.conversation.stage)

        // Add AI response
        addMessage("assistant", data.aiResponse.nextQuestion || "✓ Product structure updated!")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send message")
      // Remove the user message if there was an error
      // We can improve this UX later
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6 space-y-4">
        <div className="space-y-4">
          {messages.length === 0 && showStarters ? (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Describe Your Product</h2>
                <p className="text-slate-600">
                  Tell our AI what you want to sell in natural language.
                </p>
              </div>

              <div className="space-y-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isSending}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <p className="text-sm font-medium">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white border border-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.role === "user" ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-200 p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(userInput)
          }}
          className="flex gap-2"
        >
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me anything about your product..."
            disabled={isSending}
            className="text-sm"
          />
          <Button
            type="submit"
            disabled={isSending || !userInput.trim()}
            size="sm"
            className="gap-2"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
