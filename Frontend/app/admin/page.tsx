"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockSweets, categories } from "@/lib/mock-data"
import type { Sweet } from "@/lib/types"
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>(mockSweets)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [newSweet, setNewSweet] = useState<Partial<Sweet>>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Traditional",
    quantity: 0,
    ingredients: [],
    isVegetarian: true,
    isVegan: false,
    weight: "500g",
  })

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    router.push("/")
    return null
  }

  const handleAddSweet = () => {
    if (!newSweet.name || !newSweet.description || !newSweet.price) {
      alert("Please fill in all required fields")
      return
    }

    const sweet: Sweet = {
      id: Date.now().toString(),
      name: newSweet.name!,
      description: newSweet.description!,
      price: newSweet.price!,
      image: newSweet.image || "/indian-sweet.jpg",
      category: newSweet.category!,
      quantity: newSweet.quantity!,
      ingredients: newSweet.ingredients!,
      isVegetarian: newSweet.isVegetarian!,
      isVegan: newSweet.isVegan!,
      weight: newSweet.weight!,
    }

    setSweets([...sweets, sweet])
    setNewSweet({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "Traditional",
      quantity: 0,
      ingredients: [],
      isVegetarian: true,
      isVegan: false,
      weight: "500g",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditSweet = () => {
    if (!editingSweet) return

    setSweets(sweets.map((sweet) => (sweet.id === editingSweet.id ? editingSweet : sweet)))
    setEditingSweet(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteSweet = (id: string) => {
    if (confirm("Are you sure you want to delete this sweet?")) {
      setSweets(sweets.filter((sweet) => sweet.id !== id))
    }
  }

  const openEditDialog = (sweet: Sweet) => {
    setEditingSweet({ ...sweet })
    setIsEditDialogOpen(true)
  }

  // Dashboard stats
  const totalProducts = sweets.length
  const outOfStock = sweets.filter((s) => s.quantity === 0).length
  const totalValue = sweets.reduce((sum, sweet) => sum + sweet.price * sweet.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your sweet shop inventory</p>
          </div>
          <Badge variant="default" className="px-4 py-2">
            Administrator
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{outOfStock}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length - 1}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Added new product: Gulab Jamun</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Updated stock: Kaju Katli (15 units)</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Product out of stock: Jalebi</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sweet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Sweet</DialogTitle>
                    <DialogDescription>Fill in the details to add a new sweet to your inventory</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={newSweet.name}
                          onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })}
                          placeholder="Sweet name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newSweet.price}
                          onChange={(e) => setNewSweet({ ...newSweet, price: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newSweet.description}
                        onChange={(e) => setNewSweet({ ...newSweet, description: e.target.value })}
                        placeholder="Describe the sweet"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newSweet.category}
                          onValueChange={(value) => setNewSweet({ ...newSweet, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newSweet.quantity}
                          onChange={(e) => setNewSweet({ ...newSweet, quantity: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={newSweet.weight}
                          onChange={(e) => setNewSweet({ ...newSweet, weight: e.target.value })}
                          placeholder="500g"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                      <Input
                        id="ingredients"
                        value={newSweet.ingredients?.join(", ")}
                        onChange={(e) =>
                          setNewSweet({
                            ...newSweet,
                            ingredients: e.target.value.split(",").map((i) => i.trim()),
                          })
                        }
                        placeholder="Milk, Sugar, Cardamom"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegetarian"
                          checked={newSweet.isVegetarian}
                          onCheckedChange={(checked) => setNewSweet({ ...newSweet, isVegetarian: !!checked })}
                        />
                        <Label htmlFor="vegetarian">Vegetarian</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegan"
                          checked={newSweet.isVegan}
                          onCheckedChange={(checked) => setNewSweet({ ...newSweet, isVegan: !!checked })}
                        />
                        <Label htmlFor="vegan">Vegan</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSweet}>Add Sweet</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <div className="grid gap-4">
              {sweets.map((sweet) => (
                <Card key={sweet.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden">
                        <Image src={sweet.image || "/placeholder.svg"} alt={sweet.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{sweet.name}</h3>
                            <p className="text-muted-foreground text-sm">{sweet.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(sweet)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteSweet(sweet.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline">{sweet.category}</Badge>
                          <span className="text-primary font-bold">₹{sweet.price}</span>
                          <span className={sweet.quantity === 0 ? "text-destructive" : "text-muted-foreground"}>
                            {sweet.quantity} in stock
                          </span>
                          <span className="text-muted-foreground">{sweet.weight}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Sweet</DialogTitle>
                  <DialogDescription>Update the details of this sweet</DialogDescription>
                </DialogHeader>
                {editingSweet && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editingSweet.name}
                          onChange={(e) => setEditingSweet({ ...editingSweet, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-price">Price (₹)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editingSweet.price}
                          onChange={(e) => setEditingSweet({ ...editingSweet, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editingSweet.description}
                        onChange={(e) => setEditingSweet({ ...editingSweet, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <Select
                          value={editingSweet.category}
                          onValueChange={(value) => setEditingSweet({ ...editingSweet, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-quantity">Quantity</Label>
                        <Input
                          id="edit-quantity"
                          type="number"
                          value={editingSweet.quantity}
                          onChange={(e) => setEditingSweet({ ...editingSweet, quantity: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-weight">Weight</Label>
                        <Input
                          id="edit-weight"
                          value={editingSweet.weight}
                          onChange={(e) => setEditingSweet({ ...editingSweet, weight: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-vegetarian"
                          checked={editingSweet.isVegetarian}
                          onCheckedChange={(checked) => setEditingSweet({ ...editingSweet, isVegetarian: !!checked })}
                        />
                        <Label htmlFor="edit-vegetarian">Vegetarian</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-vegan"
                          checked={editingSweet.isVegan}
                          onCheckedChange={(checked) => setEditingSweet({ ...editingSweet, isVegan: !!checked })}
                        />
                        <Label htmlFor="edit-vegan">Vegan</Label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSweet}>Update Sweet</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    Order management functionality will be implemented in the purchase system phase.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
