import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// From Replit Auth blueprint - Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// From Replit Auth blueprint - User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  sitePhotos: text("site_photos").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertShedDesignSchema = createInsertSchema(shedDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerQuoteSchema = createInsertSchema(customerQuotes, {
  sitePhotos: z.array(z.string()).default([]),
}).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
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
