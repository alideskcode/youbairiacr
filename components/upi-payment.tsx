


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Smartphone, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getPaytmUpiId } from "@/lib/payment-config"

interface UPIPaymentProps {
  amount: number
  onPaymentComplete: () => void
}

export function UPIPayment({ amount, onPaymentComplete }: UPIPaymentProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")
  const [paymentId, setPaymentId] = useState("")

  // Get the merchant's Paytm UPI ID from configuration
  const merchantUpiId = getPaytmUpiId()

  const initiatePayment = async () => {
    setIsLoading(true)
    
    try {
      // Generate a unique payment ID
      const uniquePaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setPaymentId(uniquePaymentId)

      // Create UPI payment URL with the merchant's UPI ID
      const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=Digital Marketplace&am=${amount}&cu=INR&tn=Payment for Digital Products&tr=${uniquePaymentId}`

      // Open UPI app with payment request
      window.open(upiUrl, "_blank")

      // Simulate payment verification (in real implementation, you'd integrate with UPI APIs)
      toast({
        title: "Payment request sent!",
        description: `Payment will be sent to ${merchantUpiId}`,
      })

      // For demo purposes, we'll simulate a payment verification after 5 seconds
      setTimeout(() => {
        // In real implementation, you'd check payment status via API
        const paymentSuccess = Math.random() > 0.3 // 70% success rate for demo
        
        if (paymentSuccess) {
          setPaymentStatus("success")
          toast({
            title: "Payment successful!",
            description: "Your payment has been processed successfully.",
          })
          setTimeout(() => {
            onPaymentComplete()
          }, 2000)
        } else {
          setPaymentStatus("failed")
          toast({
            title: "Payment failed",
            description: "Please try again or use a different payment method.",
            variant: "destructive",
          })
        }
        setIsLoading(false)
      }, 5000)

    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Payment initiation failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetPayment = () => {
    setPaymentStatus("pending")
    setPaymentId("")
    setIsLoading(false)
  }

  return (
    <>
      <Button className="w-full" size="lg" onClick={() => setShowPaymentModal(true)}>
        Pay with UPI
      </Button>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay with UPI</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-6 py-4">
            {/* Amount Display */}
            <div className="text-center bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Amount to pay</p>
              <p className="text-3xl font-bold">₹{amount.toFixed(2)}</p>
            </div>

            {paymentStatus === "pending" && (
              <>
                {/* Merchant UPI ID Display */}
                <div className="space-y-2">
                  <Label>Payment will be sent to:</Label>
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-mono text-sm font-medium text-green-700 dark:text-green-300">
                      {merchantUpiId}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    This is our official Paytm UPI ID for receiving payments
                  </p>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">How it works:</span>
                  </div>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Click "Send Payment Request" below</li>
                    <li>• You'll receive a notification in your UPI app</li>
                    <li>• Approve the payment in your UPI app</li>
                    <li>• Payment will be sent to our Paytm UPI ID</li>
                  </ul>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={initiatePayment} 
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Payment Request...
                    </>
                  ) : (
                    "Send Payment Request"
                  )}
                </Button>
              </>
            )}

            {paymentStatus === "success" && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment ID: {paymentId}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to orders page...
                </p>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-red-600 dark:text-red-400">✕</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Payment Failed
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please try again or use a different payment method.
                  </p>
                </div>
                <Button onClick={resetPayment} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 