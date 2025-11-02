# PLACED Platform Design Guidelines

## Design Approach

**Hybrid Reference-Based Strategy**: Drawing inspiration from Airbnb's trustworthy aesthetic, Linear's modern UI patterns, and Shopify's product configurator UX. This service marketplace requires both visual appeal to drive conversions and functional clarity for the interactive designer tool.

**Core Design Principles**:
- Trust through visual polish: High-quality imagery and professional finish
- Conversational clarity: Chat interface feels natural and uncluttered  
- Progressive disclosure: Complexity revealed only when needed
- Instant feedback: Real-time pricing and visual updates create confidence

---

## Typography System

**Font Stack**: 
- Primary: Inter or SF Pro Display via Google Fonts
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Hierarchy**:
- Hero Headlines: 56px/64px (desktop), 36px/42px (mobile), weight 700
- Section Headers: 36px/44px (desktop), 28px/34px (mobile), weight 600
- Chat Messages: 16px/24px, weight 400 (user) / 500 (AI)
- Pricing Display: 48px/56px for total, 24px/32px for breakdown, weight 700/500
- Body Text: 16px/26px, weight 400
- Buttons/CTAs: 16px/20px, weight 600, letter-spacing -0.01em
- Captions: 14px/20px, weight 400, opacity 0.7

---

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (as in p-4, gap-6, mb-8, etc.)

**Grid Structure**:
- Container: max-w-7xl with px-6 (mobile) / px-12 (desktop)
- Designer Tool: Two-column split on desktop (chat 40% / preview 60%), stacked on mobile
- Feature Grids: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)

**Vertical Rhythm**:
- Section padding: py-16 (mobile), py-24 (desktop)
- Component spacing: mb-12 between major elements
- Micro-spacing: gap-4 within cards, gap-6 between related groups

---

## Component Library

### Navigation
- Sticky header with backdrop blur on scroll
- Logo left, horizontal menu center, "Start Designing" CTA right
- Mobile: Hamburger menu with slide-in drawer
- Height: 72px (desktop), 64px (mobile)

### Hero Section
- Full-width background image (custom shed in beautiful backyard setting)
- Centered content with semi-transparent overlay
- Headline + subheadline + primary CTA button
- Height: 85vh with background image, overlay gradient (rgba(0,0,0,0.3))

### LunAI Chat Interface
- White rounded card (border-radius: 16px) with subtle shadow
- Messages: Left-aligned (AI) with teal accent bar, right-aligned (user) with light gray background
- Option buttons: Grid layout, rounded pills with hover states
- Padding: p-8, message bubbles have p-4
- Max-width: 600px for readability

### 3D Shed Preview
- Canvas container with 4:3 aspect ratio
- Floating info tooltips showing selected options
- Subtle rotation animation on option change (200ms ease-out)
- Background: Soft gradient (#F5F5F5 to white)

### Pricing Display Card
- Prominent card with teal background (#21808D)
- White text, breakdown with divider lines
- "Total" emphasized at 1.5x size of line items
- Monthly payment in lighter weight below
- CTA button: White background with teal text

### Service Cards (Sheds/Roofing/Lights)
- Image at top (16:10 ratio), content below
- Title, brief description, "Learn More" link
- Hover: Subtle lift (translateY(-4px)), shadow increase
- Layout: 3-column grid (desktop), stacked (mobile)

### Quote Request Form
- Two-column layout (contact info left, message right)
- Floating labels on inputs
- Teal focus states matching primary color
- Submit button: Full-width on mobile, right-aligned on desktop

### Footer
- Three-column layout: Services, Contact, Social
- Logo and tagline at top
- Background: Dark teal (#13343B), white text
- Height: Auto with py-16

---

## Images

**Hero Section**: 
- Large, high-quality lifestyle image of a completed custom shed in a well-maintained backyard
- Image should show craftsmanship details, natural lighting, aspirational but achievable
- Dimensions: 1920x1080, webp format
- Placement: Full-width background with overlay gradient

**Service Section Images**:
- Sheds: Portfolio of 3-4 different styles (A-Frame, Lofted Barn, Modern)
- Roofing: Before/after comparison shots
- Holiday Lights: Professionally installed display on home
- Dimensions: 800x600 each, arranged in grid

**3D Preview Placeholder**:
- Until 3D renders load, show placeholder illustration of shed wireframe
- Monochrome teal on light background

**Trust Indicators**:
- Customer photo testimonials (authentic, not stock photos)
- Team photos in "About" section
- Completed project gallery (masonry grid, 6-8 images)

---

## Interaction Patterns

**Chat Option Selection**:
- Buttons scale up slightly on hover (1.02x)
- Selected option highlighted with teal border + background tint
- Fade-in animation for new messages (300ms)

**Price Updates**:
- Number counter animation when price changes (400ms)
- Subtle pulse on total when calculation completes

**Form Validation**:
- Inline error messages below fields (red text, small icon)
- Success state: Green checkmark, subtle border color change

**Loading States**:
- Skeleton screens for chat interface
- Spinner overlay for price calculations
- Progressive image loading with blur-up effect

---

## Accessibility & Quality

- Minimum touch target: 44x44px for all interactive elements
- Color contrast: WCAG AA compliance (4.5:1 for text)
- Focus indicators: 2px teal outline with 4px offset
- Form labels: Always visible, never placeholder-only
- Alt text: Descriptive for all shed/project images
- Keyboard navigation: Full support through chat interface and forms

---

## Responsive Breakpoints

- Mobile: < 640px (single column, stacked chat/preview)
- Tablet: 640px - 1024px (2-column grids, condensed spacing)
- Desktop: > 1024px (full multi-column layouts, expanded whitespace)