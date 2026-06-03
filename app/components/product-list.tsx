"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Image from "next/image"

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  seller: {
    shopName: string
    contactEmail: string
  }
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  image: string
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve product")
      }

      toast.success("Product approved successfully")
      fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Error approving product:", error)
      toast.error("Failed to approve product")
    }
  }

  const handleReject = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject product")
      }

      toast.success("Product rejected successfully")
      fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Error rejecting product:", error)
      toast.error("Failed to reject product")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Approval</h1>
        <Badge variant="outline" className="text-sm">
          {products.filter((p) => p.status === "PENDING").length} Pending
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.seller.shopName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.seller.contactEmail}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "APPROVED"
                        ? "success"
                        : product.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(product.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(product.id)}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 