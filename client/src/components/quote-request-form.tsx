import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { ShedConfiguration } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuoteRequestFormProps {
  shedDesignId: string;
  design: ShedConfiguration;
  pricing: {
    total: number;
    monthlyPayment: number;
  };
  onBack: () => void;
}

export function QuoteRequestForm({ shedDesignId, design, pricing, onBack }: QuoteRequestFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitQuoteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/request-quote", {
        shedDesignId,
        ...data,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Quote Requested Successfully!",
        description: "We'll get back to you within 24 hours with your detailed build document.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuoteMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full" data-testid="card-quote-success">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Quote Requested!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for choosing PLACED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-accent/50 p-6 space-y-4">
              <h3 className="font-semibold text-lg">What Happens Next?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-primary">1.</span>
                  <span>We'll review your custom shed design and pricing</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-primary">2.</span>
                  <span>Our team will prepare a detailed build document with specifications</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-primary">3.</span>
                  <span>You'll receive an email within 24 hours with your quote and next steps</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-primary">4.</span>
                  <span>Once approved, we'll build and deliver your shed in just 2 weeks!</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-3">Your Design Summary</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{design.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style:</span>
                  <span className="font-medium">{design.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">${pricing.total.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => window.location.href = "/"} 
              className="w-full" 
              size="lg"
              data-testid="button-return-home"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-designer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <span className="font-semibold">Request Quote</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card data-testid="card-quote-form">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Tell us where to send your detailed quote and build document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    data-testid="input-customer-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Installation Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St, City, Province"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    data-testid="input-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Notes</Label>
                  <Textarea
                    id="message"
                    placeholder="Any special requirements or questions?"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitQuoteMutation.isPending}
                  data-testid="button-submit-quote"
                >
                  {submitQuoteMutation.isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Quote Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Design Summary */}
          <div className="space-y-6">
            <Card data-testid="card-quote-summary">
              <CardHeader>
                <CardTitle>Your Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{design.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <span className="font-medium">{design.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Siding:</span>
                    <span className="font-medium">{design.siding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Roof:</span>
                    <span className="font-medium">{design.roof}</span>
                  </div>
                  {design.addons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Add-ons:</span>
                      <span className="font-medium">{design.addons.length}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">${pricing.total.toFixed(2)}</span>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Or ${pricing.monthlyPayment}/month
                    </p>
                    <p className="text-xs text-muted-foreground">
                      36 months, 0% interest
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Professional installation in 2 weeks</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>10-year structural warranty</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Free site assessment included</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>0% financing available (OAC)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
