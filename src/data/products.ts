export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  available: number;
  farmer: string;
  location: string;
  image: string;
  description: string;
  category: string;
  organic: boolean;
  harvestDate?: string;
  rating?: number;
  reviewsCount?: number;
  minOrder?: number;
  farmStory?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tomato",
    price: 30,
    unit: "kg",
    available: 500,
    farmer: "Green Valley Farm",
    location: "Kochi",
    category: "Vegetables",
    organic: true,
    harvestDate: "Harvested Yesterday",
    rating: 4.9,
    reviewsCount: 128,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    description: "Sun-ripened, juicy red tomatoes organically cultivated along the fertile coastal plains near Kochi. Free from chemical pesticides, perfect for traditional curries, salads, and rich gravies. Harvested at peak ripeness.",
    farmStory: "Green Valley Farm has been practicing eco-friendly, zero-chemical farming for over 15 years, employing natural composting and rainwater harvesting."
  },
  {
    id: 2,
    name: "Potato",
    price: 40,
    unit: "kg",
    available: 300,
    farmer: "Sunrise Farm",
    location: "Thrissur",
    category: "Root Vegetables",
    organic: true,
    harvestDate: "Harvested 2 days ago",
    rating: 4.8,
    reviewsCount: 94,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    description: "Firm, nutrient-dense farm potatoes grown in the rich, well-drained loamy soils of Thrissur. Excellent starch content making them ideal for boiling, roasting, frying, or making hearty stews.",
    farmStory: "Sunrise Farm is managed by a collective of 8 local farming families dedicated to sustainable crop rotation and non-GMO heirloom tubers."
  },
  {
    id: 3,
    name: "Carrot",
    price: 50,
    unit: "kg",
    available: 200,
    farmer: "Green Harvest",
    location: "Palakkad",
    category: "Root Vegetables",
    organic: true,
    harvestDate: "Harvested Today Morning",
    rating: 4.95,
    reviewsCount: 156,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80",
    description: "Sweet, crisp orange carrots grown in the cooler foothills of Palakkad. Packed with beta-carotene and natural sweetness. Freshly handpicked and washed with clean well water.",
    farmStory: "Green Harvest utilizes precision organic agriculture and bio-fertilizers, delivering directly from the farm gates within 18 hours of harvesting."
  },
  {
    id: 4,
    name: "Red Onion",
    price: 35,
    unit: "kg",
    available: 450,
    farmer: "Malabar Agro Collective",
    location: "Kozhikode",
    category: "Vegetables",
    organic: false,
    harvestDate: "Harvested 3 days ago",
    rating: 4.7,
    reviewsCount: 82,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80",
    description: "Pungent, deeply colored red onions cured naturally under the Kerala sun. Essential for flavorful tadkas, sambar, and everyday aromatic cooking.",
    farmStory: "Malabar Agro specializes in indigenous spice and allium varieties with traditional natural shade-curing methods."
  },
  {
    id: 5,
    name: "Fresh Green Spinach (Palak)",
    price: 25,
    unit: "kg",
    available: 120,
    farmer: "Riverbank Organic Gardens",
    location: "Aluva",
    category: "Leafy Greens",
    organic: true,
    harvestDate: "Harvested Today 6 AM",
    rating: 4.9,
    reviewsCount: 110,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    description: "Tender, vibrant green spinach leaves grown along the Periyar riverbank. Rich in iron, dietary fiber, and vitamins. Picked before dawn to retain peak moisture and crispness.",
    farmStory: "Riverbank Gardens delivers hydro-tested chemical-free greens, guaranteeing pure unpolluted irrigation."
  },
  {
    id: 6,
    name: "Green Bell Pepper (Capsicum)",
    price: 60,
    unit: "kg",
    available: 180,
    farmer: "Highland Greens Polyhouse",
    location: "Wayanad",
    category: "Vegetables",
    organic: true,
    harvestDate: "Harvested Yesterday",
    rating: 4.85,
    reviewsCount: 67,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    description: "Plump, thick-walled green capsicums grown in climate-controlled polyhouses in misty Wayanad. Exceptionally juicy and crunch-packed for stir-fries and fajitas.",
    farmStory: "Highland Greens blends polyhouse precision with organic neem-oil pest controls in high-altitude Wayanad."
  },
  {
    id: 7,
    name: "Kerala Nendran Banana",
    price: 55,
    unit: "kg",
    available: 350,
    farmer: "Anand Agro Orchards",
    location: "Thrissur",
    category: "Fruits",
    organic: true,
    harvestDate: "Harvested 2 days ago",
    rating: 4.92,
    reviewsCount: 140,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    description: "Traditional Kerala Nendran plantains, naturally ripened on tree branches without carbide or chemical ripening agents. Rich in potassium and fiber.",
    farmStory: "Anand Agro has cultivated heirloom banana varieties for 3 generations using organic cow-manure nourishment."
  },
  {
    id: 8,
    name: "Fresh Green Chilies",
    price: 70,
    unit: "kg",
    available: 90,
    farmer: "Spice Heritage Farms",
    location: "Idukki",
    category: "Vegetables",
    organic: true,
    harvestDate: "Harvested Yesterday",
    rating: 4.88,
    reviewsCount: 52,
    minOrder: 1,
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    description: "Spicy, aromatic Indian green chilies grown on the sun-drenched hill slopes of Idukki. High capsaicin content with sharp, refreshing heat.",
    farmStory: "Spice Heritage cultivates mountain-slope chilies alongside organic cardamom and pepper vines."
  }
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerDetails {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  deliverySlot: string;
  paymentMethod: "cod" | "online";
  notes?: string;
}

export interface ConfirmedOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomerDetails;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  estimatedDelivery: string;
  primaryFarmer: string;
  allFarmers: string[];
}
