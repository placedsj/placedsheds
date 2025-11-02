import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, User, Loader2, CheckCircle2 } from "lucide-react";
import { ShedConfiguration } from "@shared/schema";
import { QuoteRequestForm } from "./quote-request-form";
import { ShedPreview } from "./shed-preview";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  options?: string[];
}

interface ShedDesignerProps {
  onBack: () => void;
}

interface PricingData {
  materialsCost: number;
  laborCost: number;
  addonsCost: number;
  subtotal: number;
  tax: number;
  total: number;
  monthlyPayment: number;
  shedDesignId: string;
}

const designSteps = [
  {
    question: "Hi! I'm LunAI. Let's design your perfect shed! What size are you thinking?",
    options: [
      "8x10 ($3,500)",
      "10x12 ($4,200)",
      "12x16 ($6,500)",
      "12x20 ($8,000)",
    ],
    field: "size" as const,
  },
  {
    question: "Great choice! What style catches your eye?",
    options: ["A-Frame", "Lofted Barn", "Modern Saltbox", "Quaker"],
    field: "style" as const,
  },
  {
    question: "Perfect! What siding would you prefer?",
    options: [
      "Smart Panel T1-11 (Included)",
      "Vinyl Dutchlap (+$800)",
      "Cedar (+$1,200)",
    ],
    field: "siding" as const,
  },
  {
    question: "Nice! What type of roof?",
    options: ["Asphalt Shingles (Included)", "Metal Standing Seam (+$400)"],
    field: "roof" as const,
  },
  {
    question: "Almost done! Any add-ons?",
    options: [
      "Extra Windows (+$150)",
      "Skylights (+$300)",
      "Electrical (+$800)",
      "No thanks, calculate price",
    ],
    field: "addons" as const,
  },
];

