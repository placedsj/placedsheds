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
    <div className="min-h-screen bg-gradient-primary">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full dark-nav">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-vibrant-yellow" />
            <span className="text-2xl font-bold text-vibrant-yellow" style={{fontFamily: "'Luckiest Guy', cursive", letterSpacing: '0.05em'}}>PLACED</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sheds" className="text-sm font-semibold text-white/90 hover:text-vibrant-yellow px-3 py-2 rounded-md transition-colors uppercase tracking-wide" data-testid="link-sheds">
              Sheds
            </a>
            <a href="#roofing" className="text-sm font-semibold text-white/90 hover:text-vibrant-yellow px-3 py-2 rounded-md transition-colors uppercase tracking-wide" data-testid="link-roofing">
              Roofing
            </a>
            <a href="#lights" className="text-sm font-semibold text-white/90 hover:text-vibrant-yellow px-3 py-2 rounded-md transition-colors uppercase tracking-wide" data-testid="link-lights">
              Holiday Lights
            </a>
            <a href="#contact" className="text-sm font-semibold text-white/90 hover:text-vibrant-yellow px-3 py-2 rounded-md transition-colors uppercase tracking-wide" data-testid="link-contact">
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
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="heading-hero animate-glow mb-8">
              DESIGN YOUR DREAM SHED IN 5 MINUTES
            </h1>
            <p className="mb-10 text-xl md:text-2xl text-white/80 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>
              AI-powered shed designer. Instant quotes. Built in 2 weeks.
            </p>
            <button 
              onClick={() => setShowDesigner(true)}
              className="btn-primary inline-flex items-center gap-2"
              data-testid="button-start-designing-hero"
            >
              <Zap className="h-5 w-5" />
              START DESIGNING
            </button>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <div className="card-primary" data-testid="card-feature-ai">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-vibrant-yellow/10">
                <Zap className="h-8 w-8 text-vibrant-yellow" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-vibrant-yellow uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                AI-Powered Design
              </h3>
              <p className="text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                LunAI guides you through every decision with intelligent recommendations
              </p>
            </div>

            <div className="card-primary" data-testid="card-feature-instant">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-vibrant-yellow/10">
                <CheckCircle2 className="h-8 w-8 text-vibrant-yellow" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-vibrant-yellow uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                Instant Quotes
              </h3>
              <p className="text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                Real-time pricing with transparent breakdowns and 0% financing options
              </p>
            </div>

            <div className="card-primary" data-testid="card-feature-fast">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-vibrant-yellow/10">
                <Hammer className="h-8 w-8 text-vibrant-yellow" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-vibrant-yellow uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                Fast Build Time
              </h3>
              <p className="text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                Professional installation in just 2 weeks from design to delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sheds" className="py-20 md:py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-section text-vibrant-yellow mb-4">OUR SERVICES</h2>
            <p className="text-lg text-white/70 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>
              Professional home services tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Sheds Card */}
            <div className="card-secondary overflow-hidden" data-testid="card-service-sheds">
              <div className="aspect-[16/10] bg-gradient-to-br from-vibrant-teal/20 to-vibrant-purple/10 flex items-center justify-center mb-6">
                <Home className="h-24 w-24 text-vibrant-teal" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-vibrant-teal uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                Custom Sheds
              </h3>
              <p className="mb-6 text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                Design your perfect shed with our AI-powered tool. Choose size, style, materials, and add-ons.
              </p>
              <button 
                onClick={() => setShowDesigner(true)}
                className="btn-primary w-full"
                data-testid="button-learn-more-sheds"
              >
                START DESIGNING
              </button>
            </div>

            {/* Roofing Card */}
            <div id="roofing" className="card-secondary overflow-hidden" data-testid="card-service-roofing">
              <div className="aspect-[16/10] bg-gradient-to-br from-vibrant-purple/20 to-vibrant-teal/10 flex items-center justify-center mb-6">
                <Hammer className="h-24 w-24 text-vibrant-purple" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-vibrant-purple uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                Professional Roofing
              </h3>
              <p className="mb-6 text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                Expert roofing services including repairs, replacements, and new installations.
              </p>
              <button className="btn-secondary w-full" data-testid="button-learn-more-roofing">
                LEARN MORE
              </button>
            </div>

            {/* Holiday Lights Card */}
            <div id="lights" className="card-secondary overflow-hidden" data-testid="card-service-lights">
              <div className="aspect-[16/10] bg-gradient-to-br from-vibrant-yellow/20 to-vibrant-teal/10 flex items-center justify-center mb-6">
                <Lightbulb className="h-24 w-24 text-vibrant-yellow" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-vibrant-yellow uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>
                Holiday Lights
              </h3>
              <p className="mb-6 text-white/70 text-base" style={{fontFamily: "'Poppins', sans-serif"}}>
                Professional holiday light installation and removal for stunning seasonal displays.
              </p>
              <button className="btn-secondary w-full" data-testid="button-learn-more-lights">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-black/20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-section text-vibrant-teal mb-4">WHAT OUR CUSTOMERS SAY</h2>
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
              <div key={idx} className="card-tertiary" data-testid={`card-testimonial-${idx}`}>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-vibrant-yellow text-vibrant-yellow" />
                  ))}
                </div>
                <p className="mb-4 text-white/80 text-base italic" style={{fontFamily: "'Poppins', sans-serif"}}>
                  "{testimonial.quote}"
                </p>
                <p className="font-bold text-vibrant-purple uppercase tracking-wide" style={{fontFamily: "'Poppins', sans-serif"}}>
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="dark-footer py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3 mb-12">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Home className="h-8 w-8 text-vibrant-yellow" />
                <span className="text-3xl font-bold text-vibrant-yellow" style={{fontFamily: "'Luckiest Guy', cursive", letterSpacing: '0.05em'}}>PLACED</span>
              </div>
              <p className="text-white/70 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>
                YOUR HOME, OUR HANDS™
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-bold text-vibrant-teal uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>Quick Links</h3>
              <ul className="space-y-3 text-base">
                <li><a href="#sheds" className="text-white/80 hover:text-vibrant-yellow transition-colors font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Custom Sheds</a></li>
                <li><a href="#roofing" className="text-white/80 hover:text-vibrant-yellow transition-colors font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Roofing</a></li>
                <li><a href="#lights" className="text-white/80 hover:text-vibrant-yellow transition-colors font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Holiday Lights</a></li>
                <li><a href="https://hhplaced.replit.app" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-vibrant-yellow transition-colors font-bold uppercase tracking-wide" style={{fontFamily: "'Poppins', sans-serif"}}>HOME OWNER'S HANDBOOK</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-xl font-bold text-vibrant-teal uppercase tracking-wide" style={{fontFamily: "'Luckiest Guy', cursive"}}>Contact Us</h3>
              <ul className="space-y-3 text-base">
                <li className="text-white/80 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Email: <a href="mailto:hello@placed.com" className="text-vibrant-yellow hover:text-vibrant-teal transition-colors">hello@placed.com</a></li>
                <li className="text-white/80 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Phone: <a href="tel:5066502122" className="text-vibrant-yellow hover:text-vibrant-teal transition-colors font-bold">(506) 650-2122</a></li>
                <li className="text-white/70 font-medium" style={{fontFamily: "'Poppins', sans-serif"}}>Available 7 days a week</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-vibrant-yellow font-bold text-lg uppercase tracking-widest mb-3" style={{fontFamily: "'Luckiest Guy', cursive"}}>
              BROUGHT TO YOU BY YOUR FRIENDS AT PLACED YOUR HOME OUR HANDS™
            </p>
            <p className="text-white/50 text-sm" style={{fontFamily: "'Poppins', sans-serif"}}>
              &copy; 2025 PLACED. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
