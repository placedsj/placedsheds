// Customer Dashboard - Protected page showing user's quotes
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, LogOut } from "lucide-react";
import type { CustomerQuote, ShedDesign } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your dashboard...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: quotes, isLoading: quotesLoading } = useQuery<CustomerQuote[]>({
    queryKey: ["/api/customer-quotes"],
    enabled: isAuthenticated,
  });

  const { data: designs } = useQuery<ShedDesign[]>({
    queryKey: ["/api/shed-designs"],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="w-32 h-8" />
      </div>
    );
  }

  const designMap = new Map(designs?.map(d => [d.id, d]) || []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">My Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-home">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <a href="/api/logout">
              <Button variant="ghost" size="sm" data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">
            Welcome back, {user?.firstName || user?.email || "User"}!
          </h2>
          <p className="text-muted-foreground">
            View and manage your shed quote requests
          </p>
        </div>

        {quotesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : quotes && quotes.length > 0 ? (
          <div className="grid gap-4">
            {quotes.map((quote) => {
              const design = designMap.get(quote.shedDesignId);
              return (
                <Card key={quote.id} data-testid={`card-quote-${quote.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Quote Request #{quote.id.slice(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                          Contact Information
                        </h3>
                        <p className="text-sm" data-testid={`text-customer-name-${quote.id}`}>
                          <span className="font-medium">Name:</span> {quote.customerName}
                        </p>
                        <p className="text-sm" data-testid={`text-email-${quote.id}`}>
                          <span className="font-medium">Email:</span> {quote.email}
                        </p>
                        <p className="text-sm" data-testid={`text-phone-${quote.id}`}>
                          <span className="font-medium">Phone:</span> {quote.phone}
                        </p>
                        {quote.address && (
                          <p className="text-sm">
                            <span className="font-medium">Address:</span> {quote.address}
                          </p>
                        )}
                      </div>

                      {design && (
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground mb-2">
                            Shed Configuration
                          </h3>
                          <p className="text-sm">
                            <span className="font-medium">Size:</span> {design.size}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Style:</span> {design.style}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Total:</span> ${design.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${design.monthlyPayment.toFixed(2)}/mo for 36 months
                          </p>
                        </div>
                      )}
                    </div>

                    {quote.message && (
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">
                          Message
                        </h3>
                        <p className="text-sm">{quote.message}</p>
                      </div>
                    )}

                    {quote.sitePhotos && quote.sitePhotos.length > 0 && (
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                          Site Photos ({quote.sitePhotos.length})
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          {quote.sitePhotos.map((photo, idx) => (
                            <img
                              key={idx}
                              src={photo}
                              alt={`Site photo ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded border"
                              data-testid={`img-site-photo-${quote.id}-${idx}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't submitted any quote requests yet.
              </p>
              <Link href="/">
                <Button data-testid="button-get-started">
                  Get Started with LunAI Designer
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
