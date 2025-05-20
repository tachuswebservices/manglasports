# Mangla Sports & Associates Website Project

## 1. Objective of the Project

The Mangla Sports & Associates website is a professional e-commerce platform for India's premier shooting sports equipment retailer. The primary objectives are:

- Showcase premium shooting sports equipment with a focus on quality and precision
- Present a professional brand image that appeals to shooting enthusiasts and professionals
- Provide an intuitive browsing experience across different product categories
- Highlight the company's expertise and commitment to the shooting sports community
- Deliver a responsive platform that works seamlessly across all devices
- Implement a robust foundation for current and future e-commerce functionality
- Ensure fast, accessible, and engaging user experience with smooth animations and transitions
- Maintain consistent UI/UX across all pages with reusable layout components
- Implement search functionality with filters
- Integrate user authentication and authorization
- Develop a streamlined checkout process
- Integrate payment gateway

## 2. Core Features

### Implemented Features
- **Responsive Design**: Fully responsive layout that adapts to mobile, tablet, and desktop screens
- **Dark/Light Mode**: Theme toggle with persistent user preference via localStorage and system preference detection
- **Improved Navigation**: Logo click scrolls to top of page for better user experience
- **Product Browsing**:
  - Category-based product listings with dynamic routing
  - Comprehensive product detail pages with specifications and consistent pricing
  - Dynamic filtering and sorting with persistent URL state
  - Responsive grid layout with smooth transitions
  - Product variants and stock status
  - Recently viewed products tracking
- **Home Page Sections**:
  - Responsive hero section with different images for mobile and desktop views
  - Featured product collections
  - New arrivals showcase
  - Best sellers section
  - Why choose us section
  - Customer testimonials
  - Brand associations
  - About snippet
- **Navigation**:
  - Responsive navbar with mobile menu
  - Optimized mobile header with contact info and social media
  - Breadcrumb navigation with dynamic trail
  - Category-based filtering with URL synchronization
  - Quick view product modal
  - Persistent shopping cart
  - Enhanced search functionality with properly aligned suggestions
  - Logo click scrolls to page top
  - Functional footer quick links
  - Privacy Policy and Terms of Service pages
  - FAQ section with expandable questions
  - Blog/Articles section
  - Events Calendar with category filtering
  - Optimized mobile navigation with improved touch targets
  - Consistent spacing and alignment across all screen sizes
- **UI Components**:
  - Reusable button components with variants
  - Interactive product cards with hover effects
  - Loading states and skeleton loaders
  - Toast notifications system
  - Accessible modal dialogs
  - Responsive image handling with lazy loading
  - Form controls with validation
  - Custom dropdowns and selectors
  - Back-to-top button
  - Social sharing components
  - Event cards for calendar view
  - Article cards for blog section
- **Layout System**:
  - PageLayout component for consistent structure
  - Responsive grid system
  - Flexible container components
  - Proper spacing and typography scale

## 3. Tech Stack

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
  - React Query for data fetching and caching
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

### Backend (Planned Implementation)
- **Platform**: Supabase (PostgreSQL-based backend-as-a-service)
- **Database**:
  - PostgreSQL for structured data
  - Relational data model for products, categories, orders, etc.
  - Transaction support for order processing
- **Authentication**:
  - Email/password authentication
  - JWT token-based session management
  - Role-based access control (customers, administrators)
- **Storage**:
  - Cloud storage for product images and media
  - CDN delivery for optimized assets
- **API Services**:
  - RESTful API endpoints
  - Real-time listeners for inventory updates
  - Edge functions for specialized processing
- **Security**:
  - Row-level security policies
  - Secure API access
  - HTTPS enforcement

### E-commerce Features (Planned)
- **Inventory Management**:
  - Real-time stock tracking for online/offline sales
  - Automated stock updates when orders are placed
  - Low stock alerts and notifications
  - Simple admin interface for updating stock levels
  - Inventory change logging for auditability

- **User Accounts**:
  - Secure authentication and authorization
  - User profiles with order history
  - Address book for shipping information
  - Wishlist synchronization across devices
  - Role-based access for admins and customers

- **Order Processing**:
  - Cart to order conversion with inventory verification
  - Order status tracking and updates
  - Order history and details view
  - Razorpay payment gateway integration
  - Email notifications for order confirmations

- **Admin Dashboard**:
  - Product management interface
  - Order management and fulfillment
  - Inventory control for both online and offline sales
  - Simple reports and analytics
  - Customer management tools

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

## 4. Code Architecture

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
  
### Key Architectural Patterns

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
- **Query State**: React Query for data fetching (prepared for future implementation)
- **Centralized Product Data**: Single source of truth for product information to maintain consistency


