import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import { mkdirSync, existsSync } from "fs";
import path from "path";

// Validation schemas
const calculatePriceSchema = z.object({
  size: z.string(),
  style: z.string(),
  siding: z.string(),
  roof: z.string(),
  addons: z.array(z.string()),
});

const requestQuoteSchema = z.object({
  shedDesignId: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  message: z.string().optional(),
  sitePhotos: z.array(z.string()).optional(),
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Upload site photos
  app.post("/api/upload-photos", upload.array("photos", 5), (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const filePaths = files.map(file => `/uploads/${file.filename}`);
      res.json({ success: true, filePaths });
    } catch (error) {
      console.error("Error uploading photos:", error);
      res.status(500).json({ error: "Failed to upload photos" });
    }
  });

  // Calculate shed price
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const data = calculatePriceSchema.parse(req.body);

      // Base pricing based on size
      const basePrices: Record<string, number> = {
        "8x10 ($3,500)": 1580,
        "10x12 ($4,200)": 2150,
        "12x16 ($6,500)": 2950,
        "12x20 ($8,000)": 3800,
      };

      let materialsCost = basePrices[data.size] || 2150;

      // Add siding upcharges
      if (data.siding.includes("Vinyl")) {
        materialsCost += 800;
      } else if (data.siding.includes("Cedar")) {
        materialsCost += 1200;
      }

      // Add roof upcharges
      if (data.roof.includes("Metal")) {
        materialsCost += 400;
      }

      // Calculate add-ons cost
      const addonCosts: Record<string, number> = {
        "Extra Windows (+$150)": 150,
        "Skylights (+$300)": 300,
        "Electrical (+$800)": 800,
      };

      let addonsCost = 0;
      for (const addon of data.addons) {
        addonsCost += addonCosts[addon] || 0;
      }

      // Labor is flat $2000
      const laborCost = 2000;

      // Calculate totals
      const subtotal = materialsCost + laborCost + addonsCost;
      const tax = subtotal * 0.15; // 15% HST
      const total = subtotal + tax;
      const monthlyPayment = Math.round((total / 36) * 100) / 100;

      // Save the shed design to storage
      const shedDesign = await storage.createShedDesign({
        size: data.size,
        style: data.style,
        siding: data.siding,
        roof: data.roof,
        addons: data.addons,
        materialsCost,
        laborCost,
        addonsCost,
        subtotal,
        tax,
        total,
        monthlyPayment,
      });

      res.json({
        materialsCost,
        laborCost,
        addonsCost,
        subtotal,
        tax,
        total,
        monthlyPayment,
        shedDesignId: shedDesign.id,
      });
    } catch (error) {
      console.error("Error calculating price:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to calculate price" });
      }
    }
  });

  // Request quote
  app.post("/api/request-quote", async (req, res) => {
    try {
      console.log("Quote request received:", JSON.stringify(req.body, null, 2));
      const data = requestQuoteSchema.parse(req.body);
      console.log("Quote request validated:", JSON.stringify(data, null, 2));

      // Verify shed design exists
      const shedDesign = await storage.getShedDesign(data.shedDesignId);
      if (!shedDesign) {
        return res.status(404).json({ error: "Shed design not found" });
      }

      // Create customer quote
      const quote = await storage.createCustomerQuote({
        shedDesignId: data.shedDesignId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address || null,
        message: data.message || null,
        sitePhotos: data.sitePhotos || [],
      });

      res.json({
        success: true,
        quoteId: quote.id,
        message: "Quote request submitted successfully",
      });
    } catch (error) {
      console.error("Error requesting quote:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit quote request" });
      }
    }
  });

  // Get all shed designs (for admin/reference)
  app.get("/api/shed-designs", async (_req, res) => {
    try {
      const designs = await storage.getAllShedDesigns();
      res.json(designs);
    } catch (error) {
      console.error("Error fetching shed designs:", error);
      res.status(500).json({ error: "Failed to fetch shed designs" });
    }
  });

  // Get all customer quotes (for admin/reference)
  app.get("/api/customer-quotes", async (_req, res) => {
    try {
      const quotes = await storage.getAllCustomerQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching customer quotes:", error);
      res.status(500).json({ error: "Failed to fetch customer quotes" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
