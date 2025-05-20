// Unified product data store for Mangla Sports website
export interface Product {
  id: string;
  name: string;
  price: string;
  numericPrice: number; // For sorting and filtering
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount?: number;
  soldCount?: number;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
  brand: string;
  shortDescription?: string;
}

// Combined products from New Arrivals and Best Sellers
export const products: Product[] = [
  // New Arrivals
  {
    id: "walther-lg500-itec",
    name: "Walther LG500 ITEC Triple Edition",
    price: "₹249,999",
    numericPrice: 249999,
    image: "/lovable-uploads/44b2615c-e47e-41de-b6c4-97af839d9903.png",
    category: "Air Rifles",
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    isNew: true,
    brand: "Walther",
    shortDescription: "Competition air rifle with triple ITEC system for maximum precision."
  },
  {
    id: "pardini-k12-j-short",
    name: "Pardini K12 J Short",
    price: "₹189,999",
    numericPrice: 189999,
    image: "/lovable-uploads/5818a836-9981-47bc-bfb7-4efb566262b6.png",
    category: "Air Pistols",
    rating: 4.8,
    reviewCount: 36,
    inStock: true,
    isNew: true,
    brand: "Pardini",
    shortDescription: "Competition air pistol with short grip design for target shooting."
  },
  {
    id: "umarex-co2-cartridges",
    name: "Umarex 12g CO2 Cartridges (Capsules)",
    price: "₹1,499",
    numericPrice: 1499,
    image: "/lovable-uploads/343e01c8-d47b-4613-9aad-6f7197159da6.png",
    category: "Consumables",
    rating: 4.7,
    reviewCount: 128,
    inStock: true,
    isNew: true,
    brand: "Umarex",
    shortDescription: "High-quality CO2 cartridges for air pistols and rifles."
  },
  {
    id: "scatt-mx-w2",
    name: "SCATT MX-W2 WI-FI",
    price: "₹90,000",
    numericPrice: 90000,
    image: "/lovable-uploads/e284a5bc-98e2-45a3-b9b1-11aea9dadfb1.png",
    category: "Scatt Training Systems",
    rating: 4.9,
    reviewCount: 17,
    inStock: true,
    isNew: true,
    brand: "SCATT",
    shortDescription: "Advanced training system with WiFi connectivity for professional shooters."
  },
  
  // Best Sellers
  {
    id: "walther-lg500",
    name: "Walther LG500",
    price: "₹249,999",
    numericPrice: 249999,
    image: "/lovable-uploads/94816e34-750a-420e-b8fc-bde67a9fe267.png",
    category: "Air Rifles",
    rating: 5.0,
    soldCount: 89,
    inStock: true,
    isHot: true,
    brand: "Walther",
    shortDescription: "Premium competition air rifle for professional shooters."
  },
  {
    id: "beretta-px4-storm",
    name: "Pietro Beretta Px4 Storm",
    price: "₹89,999",
    numericPrice: 89999,
    image: "/lovable-uploads/81cbd973-5303-4c06-bfdf-36f0555888f8.png",
    category: "CO2 Pistols",
    rating: 4.8,
    soldCount: 132,
    inStock: true,
    isHot: true,
    brand: "Beretta",
    shortDescription: "Reliable CO2 pistol with innovative rotating barrel system."
  },
  {
    id: "tachus-10-ets",
    name: "Tachus 10 ETS",
    price: "₹150,000",
    numericPrice: 150000,
    image: "/lovable-uploads/aa897794-9610-4c04-9c17-d3928750fc0e.png",
    category: "Electronic Target Systems",
    rating: 4.7,
    soldCount: 76,
    inStock: true,
    isHot: true,
    brand: "Tachus",
    shortDescription: "Precision electronic target system for training and competition."
  },
  {
    id: "pardini-k12-absorber",
    name: "Pardini K12 Absorber Pistol",
    price: "₹189,999",
    numericPrice: 189999,
    image: "/lovable-uploads/9d861ad0-08bd-4f35-9567-bf07dbe5551b.png",
    category: "Air Pistols",
    rating: 4.9,
    soldCount: 105,
    inStock: true,
    isHot: true,
    brand: "Pardini",
    shortDescription: "Top-tier air pistol with advanced recoil absorption system."
  }
];

// Get all unique categories
export const getAllCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))].sort();
};

// Get all unique brands
export const getAllBrands = (): string[] => {
  return [...new Set(products.map(product => product.brand))].sort();
};

// Get max price for filter range
export const getMaxPrice = (): number => {
  const prices = products.map(p => p.numericPrice);
  return Math.ceil(Math.max(...prices, 0) / 1000) * 1000; // Round up to nearest thousand
};

// Filter products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Get new arrivals
export const getNewArrivals = (): Product[] => {
  return products.filter(product => product.isNew);
};

// Get best sellers
export const getBestSellers = (): Product[] => {
  return products.filter(product => product.isHot);
};
