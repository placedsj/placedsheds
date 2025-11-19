import { 
  type ShedDesign, 
  type InsertShedDesign,
  type CustomerQuote,
  type InsertCustomerQuote,
  shedDesigns,
  customerQuotes
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

// Database connection setup
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Graceful shutdown handler
export async function closeDatabase() {
  await pool.end();
}

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

// MemStorage kept for local testing without database
// In production, DbStorage is used with PostgreSQL
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

export class DbStorage implements IStorage {
  // Shed Designs
  async createShedDesign(insertDesign: InsertShedDesign): Promise<ShedDesign> {
    const [design] = await db.insert(shedDesigns).values(insertDesign).returning();
    return design;
  }

  async getShedDesign(id: string): Promise<ShedDesign | undefined> {
    const [design] = await db.select().from(shedDesigns).where(eq(shedDesigns.id, id));
    return design;
  }

  async getAllShedDesigns(): Promise<ShedDesign[]> {
    return await db.select().from(shedDesigns);
  }

  // Customer Quotes
  async createCustomerQuote(insertQuote: InsertCustomerQuote): Promise<CustomerQuote> {
    const [quote] = await db.insert(customerQuotes).values(insertQuote).returning();
    return quote;
  }

  async getCustomerQuote(id: string): Promise<CustomerQuote | undefined> {
    const [quote] = await db.select().from(customerQuotes).where(eq(customerQuotes.id, id));
    return quote;
  }

  async getAllCustomerQuotes(): Promise<CustomerQuote[]> {
    return await db.select().from(customerQuotes);
  }

  async getQuotesByShedDesign(shedDesignId: string): Promise<CustomerQuote[]> {
    return await db.select().from(customerQuotes).where(eq(customerQuotes.shedDesignId, shedDesignId));
  }
}

export const storage = new DbStorage();
