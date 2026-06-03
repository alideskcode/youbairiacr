"use client"

import { useOrderStore } from "@/app/store/orders"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AuthGuard } from "@/components/auth-guard"

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  )
}

function OrdersContent() {
  const orders = useOrderStore((state) => state.orders)

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground">Your order history will appear here.</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>
                      Placed on {format(new Date(order.date), "PPP")}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-semibold">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 