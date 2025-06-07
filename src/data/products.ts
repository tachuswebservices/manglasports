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
  features?: string[];
  specifications?: { [key: string]: string };
}

// Combined products from New Arrivals and Best Sellers
// New Arrivals
export const products: Product[] = [
  {
    id: "tec-hro-stativ-3-carbon",
    name: "TEC-HRO STATIV 3.0 CARBON, THE NEW RIFLE TRIPOD",
    price: "₹26,000",
    numericPrice: 26000,
    image: "/lovable-uploads/Tech-HRO Stnad.png",
    category: "Air Rifle Accessories",
    rating: 4.6,
    reviewCount: 15,
    soldCount: 35,
    inStock: true,
    isNew: true,
    isHot: true,
    brand: "TEC-HRO",
    shortDescription: "Ultra-light, stable, and user-friendly carbon tripod for competitive rifle shooters. Features innovative design, quick-release levers, and brilliant colors for maximum performance.",
    features: [
      "New, lighter carbon fiber tubes in five brilliant colors",
      "Weight-optimized foot construction for stability",
      "Quick-release lever on rifle and ammunition tray",
      "Ammunition tray swivels and mounts at multiple heights",
      "Feet splayed at 100° for increased stability",
      "Extremely robust yet lightweight (approx. 1.25 kg)",
      "Max height: 170 cm, folds to 67 cm length",
      "Easy assembly/disassembly without tools",
      "Rubber-coated rifle tray for secure placement"
    ],
    specifications: {
      "Material": "Carbon fiber tubes, milled aluminum foot unit",
      "Weight": "Approx. 1.25 kg",
      "Max Height": "170 cm",
      "Folded Dimensions": "67 cm length, 9 cm diameter (with bag)",
      "Ammunition Tray": "Swiveling, mounts on upper/middle/lower tube",
      "Foot Design": "100° splayed for stability",
      "Assembly": "Tool-free, quick-release levers",
      "Compatibility": "Universal for sport rifles",
      "Country of Manufacture": "Germany"
    }
  },
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
    shortDescription: "The Walther LG500 itec marks a new era in competitive shooting, redefining perfection with its advanced features and cutting edge innovations. Whether a seasoned competitor or an aspiring champion, the Walther LG500 itec promises an unmatched shooting experience that will lead you straight to the podium.",
    features: [
      "Electronic trigger integrated into grip",
      "Perfected grip ergonomics",
      "Grip and trigger infinitely adjustable in length, cast and angle",
      "Right and left handed grip options in S, M and L sizes",
      "Vibration minimized system for optimal response",
      "Adaptive inline impulse equalizer",
      "Vibration minimized loading mechanics",
      "Pneumatically driven absorber",
      "90g balancing elements in forend and buttstock are infinitely adjustable",
      "Independent adjustment of length of pull and cheekpiece position",
      "Infinite lateral fine adjustment of cheekpiece",
      "Innovative aerospace-grade aluminum buttplate with infinite adjustment"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Trigger": "Electronic BTe trigger",
      "Grip": "MEMORY 3D-grip BIOMETRIC, right- or left-hand, S/M/L sizes",
      "Propulsion": "Compressed air, 300/200 bar",
      "Shot Capacity": "Approx. 500 shots per fill",
      "Max Energy": "7.5 Joules",
      "Barrel": "Match-grade, precision rifled",
      "Weight Distribution": "Adjustable balancing system",
      "Stock": "Infinitely adjustable, ergonomic design",
      "Sights": "Visionic Match Diopter, micro-precise",
      "Country of Manufacture": "Germany",
      "Intended Use": "Professional competition, Olympic shooting"
    }
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
    shortDescription: "The Pardini K12 J Short is a competition air pistol designed for precision target shooting, featuring a short grip design for enhanced control and comfort.",
    features: [
      "Short grip design for improved control",
      "Adjustable trigger for personalized feel",
      "High-precision barrel",
      "Integrated compensator for reduced recoil",
      "Ergonomic and lightweight construction",
      "Suitable for competitive shooting"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Action": "Single shot, pre-charged pneumatic (PCP)",
      "Cylinder": "Removable, compressed air up to 250 bar",
      "Barrel Length": "205 mm",
      "Overall Length": "380 mm",
      "Weight": "~950 g",
      "Grip": "Anatomical, available in RH: XS/S/M/L, LH: S/M/L",
      "Trigger": "Fully adjustable, mechanical",
      "Sights": "Adjustable rear sight, fixed front sight",
      "Compensator": "Integrated, recoil elimination system",
      "Country of Manufacture": "Italy",
      "Intended Use": "Precision target shooting, ISSF competition"
    }
  },
  {
    id: "morini-electronic-grip-right",
    name: "Morini Electronic grip for Right hand shooters",
    price: "₹35,000",
    numericPrice: 35000,
    image: "/lovable-uploads/Morini_LeftGrip.png",
    category: "Air Pistol Accessories",
    rating: 4.2,
    reviewCount: 4,
    soldCount: 13,
    inStock: true,
    isNew: true,
    isHot: true,
    brand: "Morini",
    shortDescription: "Precision-crafted electronic grip for right-handed shooters, compatible with Morini CM162EI air pistols. Adjustable ergonomic design for optimal control and comfort in competitive shooting.",
    features: [
      "Handmade from high-quality walnut wood",
      "Designed for right-handed shooters",
      "Electronic trigger compatibility (CM162EI)",
      "Adjustable palm shelf for custom fit",
      "Enhanced ergonomics for improved stability",
      "CNC-machined for precision",
      "Available in multiple sizes (XS, S, M, L, XL, XXL)",
      "Smooth finish for comfortable grip",
      "Ideal for ISSF and Olympic-level air pistol competition"
    ],
    specifications: {
      "Material": "Premium walnut wood",
      "Compatibility": "Morini CM162EI electronic air pistol",
      "Hand Orientation": "Right",
      "Sizes Available": "XS, S, M, L, XL, XXL",
      "Palm Shelf": "Adjustable, CNC-machined",
      "Finish": "Smooth, ergonomic",
      "Trigger": "Electronic (for CM162EI)",
      "Country of Manufacture": "Switzerland",
      "Intended Use": "Precision air pistol sport shooting"
    }
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
    shortDescription: "High-quality 12g CO2 cartridges for air pistols and rifles, designed to provide consistent power and reliable performance for a variety of airguns.",
    features: [
      "12g CO2 cartridges for airguns",
      "Consistent and reliable power output",
      "Compatible with most air pistols and rifles",
      "Leak-proof design for maximum efficiency",
      "Ideal for target shooting and plinking"
    ],
    specifications: {
      "Cartridge Size": "12 grams",
      "Material": "High-grade metal",
      "Type": "Non-threaded CO2 capsule",
      "Compatibility": "Fits most CO2-powered air pistols and rifles",
      "Seal Quality": "Tight tolerances for precise fit, leak-proof",
      "Gas Purity": "Tested for clean, reliable CO2",
      "Country of Manufacture": "Germany",
      "Intended Use": "Power source for airguns, paintball, airsoft"
    }
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
    shortDescription: "The SCATT MX-W2 is an advanced wireless training system for professional shooters, offering real-time feedback and analysis to improve accuracy and performance.",
    features: [
      "Wireless (Wi-Fi) connectivity for easy setup",
      "Real-time shot analysis and feedback",
      "Compatible with various firearms and airguns",
      "Portable and lightweight design",
      "Comprehensive training software included"
    ],
    specifications: {
      "Use": "Indoor and outdoor dry-fire/live-fire training",
      "Distance to Target": "2.5 to 1000 meters",
      "Optical Sensor Type": "Wireless (Wi-Fi 2.4 GHz) or USB wired",
      "Optical Sensor Size": "34 x 35 x 60 mm",
      "Optical Sensor Weight": "56 g",
      "Supported Platforms": "Windows, macOS, Linux, iOS, Android",
      "Included Accessories": "Iris diaphragm, mounting prism, mounting plate, hex key, charging cable, flash drive, quick setup guide, carrying case",
      "Warranty": "2 years (limited)",
      "Ammunition Compatibility": "Up to .338 cal",
      "Country of Manufacture": "Russia",
      "Intended Use": "Professional shooting training, analysis, and feedback"
    }
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
    shortDescription: "The Walther LG500 is a premium competition air rifle designed for professional shooters, offering advanced technology and precision engineering for top-level performance.",
    features: [
      "High-precision match barrel",
      "Adjustable stock and cheekpiece",
      "Electronic or mechanical trigger options",
      "Ergonomic design for optimal handling",
      "Advanced recoil absorption system",
      "Customizable balance and weight distribution",
      "Suitable for world-class competition"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Trigger": "Electronic or mechanical, adjustable",
      "Propulsion": "Pre-charged pneumatic (PCP), 300/200 bar",
      "Barrel": "Match-grade, precision rifled",
      "Stock": "Adjustable, ergonomic design",
      "Weight": "~4.2 kg (varies by configuration)",
      "Length": "Approx. 1070 mm",
      "Sights": "Match diopter, adjustable",
      "Energy": "Up to 7.5 Joules",
      "Grip": "Anatomical, right/left hand options",
      "Country of Manufacture": "Germany",
      "Intended Use": "Professional competition, Olympic shooting"
    }
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
    shortDescription: "The Beretta Px4 Storm is a reliable CO2-powered air pistol featuring an innovative rotating barrel system for realistic blowback action and enhanced shooting experience.",
    features: [
      "CO2-powered semi-automatic action",
      "Innovative rotating barrel system",
      "Realistic blowback for authentic feel",
      "Drop-free magazine for quick reloading",
      "Ergonomic grip for comfortable handling",
      "Integrated accessory rail"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm) BB or pellet",
      "Action": "CO2-powered, semi-automatic, blowback",
      "Velocity": "Up to 380 fps",
      "Barrel": "Rifled, 4.1 in (104 mm)",
      "Overall Length": "7.6 in (193 mm)",
      "Weight": "1.6 lbs (726 g)",
      "Magazine Capacity": "16 rounds (2 x 8-shot rotary magazines)",
      "Trigger": "Double-action & single-action",
      "Sights": "Blade front, fixed rear",
      "Safety": "Manual",
      "Powerplant": "12g CO2 capsule",
      "Shots per Fill": "~40",
      "Country of Manufacture": "Germany (Umarex, licensed by Beretta)",
      "Intended Use": "Plinking, training, fun shooting"
    }
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
    shortDescription: "The Tachus 10 ETS is a precision electronic target system designed for training and competition, providing instant feedback and high accuracy for shooters.",
    features: [
      "Electronic scoring for instant feedback",
      "High-precision target sensors",
      "Wireless connectivity for easy setup",
      "Compatible with various calibers and airguns",
      "Durable and weather-resistant construction",
      "User-friendly interface for training and competition"
    ],
    specifications: {
      "Application": "10m air rifle and pistol ISSF events",
      "Technology": "Acoustic sensor-based scoring",
      "Target Movement": "Automatic paper roll advancement after each shot",
      "Scoring Software": "Windows 7/8/10 compatible, real-time analytics",
      "Illumination": "Adjustable internal LED system",
      "Maintenance": "Removable pellet trap",
      "Installation": "Simple, suitable for home and range",
      "Accuracy": "ISSF-compliant, high precision",
      "Country of Manufacture": "India",
      "Intended Use": "Personal training, club competitions, professional events"
    }
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
    shortDescription: "The Pardini K12 Absorber is a top-tier air pistol equipped with an advanced recoil absorption system for maximum stability and precision in competitive shooting.",
    features: [
      "Advanced recoil absorption system",
      "Adjustable trigger for custom feel",
      "Precision match-grade barrel",
      "Ergonomic anatomical grip",
      "Adjustable rear sight",
      "Lightweight and balanced design"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Action": "Single shot, pre-charged pneumatic (PCP)",
      "Cylinder": "Removable, 250 bar max pressure",
      "Barrel": "Match-grade, alloy sleeve with up to 8 counterweights",
      "Weight": "~970 g (varies by configuration)",
      "Grip": "Anatomical, multiple sizes/colors",
      "Trigger": "Fully adjustable, mechanical",
      "Absorber": "Integrated recoil reduction system",
      "Sights": "Adjustable rear, fixed front",
      "Customization": "24 color variations (sleeve/cylinder)",
      "Country of Manufacture": "Italy",
      "Intended Use": "Olympic and ISSF competition, precision target shooting"
    }
  },
  {
    id: "hn-excite-econ-ii",
    name: "H&N Excite Econ II",
    price: "₹400",
    numericPrice: 400,
    image: "/lovable-uploads/EXCITE PELLET.jpg",
    category: "Pellets",
    rating: 4.5,
    reviewCount: 85,
    inStock: true,
    brand: "H&N",
    shortDescription: "The H&N Excite Econ II is a lightweight, accurate pellet for plinking, hobby shooting, and CO2 pistols. It features an updated head design for improved performance and is ideal for universal use at an extremely favorable price.",
    features: [
      "Lightweight design for higher velocity",
      "Consistent size and weight for accuracy",
      "Updated head design for improved performance",
      "Ideal for plinking, hobby shooting, and CO2 pistols",
      "Suitable for universal use",
      "Affordable price"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Pellet Weight": "7.4 grains (0.48 g)",
      "Pellet Shape": "Flat-head (wadcutter), diabolo",
      "Material": "Lead",
      "Quantity per Tin": "500",
      "Surface": "Smooth",
      "Head Design": "Updated for improved performance",
      "Country of Manufacture": "Germany",
      "Intended Use": "Plinking, hobby shooting, CO2 pistols, universal use"
    }
  },
  {
    id: "rws-diabolo-basic",
    name: "RWS Diabolo Basic",
    price: "₹475",
    numericPrice: 475,
    image: "/lovable-uploads/GREEN DIABOLO.jpg",
    category: "Pellets",
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    brand: "RWS",
    shortDescription: "The RWS Diabolo Basic wadcutter (flat-nose) pellet provides everything you need in a basic target shooting pellet. Made in Germany for consistent size and weight, it is ideal for lower-powered airguns and offers reliable accuracy for practice and plinking.",
    features: [
      "Wadcutter (flat-nose) design for clean target holes",
      "Consistent size and weight for accuracy",
      "Ideal for lower-powered airguns",
      "Reliable accuracy for practice and plinking",
      "Made in Germany for quality assurance"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Pellet Weight": "0.45 g / 6.94 grains",
      "Pellet Shape": "Wadcutter, flat nose, Diabolo",
      "Material": "Lead",
      "Surface": "Smooth",
      "Quantity per Tin": "300",
      "Country of Manufacture": "Germany",
      "Intended Use": "Target shooting, practice, plinking, lower-powered airguns"
    }
  },
  {
    id: "rws-r10-pistol",
    name: "RWS R10 Pistol Pellets",
    price: "₹950",
    numericPrice: 950,
    image: "/lovable-uploads/R10 PISTOL.jpg",
    category: "Pellets",
    rating: 4.7,
    reviewCount: 61,
    inStock: true,
    brand: "RWS",
    shortDescription: "RWS R10 Match Pistol pellets are manufactured using a special production and control process for maximum dimensional accuracy and consistency. Selected material properties, tight tolerances, and professional shooting tests ensure top quality for competition use.",
    features: [
      "Match-grade quality for competition use",
      "Manufactured with special production and control process",
      "Maximum dimensional accuracy and consistency",
      "Selected material properties and tight tolerances",
      "Professional shooting tests for quality assurance"
    ],
    specifications: {
      "Caliber": ".177 (4.5mm)",
      "Head Size": "4.50 mm",
      "Pellet Weight": "0.45 g / 7.0 grains",
      "Pellet Shape": "Wadcutter, flat nose",
      "Bullet Length": "5.4 mm",
      "Material": "Lead",
      "Quantity per Tin": "500",
      "Manufacturing": "Premium line, optoelectronically inspected",
      "Country of Manufacture": "Germany",
      "Intended Use": "Professional and competitive air pistol sport shooting"
    }
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
