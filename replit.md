# PLACED Platform

## Overview

PLACED is an AI-powered service marketplace platform focused on custom shed design and construction services. The application features an interactive conversational AI (LunAI) that guides users through designing their perfect shed using a chat-based interface with real-time visual previews and pricing calculations.

The platform is built as a full-stack TypeScript application using React for the frontend and Express for the backend, with a PostgreSQL database managed through Drizzle ORM. It provides a modern, trustworthy user experience inspired by Airbnb's aesthetic and Linear's UI patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type safety and modern component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component Strategy**
- Radix UI primitives for accessible, headless component foundations
- shadcn/ui component library (New York style variant) for consistent, customizable UI components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants

**Design System**
- Custom color system using HSL with CSS variables for theme flexibility
- Custom spacing scale (4, 6, 8, 12, 16, 20, 24) following Tailwind conventions
- Typography system using Inter/SF Pro Display with specific hierarchies for headlines, chat messages, pricing displays
- Responsive grid structure (1-2-3 column layouts) with mobile-first approach
- Elevation system using subtle shadows (elevate-1, elevate-2) for depth

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and background updates
- Custom query client configuration with disabled refetching to reduce unnecessary requests
- Form state managed through React Hook Form with Zod validation

**Key User Interface Components**
- Conversational shed designer with step-by-step AI guidance
- Real-time 3D-style preview that updates based on user selections
- Dynamic pricing calculator with material/labor/tax breakdowns
- Quote request form with customer contact information collection

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the stack
- ESM (ECMAScript Modules) as the module system

**API Design**
- RESTful endpoints for shed configuration and quote management
- Zod schemas for request validation at the API boundary
- Centralized route registration pattern
- JSON request/response format with comprehensive error handling

**Session Management**
- Express sessions with connect-pg-simple for PostgreSQL-backed session storage
- Cookie-based session tracking for user state persistence

**Development Experience**
- Custom request/response logging middleware for API observability
- Vite integration in development for HMR and seamless frontend/backend development
- Runtime error overlay for improved debugging

### Data Storage Solutions

**Database**
- PostgreSQL via Neon serverless driver for scalable, connection-pooled database access
- Drizzle ORM for type-safe database queries and schema management
- Migration system through drizzle-kit for version-controlled schema changes

**Schema Design**
- `shed_designs` table: Stores complete shed configurations including size, style, materials, and calculated pricing
- `customer_quotes` table: Stores quote requests linked to shed designs with customer contact information
- UUID primary keys using PostgreSQL's `gen_random_uuid()` for unique identifiers
- Timestamp columns with automatic `defaultNow()` for audit trails

**Storage Abstraction**
- Interface-based storage layer (`IStorage`) allowing for multiple implementations
- In-memory storage implementation (`MemStorage`) for development/testing
- Database storage can be swapped in without changing business logic

### External Dependencies

**Database Services**
- Neon PostgreSQL: Serverless PostgreSQL database with connection pooling
- Uses `@neondatabase/serverless` driver optimized for edge environments

**UI Component Libraries**
- Radix UI: Complete suite of 20+ accessible component primitives including Dialog, Dropdown Menu, Popover, Toast, etc.
- Embla Carousel: Lightweight carousel implementation for image galleries
- cmdk: Command palette implementation for keyboard-driven interfaces
- React Day Picker: Calendar/date picker functionality

**Development Tools**
- Replit-specific plugins: Cartographer (navigation), dev banner, runtime error modal
- tsx: TypeScript execution engine for development server
- esbuild: Fast JavaScript bundler for production builds

**Validation & Forms**
- Zod: Runtime type validation and schema definition
- drizzle-zod: Integration between Drizzle schemas and Zod validators
- @hookform/resolvers: React Hook Form integration with Zod

**Styling Dependencies**
- Tailwind CSS with autoprefixer for cross-browser compatibility
- tailwind-merge & clsx: Utility for merging Tailwind classes intelligently
- class-variance-authority: Type-safe variant API for component styling

**Utility Libraries**
- date-fns: Modern date manipulation and formatting
- nanoid: Compact, URL-safe unique ID generation

**Key Architectural Decisions**

1. **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared code (`shared/`) in a single repository for easier coordination and type sharing
2. **Progressive Enhancement**: Chat interface reveals complexity gradually, starting simple and adding options as needed
3. **Type Safety**: End-to-end TypeScript with shared types between frontend and backend via `shared/schema.ts`
4. **Storage Flexibility**: Abstract storage interface allows switching between in-memory and database implementations without code changes
5. **Real-time Feedback**: Pricing calculations happen immediately as users make selections, building trust through transparency