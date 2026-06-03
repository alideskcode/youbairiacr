"use client"

import { useRouter } from "next/navigation"
import { useCartStore } from "@/app/store/cart"
import { useOrderStore } from "@/app/store/orders"
import { Separator } from "@/components/ui/separator"
import { UPIPayment } from "@/components/upi-payment"
import { UPIQRCode } from "@/components/upi-qr-code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const addOrder = useOrderStore((state) => state.addOrder)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qr")

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handlePaymentComplete = async () => {
    try {
      // Add order to store
      addOrder(items, total)
      // Clear cart
      await clearCart()
      // Redirect to orders page
      router.push("/orders")
    } catch (error) {
      console.error("Failed to complete checkout:", error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground">Please add items to your cart before checking out.</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-6">
            <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="upi" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Direct UPI
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="qr" className="mt-6">
                <UPIQRCode 
                  amount={total} 
                  description="Payment for Digital Products"
                  onPaymentComplete={handlePaymentComplete}
                />
              </TabsContent>
              
              <TabsContent value="upi" className="mt-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Direct UPI Payment</h3>
                  <UPIPayment 
                    amount={total} 
                    onPaymentComplete={handlePaymentComplete}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Payment Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Payment Instructions
              </h3>
              <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                <p><strong>QR Code Method:</strong> Scan the QR code with any UPI app</p>
                <p><strong>Direct UPI Method:</strong> Click the button to open your UPI app directly</p>
                <p className="mt-2 text-xs">Both methods will send payment to our official Paytm UPI ID</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
