import { Metadata } from 'next'
import { RotateCcw, Clock, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy - YOUBAIRIA',
  description: 'Learn about our cancellation and refund policies for digital products.',
}

export default function CancellationAndRefundPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <RotateCcw className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Cancellation and Refund Policy</h1>
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
              <Info className="h-6 w-6" />
              Overview
            </h2>
            <p className="text-muted-foreground">
              At YOUBAIRIA, we strive to ensure customer satisfaction with every purchase. This policy outlines the terms and conditions for cancellations and refunds of digital products purchased through our platform. Please read this policy carefully before making a purchase.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Refund Eligibility
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Eligible for Refunds</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Technical issues preventing product access or download</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Product significantly differs from description</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Duplicate purchases due to system errors</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Unauthorized transactions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p>Product is defective or non-functional</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Not Eligible for Refunds</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Change of mind after successful download/access</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Product has been used or consumed</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Failure to meet system requirements</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Request made after 30 days from purchase</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p>Free products or promotional items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Timeframes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processing Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Once approved, refunds are typically processed within 3-5 business days. The time for the refund to appear in your account depends on your payment method and financial institution.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Deadline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Refund requests must be submitted within 30 days of the original purchase date. Requests submitted after this period will not be considered.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Email support@youbairia.com with your order details and reason for refund
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Provide Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Include order number, purchase date, and detailed explanation of the issue
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Review & Process</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll review your request and process the refund if approved
                  </p>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-2">Required Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Order number or transaction ID</li>
                  <li>Purchase date</li>
                  <li>Product name</li>
                  <li>Detailed reason for refund request</li>
                  <li>Any relevant screenshots or documentation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Order Cancellation</h3>
                <p className="text-muted-foreground mb-4">
                  Orders can be cancelled under the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Before the product is delivered or accessed</li>
                  <li>Within 1 hour of purchase for instant downloads</li>
                  <li>If the seller fails to deliver within the promised timeframe</li>
                  <li>Due to technical issues preventing order completion</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Subscription Cancellation</h3>
                <p className="text-muted-foreground mb-4">
                  For subscription-based services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You can cancel at any time through your account settings</li>
                  <li>Cancellation takes effect at the end of the current billing period</li>
                  <li>No refunds for partial months of service</li>
                  <li>Access continues until the end of the paid period</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Important Notes
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p>Refunds are processed to the original payment method used for the purchase.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p>Processing fees charged by payment processors are non-refundable.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p>We reserve the right to deny refund requests that violate our terms of service.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p>Repeated refund requests may result in account restrictions.</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              If you disagree with a refund decision, you may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Request a review by our customer service team</li>
              <li>Provide additional documentation to support your case</li>
              <li>Contact us through multiple channels (email, phone, live chat)</li>
              <li>Escalate to our management team if necessary</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For refund and cancellation requests, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground">info@youbairia.com</p>
                <p className="text-sm text-muted-foreground">Response within 24-48 hours</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground">+919368598307</p>
                <p className="text-sm text-muted-foreground">Monday-Friday, 9 AM-6 PM EST</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground">
              We may update this cancellation and refund policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
