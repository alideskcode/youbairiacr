"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function AddProductPage() {
  const router = useRouter()
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  })

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) {
        router.push("/login");
        return;
      }
      setSession(authSession);
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    }
  };

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    if (files.length === 0) {
      toast.error("Please upload at least one product file")
      return
    }

    if (!session?.user?.id) {
      toast.error("Please log in to add products")
      return
    }

    try {
      setIsLoading(true)
      
      // First, get the seller profile for the current user
      const sellerResponse = await fetch(`/api/seller?userId=${session.user.id}`)
      const sellerContentType = sellerResponse.headers.get("content-type") || ""
      if (!sellerContentType.includes("application/json")) {
        const text = await sellerResponse.text()
        throw new Error(
          `Seller API returned unexpected response: ${sellerResponse.status} ${sellerResponse.statusText} - ${text.slice(0, 200)}`
        )
      }

      if (!sellerResponse.ok) {
        const errorBody = await sellerResponse.json().catch(() => ({}))
        throw new Error(
          errorBody.error ?? "Seller profile not found. Please create a shop first."
        )
      }

      const seller = await sellerResponse.json()

      // Create form data for file upload
      const productFormData = new FormData()
      productFormData.append("title", formData.title)
      productFormData.append("description", formData.description)
      productFormData.append("category", formData.category)
      productFormData.append("price", formData.price)
      productFormData.append("sellerId", seller.id)
      
      if (thumbnail) {
        productFormData.append("thumbnail", thumbnail)
      }
      
      files.forEach((file, index) => {
        productFormData.append(`files`, file)
      })

      const response = await fetch("/api/products", {
        method: "POST",
        body: productFormData,
      })

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(
          `Expected JSON but got ${response.status} ${response.statusText}: ${text.slice(0, 200)}`
        )
      }

      const responseBody = await response.json()

      if (!response.ok) {
        throw new Error(responseBody.error || "Failed to create product")
      }

      const product = responseBody
      toast.success("Product created successfully!")
      router.push(`/shop/${seller.shopUrl}`)
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-fade-in-up leading-[1.15]">
              Add New Product
            </h1>
            <p className="text-muted-foreground mt-2">
              List your digital product on the marketplace.
            </p>
          </div>
          <Separator />
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Product Information</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a descriptive title" 
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="templates">Templates</SelectItem>
                      <SelectItem value="graphics">Graphics</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="ebooks">E-books</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product in detail" 
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0.99" 
                    step="0.01" 
                    placeholder="9.99"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Product Files</h2>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-files">Upload Product Files *</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Drag and drop your files here or click to browse</p>
                      <p className="text-xs text-muted-foreground">
                        Max file size: 500MB. Supported formats: ZIP, PDF, JPG, PNG, MP3, MP4
                      </p>
                      <Input 
                        id="product-files" 
                        type="file" 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange}
                        required
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => document.getElementById("product-files")?.click()}
                      >
                        Select Files
                      </Button>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="text-sm font-medium mb-2">Selected Files:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Product Thumbnail</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload a thumbnail image for your product</p>
                      <p className="text-xs text-muted-foreground">Recommended size: 800x600px. Max file size: 5MB.</p>
                      <Input 
                        id="thumbnail" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button"
                        onClick={() => document.getElementById("thumbnail")?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                    {thumbnail && (
                      <div className="mt-4 text-left">
                        <p className="text-sm font-medium mb-2">Selected Thumbnail:</p>
                        <p className="text-sm text-muted-foreground">{thumbnail.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Terms and Conditions</h2>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 text-sm">
                  <p className="font-medium mb-2">By listing your product, you agree to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Our marketplace terms of service</li>
                    <li>A 10% commission fee on each sale</li>
                    <li>Providing customer support for your products</li>
                    <li>Maintaining and updating your products as needed</li>
                  </ul>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions *
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" disabled={isLoading}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Product..." : "List Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 