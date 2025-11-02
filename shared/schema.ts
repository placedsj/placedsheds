import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Shed Designs Table
export const shedDesigns = pgTable("shed_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  size: text("size").notNull(),
  style: text("style").notNull(),
  siding: text("siding").notNull(),
  roof: text("roof").notNull(),
  addons: text("addons").array().notNull().default(sql`ARRAY[]::text[]`),
  materialsCost: real("materials_cost").notNull(),
  laborCost: real("labor_cost").notNull(),
  addonsCost: real("addons_cost").notNull(),
  subtotal: real("subtotal").notNull(),
  tax: real("tax").notNull(),
  total: real("total").notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customer Quotes Table
export const customerQuotes = pgTable("customer_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shedDesignId: varchar("shed_design_id").notNull(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertShedDesignSchema = createInsertSchema(shedDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerQuoteSchema = createInsertSchema(customerQuotes).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertShedDesign = z.infer<typeof insertShedDesignSchema>;
export type ShedDesign = typeof shedDesigns.$inferSelect;
export type InsertCustomerQuote = z.infer<typeof insertCustomerQuoteSchema>;
export type CustomerQuote = typeof customerQuotes.$inferSelect;

// Frontend-only types for the design process
export interface DesignStep {
  question: string;
  options: string[];
}

export interface ShedConfiguration {
  size: string | null;
  style: string | null;
  siding: string | null;
  roof: string | null;
  addons: string[];
}

export interface PricingResponse {
  materialsCost: number;
  laborCost: number;
  addonsCost: number;
  subtotal: number;
  tax: number;
  total: number;
  monthlyPayment: number;
  shedDesignId: string;
}
