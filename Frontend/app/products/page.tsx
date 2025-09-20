"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockSweets, categories } from "@/lib/mock-data"
import { Search, ShoppingCart, Leaf, Heart } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  // Filter and sort products
  const filteredSweets = mockSweets
    .filter((sweet) => {
      const matchesSearch =
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || sweet.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handlePurchase = (sweet: any) => {
    if (!user) {
      router.push("/login")
      return
    }

    addToCart(sweet)
    // Optional: Show a toast notification here
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Sweet Collection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handcrafted traditional Indian sweets, made with the finest ingredients and time-honored
            recipes
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map((sweet) => (
            <Card key={sweet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted">
                <Image src={sweet.image || "/placeholder.svg"} alt={sweet.name} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {sweet.isVegetarian && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Leaf className="h-3 w-3 mr-1" />
                      Veg
                    </Badge>
                  )}
                  {sweet.isVegan && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Heart className="h-3 w-3 mr-1" />
                      Vegan
                    </Badge>
                  )}
                </div>
                {sweet.quantity === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{sweet.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {sweet.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{sweet.price}</p>
                    <p className="text-sm text-muted-foreground">{sweet.weight}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">{sweet.description}</CardDescription>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {sweet.ingredients.slice(0, 3).map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {sweet.ingredients.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{sweet.ingredients.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {sweet.quantity > 0 ? `${sweet.quantity} available` : "Out of stock"}
                  </p>
                  <Button
                    onClick={() => handlePurchase(sweet)}
                    disabled={sweet.quantity === 0}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {sweet.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No sweets found message */}
        {filteredSweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No sweets found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
