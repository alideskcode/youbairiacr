import { Metadata } from 'next'
import { Shield, Eye, Lock, Users, Database, Bell } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - YOUBAIRIA',
  description: 'Learn how we protect your privacy and handle your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
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
              <Eye className="h-6 w-6" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Personal Information</h3>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Account credentials and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
                <p className="text-muted-foreground">
                  We automatically collect certain information when you use our services:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, interactions)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your consent)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order confirmations and updates</li>
              <li>Improve our services and user experience</li>
              <li>Detect and prevent fraud and abuse</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Information Sharing
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
              <li><strong>Payment Processors:</strong> To process your payments securely</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Database className="h-6 w-6" />
              Data Security
            </h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Your Rights and Choices
            </h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Required for basic site functionality and security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our site.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Marketing Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Used to deliver relevant advertisements and content.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Preference Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Remember your settings and preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">International Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
