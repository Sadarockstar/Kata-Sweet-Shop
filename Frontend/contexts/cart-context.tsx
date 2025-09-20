"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Sweet, CartItem } from "@/lib/types"

interface CartContextType {
  items: CartItem[]
  addToCart: (sweet: Sweet, quantity?: number) => void
  removeFromCart: (sweetId: string) => void
  updateQuantity: (sweetId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("kata-sweet-shop-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("kata-sweet-shop-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (sweet: Sweet, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.sweet.id === sweet.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.sweet.id === sweet.id ? { ...item, quantity: Math.min(item.quantity + quantity, sweet.quantity) } : item,
        )
      } else {
        return [...prevItems, { sweet, quantity: Math.min(quantity, sweet.quantity) }]
      }
    })
  }

  const removeFromCart = (sweetId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.sweet.id !== sweetId))
  }

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.sweet.id === sweetId ? { ...item, quantity: Math.min(quantity, item.sweet.quantity) } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.sweet.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
