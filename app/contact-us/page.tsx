import { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'help and support - YOUBAIRIA',
  description: 'Get in touch with our team for help and support, questions, or feedback.',
}

export default function ContactUsPage() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question, need support, or want to share feedback? We're here to help! 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
         
          {/* Contact Information */}
          <div className="space-y-6">
            {/* General Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  General Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@youbairia.com</p>
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Within 24 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@youbairia.com</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+919368598307</p>
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Within 2-4 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Business Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Business & Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">info@youbairia.com</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+919368598307</p>
                </div>
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-muted-foreground">Within 48 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Office Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    Clement Town<br />
                    Dehradun<br />
                    India
                  </p>
                </div>
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">
                    Monday - Saturday<br />
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions below
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I reset my password?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click the "Forgot Password" link on the sign-in page. We'll send you an email with instructions to reset your password.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I request a refund?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact our support team within 30 days of purchase. Include your order number and reason for the refund request.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I become a seller?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visit our "Create Shop" page to start the application process. You'll need to provide business information and verify your identity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I track my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Log into your account and visit the "Orders" section. You'll find tracking information for all your purchases there.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my payment information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we use industry-standard encryption and secure payment processors. We never store your payment information on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Support Options */}
        <div className="mt-16 text-center">
          <div className="bg-muted rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
            <p className="text-muted-foreground mb-6">
              For urgent issues, try these quick solutions:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold">Live Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Available during business hours
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold">Help Center</h4>
                <p className="text-sm text-muted-foreground">
                  Browse our knowledge base
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get a response within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
