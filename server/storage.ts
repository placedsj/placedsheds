import { 
  type ShedDesign, 
  type InsertShedDesign,
  type CustomerQuote,
  type InsertCustomerQuote,
  type User,
  type UpsertUser,
  shedDesigns,
  customerQuotes,
  users
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
  // From Replit Auth blueprint - User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  private users: Map<string, User>;

  constructor() {
    this.shedDesigns = new Map();
    this.customerQuotes = new Map();
    this.users = new Map();
  }

  // From Replit Auth blueprint - User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...userData,
      id: userData.id ?? randomUUID(),
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
    };
    this.users.set(user.id, user);
    return user;
  }

  // Shed Designs
  async createShedDesign(insertDesign: InsertShedDesign): Promise<ShedDesign> {
    const id = randomUUID();
    const design: ShedDesign = { 
      ...insertDesign,
      addons: insertDesign.addons ?? [],
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
      address: insertQuote.address ?? null,
      message: insertQuote.message ?? null,
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
  // From Replit Auth blueprint - User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

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
