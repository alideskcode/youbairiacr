"use client"

import { useSellerDraftStore } from "@/lib/seller-draft-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Check, AlertCircle } from "lucide-react"
import { useState } from "react"
import { DraftEditorModal } from "./draft-editor-modal"
import { toast } from "sonner"

export function LivePreviewPanel() {
  const { draft, stage, draftId, updateDraftField } = useSellerDraftStore()
  const [editingField, setEditingField] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  async function handlePublish() {
    if (!draftId) {
      toast.error("Draft not found")
      return
    }

    // Validate required fields
    if (!draft.title || !draft.shortDescription || !draft.longDescription || !draft.category || draft.price === undefined) {
      toast.error("Please fill in all required fields before publishing")
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/seller/draft/${draftId}/publish`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Publish failed")
      }

      const data = await response.json()
      toast.success("Product published successfully!")
      // Redirect to product manager
      window.location.href = "/product-manager"
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to publish")
    } finally {
      setIsPublishing(false)
    }
  }

  const requiredFields = ["title", "shortDescription", "longDescription", "category", "price"]
  const filledFields = requiredFields.filter((field) => Boolean((draft as any)[field]))
  const completionPercentage = Math.round((filledFields.length / requiredFields.length) * 100)

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-900">Product Preview</h3>
          <p className="text-xs text-slate-600">
            {completionPercentage}% complete
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Title */}
          <EditableField
            label="Title *"
            value={draft.title || ""}
            field="title"
            onEdit={() => setEditingField("title")}
            isEmpty={!draft.title}
          />

          {/* Short Description */}
          <EditableField
            label="Short Description *"
            value={draft.shortDescription || ""}
            field="shortDescription"
            onEdit={() => setEditingField("shortDescription")}
            isEmpty={!draft.shortDescription}
            preview
          />

          {/* Long Description */}
          <EditableField
            label="Long Description *"
            value={draft.longDescription || ""}
            field="longDescription"
            onEdit={() => setEditingField("longDescription")}
            isEmpty={!draft.longDescription}
            preview
            multiline
          />

          {/* Category */}
          <EditableField
            label="Category *"
            value={draft.category || ""}
            field="category"
            onEdit={() => setEditingField("category")}
            isEmpty={!draft.category}
          />

          {/* Product Type */}
          {draft.productType && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold text-blue-900 uppercase mb-1">Product Type</p>
                <Badge variant="outline" className="bg-blue-100 text-blue-900">
                  {draft.productType.replace("_", " ")}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Price */}
          <EditableField
            label="Price (₹) *"
            value={draft.price ? `₹${draft.price}` : ""}
            field="price"
            onEdit={() => setEditingField("price")}
            isEmpty={draft.price === undefined}
          />

          {/* Tags */}
          {draft.tags && draft.tags.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">Tags</p>
                  <button
                    onClick={() => setEditingField("tags")}
                    className="text-primary hover:bg-primary/10 p-1 rounded"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {draft.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {draft.benefits && draft.benefits.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">Key Benefits</p>
                  <button
                    onClick={() => setEditingField("benefits")}
                    className="text-primary hover:bg-primary/10 p-1 rounded"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  {draft.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {draft.features && draft.features.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">Features</p>
                  <button
                    onClick={() => setEditingField("features")}
                    className="text-primary hover:bg-primary/10 p-1 rounded"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  {draft.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* FAQs */}
          {draft.faqs && draft.faqs.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase">FAQs</p>
                  <button
                    onClick={() => setEditingField("faqs")}
                    className="text-primary hover:bg-primary/10 p-1 rounded"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {draft.faqs.map((faq: any, idx: number) => (
                    <div key={idx}>
                      <p className="font-medium text-slate-900">{faq.question}</p>
                      <p className="text-slate-600 mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status */}
          <Card className={stage === "ready_to_publish" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                {stage === "ready_to_publish" ? (
                  <Check className="w-4 h-4 text-green-600 mt-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-1" />
                )}
                <div>
                  <p className={`text-sm font-medium ${stage === "ready_to_publish" ? "text-green-900" : "text-yellow-900"}`}>
                    {stage === "ready_to_publish"
                      ? "Ready to publish!"
                      : `Missing ${requiredFields.length - filledFields.length} required field(s)`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Publish Button */}
      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
        <Button
          onClick={handlePublish}
          disabled={stage !== "ready_to_publish" || isPublishing}
          className="w-full"
          size="lg"
        >
          {isPublishing ? "Publishing..." : "Publish Product"}
        </Button>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Your product will be pending admin approval
        </p>
      </div>

      {/* Editor Modal */}
      {editingField && (
        <DraftEditorModal
          field={editingField}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  )
}

function EditableField({
  label,
  value,
  field,
  onEdit,
  isEmpty,
  preview = false,
  multiline = false,
}: {
  label: string
  value: string
  field: string
  onEdit: () => void
  isEmpty: boolean
  preview?: boolean
  multiline?: boolean
}) {
  return (
    <Card className={isEmpty ? "bg-red-50 border-red-200" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className={`text-xs font-semibold uppercase ${isEmpty ? "text-red-900" : "text-slate-600"}`}>
            {label}
          </p>
          <button
            onClick={onEdit}
            className="text-primary hover:bg-primary/10 p-1 rounded"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        <p
          className={`text-sm ${isEmpty ? "text-red-600 font-medium" : "text-slate-700"} ${
            preview ? "line-clamp-3" : ""
          }`}
        >
          {value || "Click to add..."}
        </p>
      </CardContent>
    </Card>
  )
}

import { ScrollArea } from "@/components/ui/scroll-area"
