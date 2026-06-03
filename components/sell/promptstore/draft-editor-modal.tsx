"use client"

import { useState } from "react"
import { useSellerDraftStore } from "@/lib/seller-draft-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { toast } from "sonner"

type EditableField =
  | "title"
  | "shortDescription"
  | "longDescription"
  | "category"
  | "price"
  | "tags"
  | "benefits"
  | "features"
  | "faqs"
  | "targetAudience"
  | "requirements"

export function DraftEditorModal({
  field,
  onClose,
}: {
  field: EditableField
  onClose: () => void
}) {
  const { draft, updateDraftField, draftId } = useSellerDraftStore()
  const [isOpen, setIsOpen] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fieldLabels: Record<EditableField, string> = {
    title: "Product Title",
    shortDescription: "Short Description",
    longDescription: "Long Description",
    category: "Category",
    price: "Price",
    tags: "Tags",
    benefits: "Key Benefits",
    features: "Features",
    faqs: "FAQ Items",
    targetAudience: "Target Audience",
    requirements: "Requirements",
  }

  async function handleSave(newValue: any) {
    try {
      setIsSaving(true)

      // Update local store
      updateDraftField(field as any, newValue)

      // Sync to server if we have a draft ID
      if (draftId) {
        const response = await fetch(`/api/seller/draft/${draftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [field]: newValue,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Save failed")
        }
      }

      toast.success("Changes saved")
      setIsOpen(false)
      onClose()
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {fieldLabels[field]}</DialogTitle>
        </DialogHeader>

        <EditorField field={field} draft={draft} onSave={handleSave} isSaving={isSaving} />

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSave(getFieldValue(field, draft))} disabled={isSaving}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditorField({
  field,
  draft,
  onSave,
  isSaving,
}: {
  field: EditableField
  draft: any
  onSave: (value: any) => void
  isSaving: boolean
}) {
  const [value, setValue] = useState(getFieldValue(field, draft))

  switch (field) {
    case "title":
    case "category":
    case "targetAudience":
      return (
        <div className="space-y-3">
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${field}...`}
          />
          <Button
            onClick={() => onSave(value)}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )

    case "price":
      return (
        <div className="space-y-3">
          <Input
            autoFocus
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
            placeholder="Enter price in ₹"
            step="0.01"
          />
          <Button
            onClick={() => onSave(value)}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )

    case "shortDescription":
    case "longDescription":
    case "requirements":
      return (
        <div className="space-y-3">
          <Textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter description..."
            rows={field === "longDescription" ? 6 : 3}
          />
          <Button
            onClick={() => onSave(value)}
            disabled={isSending}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      )

    case "tags":
      return (
        <TagsEditor
          value={value}
          onChange={setValue}
          onSave={onSave}
          isSaving={isSaving}
        />
      )

    case "benefits":
    case "features":
      return (
        <ListEditor
          value={value}
          onChange={setValue}
          onSave={onSave}
          isSaving={isSaving}
          type={field}
        />
      )

    case "faqs":
      return (
        <FAQEditor
          value={value}
          onChange={setValue}
          onSave={onSave}
          isSaving={isSaving}
        />
      )

    default:
      return null
  }
}

function TagsEditor({
  value,
  onChange,
  onSave,
  isSaving,
}: {
  value: string[]
  onChange: (value: string[]) => void
  onSave: (value: string[]) => void
  isSaving: boolean
}) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...value, input.trim()])
      setInput("")
    }
  }

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a tag..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd()
            }
          }}
        />
        <Button onClick={handleAdd} variant="outline">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => handleRemove(idx)}
              className="hover:text-primary/70"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSave(value)}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Tags"}
      </Button>
    </div>
  )
}

function ListEditor({
  value,
  onChange,
  onSave,
  isSaving,
  type,
}: {
  value: string[]
  onChange: (value: string[]) => void
  onSave: (value: string[]) => void
  isSaving: boolean
  type: "benefits" | "features"
}) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...value, input.trim()])
      setInput("")
    }
  }

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Add a ${type.slice(0, -1)}...`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd()
            }
          }}
        />
        <Button onClick={handleAdd} variant="outline">
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {value.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded border"
          >
            <span className="text-sm">{item}</span>
            <button
              onClick={() => handleRemove(idx)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSave(value)}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}

function FAQEditor({
  value,
  onChange,
  onSave,
  isSaving,
}: {
  value: Array<{ question: string; answer: string }>
  onChange: (value: Array<{ question: string; answer: string }>) => void
  onSave: (value: Array<{ question: string; answer: string }>) => void
  isSaving: boolean
}) {
  const [questions, setQuestions] = useState(value)

  const handleUpdate = (idx: number, field: "question" | "answer", text: string) => {
    const updated = [...questions]
    updated[idx][field] = text
    setQuestions(updated)
  }

  const handleAdd = () => {
    setQuestions([...questions, { question: "", answer: "" }])
  }

  const handleRemove = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {questions.map((faq, idx) => (
        <div key={idx} className="space-y-2 p-3 bg-slate-50 rounded border">
          <Input
            value={faq.question}
            onChange={(e) => handleUpdate(idx, "question", e.target.value)}
            placeholder="Question..."
            className="text-sm"
          />
          <Textarea
            value={faq.answer}
            onChange={(e) => handleUpdate(idx, "answer", e.target.value)}
            placeholder="Answer..."
            rows={2}
          />
          <button
            onClick={() => handleRemove(idx)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        Add FAQ
      </Button>

      <Button
        onClick={() => {
          onChange(questions)
          onSave(questions)
        }}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save FAQs"}
      </Button>
    </div>
  )
}

function getFieldValue(field: EditableField, draft: any): any {
  const value = draft[field]
  if (Array.isArray(value)) return value
  if (typeof value === "number") return value
  return value || ""
}
