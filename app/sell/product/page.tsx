"use client"

import { useRouter } from "next/navigation"
import type { ElementType } from "react"
import { useState } from "react"
import { BookOpen, Code2, Download, PackagePlus, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import type { ProductType } from "@/lib/marketplace"

const productTypeOptions: { value: ProductType; label: string; icon: ElementType }[] = [
  { value: "course", label: "Course", icon: BookOpen },
  { value: "software", label: "Software", icon: Code2 },
  { value: "community", label: "Community", icon: Users },
  { value: "download", label: "Download", icon: Download },
  { value: "bundle", label: "Bundle", icon: PackagePlus },
]

export default function AddProductPage() {
  return (
    <AuthGuard>
      <AddProductContent />
    </AuthGuard>
  )
}

function AddProductContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Business",
    product_type: "course" as ProductType,
    price: "999",
    currency: "INR",
    cover_url: "",
    access_url: "",
    demo_url: "",
    telegram_chat_id: "",
    telegram_invite_url: "",
    seller_name: "",
    support_email: "",
    includes: "Lifetime access\nUpdates included\nSeller support",
    tags: "course, digital product",
    license_terms: "",
  })

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setLoading(true)
      const res = await fetch("/api/marketplace/seller-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          includes: form.includes.split("\n").map((item) => item.trim()).filter(Boolean),
          tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
          status: "active",
        }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) throw new Error(body.error ?? "Failed to create product")
      toast.success("Product published")
      router.push(`/products/${body.data.slug || body.data.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 md:py-10">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3">Seller console</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Create a digital product</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Publish courses, software, downloads, bundles, or Telegram community access. Access details stay private until payment is verified.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Listing</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="AI Automation Course" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" value={form.subtitle} onChange={(event) => update("subtitle", event.target.value)} placeholder="Learn workflows, templates, and systems buyers can use today" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={(event) => update("description", event.target.value)} rows={8} placeholder="Explain outcomes, modules, deliverables, support, and who this is for." required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={form.product_type} onValueChange={(value) => update("product_type", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {productTypeOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="inline-flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </span>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={form.category} onChange={(event) => update("category", event.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="1" value={form.price} onChange={(event) => update("price", event.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Private access</h2>
            <p className="mt-1 text-sm text-muted-foreground">These fields are visible only in the buyer library after verified payment.</p>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="access_url">Access URL</Label>
                <Input id="access_url" value={form.access_url} onChange={(event) => update("access_url", event.target.value)} placeholder="https://drive.google.com/... or https://course.yoursite.com/..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telegram_invite_url">Telegram invite URL</Label>
                <Input id="telegram_invite_url" value={form.telegram_invite_url} onChange={(event) => update("telegram_invite_url", event.target.value)} placeholder="https://t.me/+privateInvite" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telegram_chat_id">Telegram chat ID</Label>
                <Input id="telegram_chat_id" value={form.telegram_chat_id} onChange={(event) => update("telegram_chat_id", event.target.value)} placeholder="-1001234567890" />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Media and trust</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cover_url">Cover image URL</Label>
                <Input id="cover_url" value={form.cover_url} onChange={(event) => update("cover_url", event.target.value)} placeholder="https://..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input id="demo_url" value={form.demo_url} onChange={(event) => update("demo_url", event.target.value)} placeholder="https://..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="includes">Includes</Label>
                <Textarea id="includes" value={form.includes} onChange={(event) => update("includes", event.target.value)} rows={5} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={form.tags} onChange={(event) => update("tags", event.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Seller</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="seller_name">Seller name</Label>
                <Input id="seller_name" value={form.seller_name} onChange={(event) => update("seller_name", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support_email">Support email</Label>
                <Input id="support_email" value={form.support_email} onChange={(event) => update("support_email", event.target.value)} />
              </div>
            </div>
          </div>

          <Separator />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Publishing..." : "Publish product"}
          </Button>
        </aside>
      </form>
    </div>
  )
}
