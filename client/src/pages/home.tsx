import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Home, Lightbulb, Zap, CheckCircle2, Star, User, LogIn } from "lucide-react";
import { ShedDesigner } from "@/components/shed-designer";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const [showDesigner, setShowDesigner] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (showDesigner) {
    return <ShedDesigner onBack={() => setShowDesigner(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-primary">PLACED</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sheds" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-sheds">
              Sheds
            </a>
            <a href="#roofing" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-roofing">
              Roofing
            </a>
            <a href="#lights" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-lights">
              Holiday Lights
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-contact">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {!isLoading && (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="default" data-testid="button-dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <a href="/api/login">
                  <Button variant="ghost" size="default" data-testid="button-login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </a>
              )
            )}
            <Button 
              onClick={() => setShowDesigner(true)} 
              size="default"
              data-testid="button-start-designing-nav"
            >
              Start Designing
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/30 to-background py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Design Your Dream Shed in 5 Minutes
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-muted-foreground">
              AI-powered shed designer. Instant quotes. Built in 2 weeks.
            </p>
            <Button 
              size="lg" 
              onClick={() => setShowDesigner(true)}
              className="h-12 px-8 text-lg"
              data-testid="button-start-designing-hero"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Designing
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <Card className="hover-elevate transition-all duration-300" data-testid="card-feature-ai">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Design</CardTitle>
                <CardDescription>
                  LunAI guides you through every decision with intelligent recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-300" data-testid="card-feature-instant">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Quotes</CardTitle>
                <CardDescription>
                  Real-time pricing with transparent breakdowns and 0% financing options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-300" data-testid="card-feature-fast">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Hammer className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Build Time</CardTitle>
                <CardDescription>
                  Professional installation in just 2 weeks from design to delivery
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sheds" className="py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Professional home services tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Sheds Card */}
            <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid="card-service-sheds">
              <div className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Home className="h-20 w-20 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Custom Sheds</CardTitle>
                <CardDescription>
                  Design your perfect shed with our AI-powered tool. Choose size, style, materials, and add-ons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowDesigner(true)}
                  data-testid="button-learn-more-sheds"
                >
                  Start Designing
                </Button>
              </CardContent>
            </Card>

            {/* Roofing Card */}
            <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid="card-service-roofing">
              <div id="roofing" className="aspect-[16/10] bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center">
                <Hammer className="h-20 w-20 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Professional Roofing</CardTitle>
                <CardDescription>
                  Expert roofing services including repairs, replacements, and new installations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" data-testid="button-learn-more-roofing">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Holiday Lights Card */}
            <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid="card-service-lights">
              <div id="lights" className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Lightbulb className="h-20 w-20 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Holiday Lights</CardTitle>
                <CardDescription>
                  Professional holiday light installation and removal for stunning seasonal displays.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" data-testid="button-learn-more-lights">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-accent/30 py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">What Our Customers Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                quote: "The AI designer made choosing options so easy! My shed was built in exactly 2 weeks.",
                rating: 5,
              },
              {
                name: "Mike Peters",
                quote: "Transparent pricing and professional service. Highly recommend PLACED!",
                rating: 5,
              },
              {
                name: "Jennifer Lee",
                quote: "Beautiful craftsmanship and the 0% financing made it affordable. Love my new shed!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} data-testid={`card-testimonial-${idx}`}>
                <CardHeader>
                  <div className="mb-2 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t bg-card py-12">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">PLACED</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Your Home, Our Hands™
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#sheds" className="hover-elevate px-2 py-1 rounded-md inline-block transition-colors" data-testid="link-footer-sheds">Custom Sheds</a></li>
                <li><a href="#roofing" className="hover-elevate px-2 py-1 rounded-md inline-block transition-colors" data-testid="link-footer-roofing">Roofing</a></li>
                <li><a href="#lights" className="hover-elevate px-2 py-1 rounded-md inline-block transition-colors" data-testid="link-footer-lights">Holiday Lights</a></li>
                <li><a href="https://hhplaced.replit.app" target="_blank" rel="noopener noreferrer" className="hover-elevate px-2 py-1 rounded-md inline-block transition-colors font-semibold" data-testid="link-footer-handbook">Home Owner's Handbook</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: <a href="mailto:hello@placed.com" className="text-primary hover:underline" data-testid="link-footer-email">hello@placed.com</a></li>
                <li>Phone: <a href="tel:5066502122" className="text-primary hover:underline font-semibold" data-testid="link-footer-phone">(506) 650-2122</a></li>
                <li>Available 7 days a week</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">BROUGHT TO YOU BY YOUR FRIENDS AT PLACED YOUR HOME OUR HANDS™</p>
            <p>&copy; 2025 PLACED. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
