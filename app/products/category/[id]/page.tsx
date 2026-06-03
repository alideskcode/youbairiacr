"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import ProductCard from "@/app/components/product-card"
import { Button } from "@/components/ui/button"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id

  // In a real app, you would fetch this data from an API or database based on the category ID
  const categories = {
    templates: {
      name: "Templates",
      description: "Professional website templates for various industries and purposes",
      products: [
        {
          id: "1",
          title: "Website Template Bundle",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "DesignStudio",
        },
        {
          id: "9",
          title: "E-commerce Template Pack",
          price: 59.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "WebShopDesigns",
        },
        {
          id: "10",
          title: "Portfolio Templates",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "CreativePortfolios",
        },
        {
          id: "11",
          title: "Blog Theme Collection",
          price: 39.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "BlogThemes",
        },
        {
          id: "24",
          title: "Landing Page Templates",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "LandingPagePro",
        },
        {
          id: "25",
          title: "Admin Dashboard Templates",
          price: 44.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Templates",
          seller: "AdminUI",
        },
      ],
    },
    graphics: {
      name: "Graphics",
      description: "High-quality graphic assets for your design projects",
      products: [
        {
          id: "6",
          title: "Icon Pack - 500+ Icons",
          price: 12.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "IconArtist",
        },
        {
          id: "12",
          title: "Vector Illustrations Bundle",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "VectorArtist",
        },
        {
          id: "13",
          title: "Logo Templates Pack",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "LogoDesigner",
        },
        {
          id: "14",
          title: "Social Media Graphics Kit",
          price: 17.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "SocialMediaDesigner",
        },
        {
          id: "26",
          title: "UI Elements Pack",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "UIDesigner",
        },
        {
          id: "27",
          title: "Background Textures",
          price: 14.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Graphics",
          seller: "TextureArtist",
        },
      ],
    },
    software: {
      name: "Software",
      description: "Powerful software solutions for your business and personal needs",
      products: [
        {
          id: "3",
          title: "Productivity App",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "AppDev",
        },
        {
          id: "15",
          title: "Project Management Tool",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "ProjectTools",
        },
        {
          id: "16",
          title: "Accounting Software",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "FinanceApps",
        },
        {
          id: "17",
          title: "CRM System",
          price: 59.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "BusinessSolutions",
        },
        {
          id: "28",
          title: "Inventory Management System",
          price: 39.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "BusinessTools",
        },
        {
          id: "29",
          title: "Email Marketing Software",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Software",
          seller: "MarketingTools",
        },
      ],
    },
    ebooks: {
      name: "E-books",
      description: "Informative and educational e-books on various topics",
      products: [
        {
          id: "5",
          title: "E-book: Digital Marketing Guide",
          price: 9.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "MarketingGuru",
        },
        {
          id: "18",
          title: "E-book: Web Development Fundamentals",
          price: 12.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "CodeTeacher",
        },
        {
          id: "19",
          title: "E-book: Business Strategy",
          price: 14.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "BusinessConsultant",
        },
        {
          id: "20",
          title: "E-book: Creative Design Principles",
          price: 11.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "DesignEducator",
        },
        {
          id: "30",
          title: "E-book: SEO Mastery",
          price: 13.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "SEOExpert",
        },
        {
          id: "31",
          title: "E-book: Content Creation Guide",
          price: 10.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "E-books",
          seller: "ContentCreator",
        },
      ],
    },
    marketing: {
      name: "Marketing",
      description: "Marketing tools and resources to grow your business",
      products: [
        {
          id: "2",
          title: "Social Media Marketing Kit",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "MarketingPro",
        },
        {
          id: "21",
          title: "Email Marketing Templates",
          price: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "EmailMarketer",
        },
        {
          id: "22",
          title: "SEO Toolkit",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "SEOExpert",
        },
        {
          id: "23",
          title: "Content Marketing Planner",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "ContentStrategist",
        },
        {
          id: "32",
          title: "Social Media Calendar",
          price: 17.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "SocialMediaManager",
        },
        {
          id: "33",
          title: "Marketing Analytics Dashboard",
          price: 39.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Marketing",
          seller: "DataAnalyst",
        },
      ],
    },
  }

  const category = categories[categoryId as keyof typeof categories]

  if (!category) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    )
  }

  return (
      <div className="container py-8 md:py-12">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to All Categories
      </Link>

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground mt-2">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              category={product.category}
              seller={product.seller}
            />
          ))}
        </div>
      </div>
      </div>
  )
}
