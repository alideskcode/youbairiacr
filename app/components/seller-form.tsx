"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function SellerForm() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    category: "",
    contactEmail: "",
    website: "",
    thumbnail: "",
    payout: "",
    budget: "",
    socialLinks: {
      twitter: "",
      facebook: "",
      instagram: "",
    },
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialChange = (
    platform: "twitter" | "facebook" | "instagram",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const generateShopUrl = (shopName: string) => {
    return shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      !formData.shopName ||
      !formData.description ||
      !formData.category ||
      !formData.contactEmail
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      })

      return
    }

    try {
      setIsLoading(true)

      // CHECK USER
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please login first.",
          variant: "destructive",
        })

        router.push("/login")
        return
      }

      // FIXED ARRAY FORMAT
      const socialLinksArray = [
        formData.socialLinks.twitter,
        formData.socialLinks.facebook,
        formData.socialLinks.instagram,
      ].filter(Boolean)

      // DATA TO INSERT
      const campaignData = {
        seller_id: user.id,

        title: formData.shopName.trim(),

        description: formData.description.trim(),

        thumbnail:
          formData.thumbnail.trim() ||
          "/placeholder.svg?height=300&width=300",

        payout: Number(formData.payout) || 0,

        budget: Number(formData.budget) || 0,

        platform: formData.category,

        contact_email: formData.contactEmail.trim(),

        website: formData.website.trim(),

        social_links: socialLinksArray,

        status: "active",
      }

      console.log("INSERTING:", campaignData)

      // INSERT INTO SUPABASE
      const { data, error } = await supabase
        .from("campaigns")
        .insert([campaignData])
        .select()

      if (error) {
        console.error("SUPABASE ERROR:", error)

        throw new Error(error.message)
      }

      console.log("CREATED:", data)

      toast({
        title: "Success",
        description: "Your shop has been created successfully.",
      })

      router.push("/product-manager")
    } catch (error) {
      console.error("CREATE SHOP ERROR:", error)

      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create shop.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SHOP INFO */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Shop Information
              </h2>

              <div className="grid gap-4">
                {/* SHOP NAME */}
                <div className="grid gap-2">
                  <Label htmlFor="shopName">
                    Shop Name *
                  </Label>

                  <Input
                    id="shopName"
                    placeholder="Enter your shop name"
                    value={formData.shopName}
                    onChange={(e) =>
                      handleInputChange("shopName", e.target.value)
                    }
                    required
                  />

                  {formData.shopName && (
                    <p className="text-sm text-muted-foreground">
                      URL: /shop/
                      {generateShopUrl(formData.shopName)}
                    </p>
                  )}
                </div>

                {/* CATEGORY */}
                <div className="grid gap-2">
                  <Label htmlFor="category">
                    Category *
                  </Label>

                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="templates">
                        Templates
                      </SelectItem>

                      <SelectItem value="graphics">
                        Graphics
                      </SelectItem>

                      <SelectItem value="software">
                        Software
                      </SelectItem>

                      <SelectItem value="ebooks">
                        E-books
                      </SelectItem>

                      <SelectItem value="photography">
                        Photography
                      </SelectItem>

                      <SelectItem value="video">
                        Video
                      </SelectItem>

                      <SelectItem value="audio">
                        Audio
                      </SelectItem>

                      <SelectItem value="marketing">
                        Marketing
                      </SelectItem>

                      <SelectItem value="design">
                        Design
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DESCRIPTION */}
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Description *
                  </Label>

                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your shop"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange(
                        "description",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">
                    Contact Email *
                  </Label>

                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange(
                        "contactEmail",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* THUMBNAIL */}
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">
                    Cover Image URL
                  </Label>

                  <Input
                    id="thumbnail"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      handleInputChange(
                        "thumbnail",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* PAYOUT + BUDGET */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="payout">
                      Payout
                    </Label>

                    <Input
                      id="payout"
                      type="number"
                      placeholder="0"
                      value={formData.payout}
                      onChange={(e) =>
                        handleInputChange(
                          "payout",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="budget">
                      Budget
                    </Label>

                    <Input
                      id="budget"
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange(
                          "budget",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* WEBSITE */}
                <div className="grid gap-2">
                  <Label htmlFor="website">
                    Website
                  </Label>

                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange(
                        "website",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SOCIAL LINKS */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Social Links
              </h2>

              <div className="grid gap-4">
                <Input
                  placeholder="Twitter/X URL"
                  value={formData.socialLinks.twitter}
                  onChange={(e) =>
                    handleSocialChange(
                      "twitter",
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Facebook URL"
                  value={formData.socialLinks.facebook}
                  onChange={(e) =>
                    handleSocialChange(
                      "facebook",
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Instagram URL"
                  value={formData.socialLinks.instagram}
                  onChange={(e) =>
                    handleSocialChange(
                      "instagram",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <Separator />

            {/* TERMS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                />

                <label
                  htmlFor="terms"
                  className="text-sm"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
              >
                Save Draft
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Shop..."
                  : "Create Shop"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}