import { Metadata } from 'next'
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms and Conditions - YOUBAIRIA',
  description: 'Read our terms and conditions for using our digital marketplace platform.',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6" />
              Agreement to Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing and using YOUBAIRIA's digital marketplace platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all users, including buyers, sellers, and visitors to our platform.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Definitions</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p><strong>"Platform"</strong> refers to the YOUBAIRIA digital marketplace website and mobile applications.</p>
              </div>
              <div>
                <p><strong>"User"</strong> refers to any individual or entity using our platform.</p>
              </div>
              <div>
                <p><strong>"Buyer"</strong> refers to users who purchase digital products through our platform.</p>
              </div>
              <div>
                <p><strong>"Seller"</strong> refers to users who list and sell digital products through our platform.</p>
              </div>
              <div>
                <p><strong>"Digital Products"</strong> refers to software, digital downloads, online courses, e-books, and other digital content.</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              User Accounts and Registration
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Account Creation</h3>
                <p className="text-muted-foreground">
                  To access certain features of our platform, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Platform Usage</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Permitted Use</h3>
                <p className="text-muted-foreground">
                  You may use our platform for lawful purposes only, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Browsing and purchasing digital products</li>
                  <li>Selling legitimate digital products</li>
                  <li>Communicating with other users through our platform</li>
                  <li>Accessing customer support services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Prohibited Activities
                </h3>
                <p className="text-muted-foreground mb-2">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Upload malicious software or content</li>
                  <li>Engage in fraud or deceptive practices</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with platform functionality</li>
                  <li>Use automated tools to access our services</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Digital Products</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Product Listings</h3>
                <p className="text-muted-foreground">
                  Sellers are responsible for:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Providing accurate product descriptions and pricing</li>
                  <li>Ensuring they have rights to sell the digital products</li>
                  <li>Delivering products as described</li>
                  <li>Providing appropriate customer support</li>
                  <li>Complying with all applicable laws and regulations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Product Purchases</h3>
                <p className="text-muted-foreground">
                  Buyers acknowledge that:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Digital products are delivered electronically</li>
                  <li>Some products may have usage restrictions or licenses</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>They are responsible for maintaining access to their account</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment and Fees</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Payment Processing</h3>
                <p className="text-muted-foreground">
                  All payments are processed through secure third-party payment processors. We do not store your payment information on our servers.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Platform Fees</h3>
                <p className="text-muted-foreground">
                  We charge transaction fees on sales. Current fee structure:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Platform fee: 5% of sale price</li>
                  <li>Payment processing fee: 2.9% + $0.30 per transaction</li>
                  <li>Additional fees may apply for premium features</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Taxes</h3>
                <p className="text-muted-foreground">
                  Users are responsible for any applicable taxes on their transactions. We may collect and remit taxes where required by law.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Platform Content</h3>
                <p className="text-muted-foreground">
                  Our platform, including its design, content, and functionality, is protected by intellectual property laws. You may not copy, modify, or distribute our platform content without permission.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">User Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of content you upload, but grant us a license to use it for platform operations. You must have rights to any content you upload.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Disclaimers and Limitations
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Service Availability</h3>
                <p className="text-muted-foreground">
                  We strive to maintain platform availability but do not guarantee uninterrupted access. We may perform maintenance or updates that temporarily affect service.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Product Quality</h3>
                <p className="text-muted-foreground">
                  We do not guarantee the quality, accuracy, or suitability of digital products sold on our platform. Buyers should review product details carefully before purchasing.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  Our liability is limited to the amount you paid for our services in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Customer Support</h3>
                <p className="text-muted-foreground">
                  We encourage users to resolve disputes through our customer support team first. Contact us at info@youbairia.com
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Arbitration</h3>
                <p className="text-muted-foreground">
                  Any disputes not resolved through customer support may be resolved through binding arbitration in accordance with our arbitration agreement.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of INDIA. Any legal proceedings shall be brought in the courts of Saharanpur, India.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms from time to time. We will notify users of material changes by email or through our platform. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Info className="h-6 w-6" />
              Contact Information
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> info@youbairia.com</p>
              <p><strong>Address:</strong> Dehradun, India</p>
              <p><strong>Phone:</strong> 9368598307</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
