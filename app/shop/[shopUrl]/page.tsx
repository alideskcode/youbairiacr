import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Mail, MapPin, Globe } from 'lucide-react'

interface ShopPageProps {
  params: {
    shopUrl: string
  }
}

async function getShopData(shopUrl: string) {
  try {
    const seller = await prisma.seller.findUnique({
      where: { shopUrl },
      include: {
        products: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    return seller
  } catch (error) {
    console.error('Error fetching shop data:', error)
    return null
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const seller = await getShopData(params.shopUrl)

  if (!seller) {
    notFound()
  }

  const socialLinks = seller.socialLinks as any || {}

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{seller.shopName}</h1>
              <p className="text-muted-foreground text-lg mb-4">{seller.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{seller.category}</Badge>
                <Badge variant={seller.status === 'APPROVED' ? 'default' : 'outline'}>
                  {seller.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {seller.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${seller.contactEmail}`} className="hover:text-primary">
                      {seller.contactEmail}
                    </a>
                  </div>
                )}
                {seller.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={seller.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
              {socialLinks.facebook && (
                <Button variant="outline" size="sm" asChild>
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </Button>
              )}
              {socialLinks.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Products</h2>
          <p className="text-muted-foreground">
            {seller.products.length} product{seller.products.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {seller.products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No products available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seller.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">No Image</div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <Button size="sm">View Details</Button>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 