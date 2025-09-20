import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, Heart, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 floral-pattern">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Welcome to <span className="text-primary">KataSweetShop</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Discover the authentic taste of traditional Indian sweets, crafted with love and time-honored recipes
              passed down through generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">Explore Our Sweets</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Join Our Family</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose KataSweetShop?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Made with finest ingredients and traditional methods for authentic taste
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Made with Love</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Every sweet is crafted with care by our experienced artisans</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Perfect for Gifting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Beautiful packaging makes our sweets perfect for festivals and celebrations
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Popular Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Milk-based", "Dry Fruits", "Fried", "Traditional"].map((category) => (
              <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍯</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category}</h3>
                  <Badge variant="secondary">View All</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Taste Tradition?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust KataSweetShop for authentic Indian sweets
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Start Shopping Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 KataSweetShop. Made with ❤️ for sweet lovers everywhere.</p>
        </div>
      </footer>
    </div>
  )
}
