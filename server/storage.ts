import { 
  type ShedDesign, 
  type InsertShedDesign,
  type CustomerQuote,
  type InsertCustomerQuote
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Shed Designs
  createShedDesign(design: InsertShedDesign): Promise<ShedDesign>;
  getShedDesign(id: string): Promise<ShedDesign | undefined>;
  getAllShedDesigns(): Promise<ShedDesign[]>;
  
  // Customer Quotes
  createCustomerQuote(quote: InsertCustomerQuote): Promise<CustomerQuote>;
  getCustomerQuote(id: string): Promise<CustomerQuote | undefined>;
  getAllCustomerQuotes(): Promise<CustomerQuote[]>;
  getQuotesByShedDesign(shedDesignId: string): Promise<CustomerQuote[]>;
}

export class MemStorage implements IStorage {
  private shedDesigns: Map<string, ShedDesign>;
  private customerQuotes: Map<string, CustomerQuote>;

  constructor() {
    this.shedDesigns = new Map();
    this.customerQuotes = new Map();
  }

  // Shed Designs
  async createShedDesign(insertDesign: InsertShedDesign): Promise<ShedDesign> {
    const id = randomUUID();
    const design: ShedDesign = { 
      ...insertDesign, 
      id,
      createdAt: new Date()
    };
    this.shedDesigns.set(id, design);
    return design;
  }

  async getShedDesign(id: string): Promise<ShedDesign | undefined> {
    return this.shedDesigns.get(id);
  }

  async getAllShedDesigns(): Promise<ShedDesign[]> {
    return Array.from(this.shedDesigns.values());
  }

  // Customer Quotes
  async createCustomerQuote(insertQuote: InsertCustomerQuote): Promise<CustomerQuote> {
    const id = randomUUID();
    const quote: CustomerQuote = {
      ...insertQuote,
      id,
      createdAt: new Date()
    };
    this.customerQuotes.set(id, quote);
    return quote;
  }

  async getCustomerQuote(id: string): Promise<CustomerQuote | undefined> {
    return this.customerQuotes.get(id);
  }

  async getAllCustomerQuotes(): Promise<CustomerQuote[]> {
    return Array.from(this.customerQuotes.values());
  }

  async getQuotesByShedDesign(shedDesignId: string): Promise<CustomerQuote[]> {
    return Array.from(this.customerQuotes.values()).filter(
      (quote) => quote.shedDesignId === shedDesignId
    );
  }
}

export const storage = new MemStorage();
