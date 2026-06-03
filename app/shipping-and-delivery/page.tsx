import { Metadata } from 'next'
import { Truck, Download, Clock, Globe, Shield, Zap, CheckCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Shipping and Delivery - YOUBAIRIA',
  description: 'Learn about our digital product delivery methods and timeframes.',
}

export default function ShippingAndDeliveryPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Truck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shipping and Delivery</h1>
          <p className="text-muted-foreground text-lg">
            Instant digital delivery for all your digital products
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="h-6 w-6" />
              Digital Delivery Overview
            </h2>
            <p className="text-muted-foreground">
              At YOUBAIRIA, we specialize in digital products that are delivered instantly to your account. 
              No physical shipping required! All digital products are available for immediate download or access 
              upon successful payment confirmation.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Instant Digital Delivery
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Software and applications</li>
                    <li>• Digital templates and designs</li>
                    <li>• E-books and digital publications</li>
                    <li>• Audio and video files</li>
                    <li>• Digital art and graphics</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Access Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Online courses and tutorials</li>
                    <li>• Web-based applications</li>
                    <li>• Subscription services</li>
                    <li>• Cloud-based tools</li>
                    <li>• Digital memberships</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Delivery Timeframes
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">Instant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Most digital products are delivered immediately after payment confirmation
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">Within 24 Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Custom or personalized digital products may take up to 24 hours
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-600">2-3 Business Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complex digital services or custom development projects
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">Delivery Notifications</h3>
                <p className="text-muted-foreground">
                  You'll receive an email confirmation with download links or access instructions 
                  immediately after your purchase is completed. Check your email (including spam folder) 
                  for delivery notifications.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How Digital Delivery Works</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your purchase with secure payment
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Confirm</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment is verified and order is processed
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Deliver</h3>
                  <p className="text-sm text-muted-foreground">
                    Digital product is delivered to your account
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Download or access your digital product
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Accessing Your Digital Products</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Account Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  All your purchased digital products are available in your account dashboard:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Log into your YOUBAIRIA account</li>
                  <li>Navigate to "My Purchases" or "Downloads" section</li>
                  <li>Find your purchased products in the list</li>
                  <li>Click "Download" or "Access" to retrieve your product</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Email Delivery</h3>
                <p className="text-muted-foreground mb-4">
                  You'll also receive delivery emails with direct links:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Check your email for delivery confirmation</li>
                  <li>Click the download link in the email</li>
                  <li>Follow any additional instructions provided</li>
                  <li>Save the email for future reference</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Security and Protection
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Secure Downloads</h3>
                <p className="text-muted-foreground">
                  All digital products are delivered through secure, encrypted channels to protect your purchase and personal information.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Access Protection</h3>
                <p className="text-muted-foreground">
                  Your digital products are tied to your account and protected from unauthorized access. Keep your account credentials secure.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">System Requirements</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">General Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Stable internet connection for downloads</li>
                  <li>Sufficient storage space on your device</li>
                  <li>Compatible software for file types (PDF reader, media player, etc.)</li>
                  <li>Updated web browser for web-based products</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Product-Specific Requirements</h3>
                <p className="text-muted-foreground">
                  Individual products may have specific system requirements. Check the product description 
                  before purchasing to ensure compatibility with your system.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Download Limits and Expiry</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Download Limits</h3>
                  <p className="text-muted-foreground">
                    Most products allow unlimited downloads within your account. Some products may have 
                    download limits specified in the product description.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Access Duration</h3>
                  <p className="text-muted-foreground">
                    Digital products are typically available for lifetime access through your account. 
                    Subscription-based products follow their specific access terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Common Issues</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Check your email spam folder for delivery notifications</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Ensure you're logged into the correct account</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Clear browser cache if accessing web-based products</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Check your device's available storage space</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-muted-foreground">
                  If you're experiencing issues with digital delivery, contact our support team at 
                  support@youbairia.com or call +919368598307 for immediate assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about digital delivery or technical support:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-muted-foreground">info@youbairia.com</p>
                <p className="text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">General Inquiries</h3>
                <p className="text-muted-foreground">info@youbairia.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
