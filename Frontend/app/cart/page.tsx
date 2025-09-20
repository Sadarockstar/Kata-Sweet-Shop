"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CartPage() {
  const { user } = useAuth()
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">Please Login</CardTitle>
              <CardDescription className="mb-4">You need to be logged in to view your cart</CardDescription>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty!")
      return
    }

    const orderSummary = items.map((item) => `${item.quantity}x ${item.sweet.name}`).join(", ")
    const confirmed = confirm(
      `Confirm your order:\n\n${orderSummary}\n\nTotal: ₹${total.toFixed(2)}\n\nProceed with checkout?`,
    )

    if (confirmed) {
      alert("Order placed successfully! Thank you for shopping with KataSweetShop.")
      clearCart()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="mb-2">Your cart is empty</CardTitle>
                <CardDescription className="mb-4">Add some delicious sweets to get started!</CardDescription>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.sweet.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden">
                          <Image
                            src={item.sweet.image || "/placeholder.svg"}
                            alt={item.sweet.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.sweet.name}</h3>
                          <p className="text-muted-foreground">{item.sweet.weight}</p>
                          <p className="text-primary font-bold">₹{item.sweet.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.sweet.id, Number.parseInt(e.target.value) || 0)}
                            className="w-16 text-center"
                            min="0"
                            max={item.sweet.quantity}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                            disabled={item.quantity >= item.sweet.quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.sweet.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                      Clear Cart
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
