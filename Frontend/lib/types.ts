export interface Sweet {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  quantity: number
  ingredients: string[]
  isVegetarian: boolean
  isVegan: boolean
  weight: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  createdAt: Date
}

export interface CartItem {
  sweet: Sweet
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  createdAt: Date
}
