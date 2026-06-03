"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Smartphone, QrCode } from "lucide-react"
import { getMerchantName, getPaytmUpiId } from "@/lib/payment-config"
import { toast } from "sonner"

interface UPIQRCodeProps {
  amount: number
  description?: string
  onPaymentComplete?: () => void
}

export function UPIQRCode({ amount, description = "Payment for Digital Products", onPaymentComplete }: UPIQRCodeProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [paymentId, setPaymentId] = useState("")
  
  const merchantUpiId = getPaytmUpiId()

  useEffect(() => {
    generateQRCode()
  }, [amount, description])

  const generateQRCode = async () => {
    try {
      setIsLoading(true)
      
      // Generate unique payment ID
      const uniquePaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setPaymentId(uniquePaymentId)

      // Create UPI payment URL
      const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(getMerchantName())}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}&tr=${uniquePaymentId}`

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrCodeDataUrl(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return

    const link = document.createElement('a')
    link.download = `upi-payment-${paymentId}.png`
    link.href = qrCodeDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('QR code downloaded successfully!')
  }

  const simulatePayment = () => {
    toast.info('Simulating payment verification...')
    
    // Simulate payment verification
    setTimeout(() => {
      const paymentSuccess = Math.random() > 0.3 // 70% success rate
      
      if (paymentSuccess) {
        toast.success('Payment successful!')
        onPaymentComplete?.()
      } else {
        toast.error('Payment failed. Please try again.')
      }
    }, 3000)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          UPI QR Code Payment
        </CardTitle>
        <CardDescription>
          Scan this QR code with your UPI app to pay ₹{amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="text-center bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Amount to pay</p>
          <p className="text-3xl font-bold">₹{amount.toFixed(2)}</p>
        </div>

        {/* UPI ID Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Payment will be sent to:</p>
          <Badge variant="outline" className="font-mono text-sm">
            {merchantUpiId}
          </Badge>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          {isLoading ? (
            <div className="w-64 h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Generating QR Code...</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
                <img 
                  src={qrCodeDataUrl} 
                  alt="UPI QR Code" 
                  className="w-64 h-64"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Payment ID: {paymentId}
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Smartphone className="h-4 w-4" />
            <span className="font-medium">How to pay:</span>
          </div>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Open your UPI app (Paytm, PhonePe, Google Pay, etc.)</li>
            <li>• Scan this QR code with your app</li>
            <li>• Verify the amount and UPI ID</li>
            <li>• Enter your UPI PIN to complete payment</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={downloadQRCode} 
            variant="outline" 
            className="flex-1"
            disabled={!qrCodeDataUrl}
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR
          </Button>
          
          <Button 
            onClick={simulatePayment} 
            className="flex-1"
            disabled={!qrCodeDataUrl}
          >
            Test Payment
          </Button>
        </div>

        {/* Payment Status */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Payment will be processed automatically once completed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