export function ShedDesigner({ onBack }: ShedDesignerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: designSteps[0].question,
      sender: "ai",
      options: designSteps[0].options,
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [design, setDesign] = useState<ShedConfiguration>({
    size: null,
    style: null,
    siding: null,
    roof: null,
    addons: [],
  });
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculatePriceMutation = useMutation({
    mutationFn: async (designData: ShedConfiguration) => {
      const response = await apiRequest("POST", "/api/calculate-price", designData);
      return await response.json();
    },
    onSuccess: (data: PricingData) => {
      console.log("API Response:", data);
      setPricingData(data);
      const priceMessage: Message = {
        id: Date.now().toString(),
        text: "Perfect! Here's your custom shed pricing:",
        sender: "ai",
      };
      setMessages((prev) => [...prev, priceMessage]);
    },
    onError: (error: any) => {
      console.error("Calculate price error:", error);
    },
  });

  const handleSelection = (selection: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: selection,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    const step = designSteps[currentStep];
    const field = step.field;

    if (field === "addons") {
      if (selection === "No thanks, calculate price" || selection === "Done, calculate price") {
        // Calculate price with current design (don't add the button text as an addon!)
        calculatePriceMutation.mutate(design);
      } else {
        // Add addon to design
        const updatedDesign = {
          ...design,
          addons: [...design.addons, selection],
        };
        setDesign(updatedDesign);

        // Show same addon options again, plus "Done" option
        const continueMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Added! Anything else?",
          sender: "ai",
          options: [
            ...designSteps[4].options.filter((opt) => !updatedDesign.addons.includes(opt)),
            "Done, calculate price",
          ],
        };
        setMessages((prev) => [...prev, continueMessage]);
      }
    } else {
      // Update design with selection
      const updatedDesign = {
        ...design,
        [field]: selection,
      };
      setDesign(updatedDesign);

      // Move to next step
      const nextStep = currentStep + 1;
      if (nextStep < designSteps.length) {
        setCurrentStep(nextStep);
        const nextMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: designSteps[nextStep].question,
          sender: "ai",
          options: designSteps[nextStep].options,
        };
        setMessages((prev) => [...prev, nextMessage]);
      }
    }
  };

  const handleDoneWithAddons = () => {
    calculatePriceMutation.mutate(design);
  };

  if (showQuoteForm && pricingData) {
    return <QuoteRequestForm shedDesignId={pricingData.shedDesignId} design={design} pricing={pricingData} onBack={() => setShowQuoteForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-6">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-home">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">LunAI Shed Designer</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Chat Interface */}
          <div className="space-y-6">
            <Card data-testid="card-chat-interface">
              <CardHeader>
                <CardTitle>Design Your Shed</CardTitle>
                <CardDescription>
                  LunAI will guide you through each step
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "ai" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className={`flex flex-col gap-2 max-w-[80%]`}>
                          <div
                            className={`rounded-lg px-4 py-3 ${
                              message.sender === "ai"
                                ? "bg-card border"
                                : "bg-primary text-primary-foreground"
                            }`}
                            data-testid={`message-${message.sender}-${message.id}`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          {message.options && (
                            <div className="flex flex-wrap gap-2">
                              {message.options.map((option, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (option === "Done, calculate price") {
                                      handleDoneWithAddons();
                                    } else {
                                      handleSelection(option);
                                    }
                                  }}
                                  disabled={calculatePriceMutation.isPending}
                                  className="hover-elevate"
                                  data-testid={`button-option-${idx}`}
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.sender === "user" && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <User className="h-4 w-4 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {calculatePriceMutation.isPending && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-lg border bg-card px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <p className="text-sm">Calculating your custom shed price...</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Current Design Summary */}
            <Card data-testid="card-design-summary">
              <CardHeader>
                <CardTitle className="text-base">Your Current Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {design.size && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Size:</span>
                      <Badge variant="secondary" data-testid="badge-size">{design.size}</Badge>
                    </div>
                  )}
                  {design.style && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Style:</span>
                      <Badge variant="secondary" data-testid="badge-style">{design.style}</Badge>
                    </div>
                  )}
                  {design.siding && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Siding:</span>
                      <Badge variant="secondary" data-testid="badge-siding">{design.siding}</Badge>
                    </div>
                  )}
                  {design.roof && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Roof:</span>
                      <Badge variant="secondary" data-testid="badge-roof">{design.roof}</Badge>
                    </div>
                  )}
                  {design.addons.length > 0 && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-muted-foreground">Add-ons:</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                        {design.addons.map((addon, idx) => (
                          <Badge key={idx} variant="secondary" data-testid={`badge-addon-${idx}`}>
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Pricing */}
          <div className="space-y-6">
            {/* 3D Preview */}
            <ShedPreview design={design} />

            {/* Pricing Display */}
            {pricingData && (
              <Card className="bg-primary text-primary-foreground" data-testid="card-pricing">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Custom Shed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 border-b border-primary-foreground/20 pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Materials:</span>
                      <span className="font-semibold" data-testid="text-materials-cost">
                        ${(pricingData.materialsCost || 0).toFixed(2)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Labor:</span>
                      <span className="font-semibold" data-testid="text-labor-cost">
                        ${(pricingData.laborCost || 0).toFixed(2)} CAD
                      </span>
                    </div>
                    {(pricingData.addonsCost || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="opacity-90">Add-ons:</span>
                        <span className="font-semibold" data-testid="text-addons-cost">
                          ${(pricingData.addonsCost || 0).toFixed(2)} CAD
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Subtotal:</span>
                      <span className="font-semibold" data-testid="text-subtotal">
                        ${(pricingData.subtotal || 0).toFixed(2)} CAD
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Tax (15% HST):</span>
                      <span className="font-semibold" data-testid="text-tax">
                        ${(pricingData.tax || 0).toFixed(2)} CAD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-4xl font-bold" data-testid="text-total">
                        ${(pricingData.total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="rounded-lg bg-primary-foreground/10 p-4 text-center">
                      <p className="text-sm opacity-90 mb-1">Or pay monthly (36 months, 0% interest)</p>
                      <p className="text-2xl font-bold" data-testid="text-monthly-payment">
                        ${pricingData.monthlyPayment || 0}/month
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-card text-card-foreground hover:bg-card/90"
                    size="lg"
                    onClick={() => setShowQuoteForm(true)}
                    data-testid="button-request-quote"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Request Quote & Build Doc
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
