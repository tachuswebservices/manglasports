## 1. Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Animations**: Framer Motion 12.11 for smooth transitions and interactions
- **Styling**: 
  - Tailwind CSS 3.4
  - shadcn/ui components
  - Custom theme configuration
  - CSS variables for theming
- **State Management**: 
  - React Context (Theme, UI state)
  - URL-based state for filters
  - Local state management
- **Routing & Navigation**: 
  - React Router DOM 6.26
  - Nested routes
  - Dynamic routing
- **UI Components**:
  - Radix UI primitives
  - Lucide React icons
  - Custom components
  - Responsive design patterns
- **Development Tools**:
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting
  - Husky for git hooks

### Tools & Configuration
- **Package Manager**: npm/Node.js
- **Linting**: ESLint
- **TypeScript Configuration**: Strict typing
- **PostCSS** for CSS processing
- **Tailwind plugins**:
  - tailwindcss-animate
  - @tailwindcss/typography

## 2. Code Architecture

### Directory Structure
```
src/
├── components/
│   ├── home/           # Home page sections
│   │   ├── AboutSnippet.tsx
│   │   ├── BestSellers.tsx
│   │   ├── FeaturedCollections.tsx
│   │   └── ...
│   ├── layout/         # Layout components
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── PageLayout.tsx
│   ├── products/       # Product-related components
│   │   ├── ProductsLayout.tsx
│   │   ├── ProductsSidebar.tsx
│   │   └── ...
│   ├── theme/         # Theme components
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/            # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── hooks/             # Custom hooks
├── lib/               # Utilities and helpers
├── pages/             # Page components
│   ├── About.tsx
│   ├── Categories.tsx
│   ├── Contact.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   ├── ProductDetail.tsx
│   └── UnifiedProducts.tsx
└── types/             # TypeScript type definitions
```
  
### 3. Key Architectural Patterns

#### Component Architecture
- **Atomic Design Principles**: Components organized by complexity (atoms, molecules, organisms)
- **Container/Component Pattern**: Separation of logic and presentation
- **Composition Over Inheritance**: Flexible component composition
- **Centralized Data Management**: Consistent product data source to ensure pricing consistency across pages

#### State Management
- **Context API**: For global theme and UI state
- **Local State**: For component-specific state
- **URL State**: For filter and search parameters

#### Performance
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: For non-critical components
- **Image Optimization**: Responsive images with modern formats

#### Best Practices
- **Type Safety**: Comprehensive TypeScript integration with strict typing
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and ARIA labels
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized bundle size, code splitting, and lazy loading
- **State Management**: React Query for server state and React Context for UI state
- **Routing**: Nested routes with React Router v6
- **Animations**: Smooth transitions with Framer Motion
- **Theming**: Dark/light mode with system preference detection
- **Form Handling**: Form validation with React Hook Form
- **Error Boundaries**: Graceful error handling and fallback UIs

### State Management
- **Local Component State**: useState for component-specific state
- **Global Theme State**: Context API for theme preferences
- **Query State**: React Query for data fetching and cache management
- **Centralized Product Data**: Single source of truth for product information to maintain consistency

### 4. Backend & Database (Planned Implementation)
- **Supabase Integration**: PostgreSQL database, authentication, storage, and more
- **Data Storage**:
  - Product catalog with categories and specifications
  - User accounts and profiles
  - Order history and processing
  - Inventory management for online/offline stock tracking
- **Authentication**:
  - Email/password authentication
  - Role-based access control (customers, admins)
  - Profile management
- **API Services**:
  - RESTful endpoints for product data
  - Real-time updates for inventory management
  - Edge functions for specialized processing
- **Storage**:
  - Product images and media
  - Optimized assets with CDN delivery

### 5. E-commerce Features (Planned)
- **Inventory Management**:
  - Real-time stock tracking
  - Integration for both online and offline sales
  - Stock alerts and notifications
- **User Accounts**:
  - Order history and tracking
  - Wishlist synchronization across devices
  - Saved shipping and payment information
- **Order Processing**:
  - Cart to order conversion
  - Payment integration with Razorpay
  - Order status tracking
  - **Advanced Order Management**:
    - Real-time order status updates (pending, shipped, delivered, rejected, cancelled)
    - Email confirmation system for critical status changes
    - Professional email templates for shipped, delivered, and rejected orders
    - Shipping charges calculation and display
    - Order tracking with courier partner and tracking ID support
    - Admin dashboard with order fulfillment workflow
