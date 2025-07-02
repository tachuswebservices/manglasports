# Guidelines: Adding a New Product to Mangla Sports Website

This document provides step-by-step instructions and best practices for adding a new product (and brand) to the Mangla Sports & Associates website.

---

## Step-by-Step Process

### 1. Prepare Product Details
Collect all necessary product information:

#### Required Fields:
- **Product ID** (unique identifier, use kebab-case: "product-name-variant")
- **Product Name**
- **Brand Name** (new or existing)
- **Price** (formatted with ₹ symbol, e.g., "₹12,345")
- **Numeric Price** (number for sorting/filtering, e.g., 12345)
- **Image Filename** (ensure image is in `/public/lovable-uploads/`)
- **Category** (must match existing categories or create new logical grouping)
- **Rating** (decimal number, e.g., 4.5)
- **In Stock** (true/false)
- **Brand Name**

#### Optional Fields:
- **Original Price** (number, for showing discounts)
- **Review Count** (number)
- **Sold Count** (number)
- **Short Description** (brief product summary)
- **Features** (array of feature strings)
- **Specifications** (object of key-value pairs)
- **isNew** (boolean, shows "New" badge)
- **isHot** (boolean, shows "Hot" badge, used for best sellers)

### 2. Current Categories
Use one of these existing categories for consistency:
- "Air Rifles"
- "Air Pistols" 
- "CO2 Pistols"
- "Air Rifle Accessories"
- "Air Pistol Accessories"
- "Pellets"
- "Consumables"
- "Electronic Target Systems"
- "Scatt Training Systems"

### 3. Add Product Image
- Place the product image in `/public/lovable-uploads/`.
- Use a clear, descriptive filename (no spaces, prefer hyphens or underscores).
- Recommended formats: PNG, JPG, WebP
- Optimal dimensions: 800x800px or similar square aspect ratio

### 4. Update the Product Data File
- Open `src/data/products.ts`.
- Locate the `products` array.
- Add a new product object with all required fields.
- If using a new brand, just set the `brand` field to the new name; it will appear automatically in filters.
- If using a new category, ensure consistency in naming (case and spelling) across the site.

### 5. Syntax & Formatting
- Each product object must be separated by a comma, except the last one.
- End each object with `},` (except the last in the array).
- Do not insert comments or blank lines between array objects.
- Maintain consistent indentation (2 spaces).
- Use double quotes for all string values.

### 6. Validate
- Save the file and ensure there are no syntax errors.
- Run or refresh the site to confirm the new product appears in the correct category and brand filters.
- Test that the product detail page loads correctly.
- Verify search functionality includes the new product.

---

## What to Avoid
- **Do NOT** put comments between array elements in `products.ts`.
- **Do NOT** leave a trailing comma after the last product object.
- **Do NOT** use spaces in image filenames; use hyphens or underscores.
- **Do NOT** mismatch category or brand names (case and spelling must be consistent).
- **Do NOT** skip required fields; missing fields can cause runtime errors or missing data in the UI.
- **Do NOT** use duplicate `id` values.
- **Do NOT** forget to include both `price` (string) and `numericPrice` (number) fields.

---

## Troubleshooting
- **Syntax Error**: If you see "Property assignment expected" or similar syntax error: check for misplaced commas, comments, or missing braces.
- **Product Not Appearing**: Check that the category and brand match exactly with filter logic, and that the image path is correct.
- **Image Not Loading**: Verify the image file exists in `/public/lovable-uploads/` and the filename matches exactly.
- **Price Issues**: Ensure both `price` (formatted string) and `numericPrice` (number) are provided.
- **Search Not Working**: Verify the product name, brand, and category are spelled correctly.

---

## Example Product Object
```typescript
{
  id: "example-product-id",
  name: "Example Product Name",
  price: "₹12,345",
  numericPrice: 12345,
  originalPrice: 15000, // Optional: for showing discounts
  image: "/lovable-uploads/example-product.png",
  category: "Air Rifle Accessories",
  rating: 4.5,
  reviewCount: 10, // Optional
  soldCount: 20, // Optional
  inStock: true,
  isNew: true, // Optional: shows "New" badge
  isHot: false, // Optional: shows "Hot" badge for best sellers
  brand: "ExampleBrand",
  shortDescription: "Brief summary of the product.", // Optional
  features: [ // Optional
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  specifications: { // Optional
    "Material": "Aluminum",
    "Weight": "200g",
    "Dimensions": "10cm x 5cm x 2cm",
    "Country of Manufacture": "Germany"
  }
}
```

---

## Current Product Statistics
- **Total Products**: 14 (as of last update)
- **Categories**: 9 active categories
- **Brands**: Multiple international brands (Walther, Pardini, Morini, etc.)
- **Price Range**: ₹400 to ₹249,999

---

## Integration Notes
- New products automatically appear in:
  - Category pages (`/products/:category`)
  - Search results
  - Filter options (brand, price range)
  - Home page sections (if marked as `isNew` or `isHot`)
- The system automatically generates:
  - Product detail pages (`/products/product/:productId`)
  - Category and brand filter options
  - Price range calculations

---

## Summary of Learnings
- Consistency and clean syntax are critical—syntax errors will break the build.
- Never place comments or blank lines between products in the array.
- Always double-check category and brand spellings.
- Place images in the correct folder and use safe filenames.
- Both `price` (string) and `numericPrice` (number) are required for proper functionality.
- Validate changes by running the site after every update.
- Optional fields enhance the user experience but aren't required for basic functionality.

---

_Last updated: 2025-01-21_
