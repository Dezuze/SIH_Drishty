export interface SeasonalCropData {
  id: string;
  crop: string;
  malayalamName: string;
  category: 'Fruits' | 'Vegetables' | 'Spices' | 'Tubers & Grains' | 'Plantation';
  color: string;
  peakMonths: string;
  yields: number[]; // 12 numbers for Jan - Dec (0 to 100)
  jan: string; feb: string; mar: string; apr: string;
  may: string; jun: string; jul: string; aug: string;
  sep: string; oct: string; nov: string; dec: string;
  [key: string]: any;
}

export const seasonalCategories = [
  'All',
  'Fruits',
  'Vegetables',
  'Spices',
  'Tubers & Grains',
  'Plantation'
] as const;

export const seasonalData: SeasonalCropData[] = [
  // 1. Fruits
  {
    id: "banana",
    crop: "Nendran Banana",
    malayalamName: "നേന്ത്രൻ പഴം",
    category: "Fruits",
    color: "#EAB308", // Golden Yellow
    peakMonths: "Mar - May & Aug - Sep",
    yields: [60, 65, 95, 100, 90, 60, 55, 80, 85, 60, 60, 60],
    jan: "moderate", feb: "moderate", mar: "peak", apr: "peak",
    may: "peak", jun: "moderate", jul: "moderate", aug: "peak",
    sep: "peak", oct: "moderate", nov: "moderate", dec: "moderate"
  },
  {
    id: "mango",
    crop: "Malabar Mango",
    malayalamName: "മാങ്ങ (പ്രിയോർ / മൂവാണ്ടൻ)",
    category: "Fruits",
    color: "#F97316", // Bright Orange
    peakMonths: "Apr - Jun",
    yields: [15, 25, 60, 95, 100, 90, 30, 0, 0, 0, 0, 10],
    jan: "early", feb: "early", mar: "moderate", apr: "peak",
    may: "peak", jun: "peak", jul: "early", aug: "",
    sep: "", oct: "", nov: "", dec: ""
  },
  {
    id: "jackfruit",
    crop: "Varikka Jackfruit",
    malayalamName: "വരിക്ക ചക്ക",
    category: "Fruits",
    color: "#84CC16", // Lime Green
    peakMonths: "Apr - Jun",
    yields: [10, 35, 65, 95, 100, 85, 30, 0, 0, 0, 0, 0],
    jan: "early", feb: "moderate", mar: "moderate", apr: "peak",
    may: "peak", jun: "moderate", jul: "early", aug: "",
    sep: "", oct: "", nov: "", dec: ""
  },
  {
    id: "pineapple",
    crop: "Vazhakulam Pineapple",
    malayalamName: "വാഴക്കുളം കൈതച്ചക്ക",
    category: "Fruits",
    color: "#FACC15", // Sun Yellow
    peakMonths: "Apr - Jun & Dec",
    yields: [55, 60, 70, 95, 100, 85, 60, 55, 55, 60, 70, 85],
    jan: "moderate", feb: "moderate", mar: "moderate", apr: "peak",
    may: "peak", jun: "moderate", jul: "moderate", aug: "moderate",
    sep: "moderate", oct: "moderate", nov: "moderate", dec: "peak"
  },
  {
    id: "papaya",
    crop: "Red Lady Papaya",
    malayalamName: "പപ്പായ",
    category: "Fruits",
    color: "#FB923C", // Coral Orange
    peakMonths: "Year-Round (Peak Jul - Nov)",
    yields: [50, 50, 55, 60, 65, 75, 90, 95, 90, 85, 80, 60],
    jan: "moderate", feb: "moderate", mar: "moderate", apr: "moderate",
    may: "moderate", jun: "moderate", jul: "peak", aug: "peak",
    sep: "peak", oct: "peak", nov: "moderate", dec: "moderate"
  },
  {
    id: "guava",
    crop: "Allahabad Guava",
    malayalamName: "പേരയ്ക്ക",
    category: "Fruits",
    color: "#10B981", // Emerald Green
    peakMonths: "Aug - Oct & Jan - Feb",
    yields: [80, 75, 30, 15, 10, 20, 50, 90, 95, 85, 40, 60],
    jan: "peak", feb: "moderate", mar: "early", apr: "",
    may: "", jun: "early", jul: "moderate", aug: "peak",
    sep: "peak", oct: "peak", nov: "early", dec: "moderate"
  },

  // 2. Spices
  {
    id: "black-pepper",
    crop: "Wayanad Black Pepper",
    malayalamName: "വയനാടൻ കുരുമുളക്",
    category: "Spices",
    color: "#334155", // Slate Charcoal
    peakMonths: "Dec - Feb",
    yields: [100, 95, 80, 25, 0, 0, 0, 0, 0, 20, 60, 90],
    jan: "peak", feb: "peak", mar: "peak", apr: "early",
    may: "", jun: "", jul: "", aug: "",
    sep: "", oct: "early", nov: "moderate", dec: "peak"
  },
  {
    id: "cardamom",
    crop: "Green Gold Cardamom",
    malayalamName: "ഏലയ്ക്ക",
    category: "Spices",
    color: "#059669", // Dark Emerald
    peakMonths: "Aug - Jan",
    yields: [85, 30, 10, 0, 0, 15, 45, 85, 95, 100, 95, 90],
    jan: "peak", feb: "early", mar: "", apr: "",
    may: "", jun: "early", jul: "moderate", aug: "peak",
    sep: "peak", oct: "peak", nov: "peak", dec: "peak"
  },
  {
    id: "ginger",
    crop: "Wayanad Fresh Ginger",
    malayalamName: "ഇഞ്ചി",
    category: "Spices",
    color: "#D97706", // Amber Brown
    peakMonths: "Dec - Feb",
    yields: [95, 90, 40, 10, 0, 0, 10, 20, 30, 50, 75, 95],
    jan: "peak", feb: "peak", mar: "moderate", apr: "",
    may: "", jun: "", jul: "early", aug: "early",
    sep: "early", oct: "moderate", nov: "moderate", dec: "peak"
  },
  {
    id: "turmeric",
    crop: "Alleppey Finger Turmeric",
    malayalamName: "മഞ്ഞൾ",
    category: "Spices",
    color: "#EA580C", // Deep Orange
    peakMonths: "Jan - Mar",
    yields: [95, 100, 90, 35, 0, 0, 0, 0, 0, 15, 45, 80],
    jan: "peak", feb: "peak", mar: "peak", apr: "early",
    may: "", jun: "", jul: "", aug: "",
    sep: "", oct: "", nov: "moderate", dec: "moderate"
  },
  {
    id: "nutmeg",
    crop: "Nutmeg & Mace",
    malayalamName: "ജാതിക്ക",
    category: "Spices",
    color: "#B45309", // Warm Amber
    peakMonths: "Jun - Aug & Dec",
    yields: [50, 40, 35, 30, 40, 85, 100, 90, 60, 45, 55, 75],
    jan: "moderate", feb: "early", mar: "early", apr: "early",
    may: "moderate", jun: "peak", jul: "peak", aug: "peak",
    sep: "moderate", oct: "early", nov: "moderate", dec: "moderate"
  },
  {
    id: "clove",
    crop: "Zanzibar Cloves",
    malayalamName: "ഗ്രാമ്പൂ",
    category: "Spices",
    color: "#78350F", // Dark Coffee
    peakMonths: "Dec - Feb",
    yields: [100, 90, 50, 10, 0, 0, 0, 0, 0, 10, 40, 85],
    jan: "peak", feb: "peak", mar: "moderate", apr: "",
    may: "", jun: "", jul: "", aug: "",
    sep: "", oct: "", nov: "early", dec: "peak"
  },

  // 3. Tubers & Grains
  {
    id: "matta-rice",
    crop: "Palakkad Matta Rice",
    malayalamName: "പാലക്കാടൻ മട്ടയരി",
    category: "Tubers & Grains",
    color: "#DC2626", // Deep Crimson
    peakMonths: "Jan - Feb & Aug - Sep",
    yields: [100, 90, 30, 20, 50, 60, 90, 100, 95, 25, 20, 60],
    jan: "peak", feb: "peak", mar: "early", apr: "early",
    may: "moderate", jun: "moderate", jul: "peak", aug: "peak",
    sep: "peak", oct: "early", nov: "early", dec: "moderate"
  },
  {
    id: "tapioca",
    crop: "Cassava / Tapioca",
    malayalamName: "കപ്പ (മരച്ചീനി)",
    category: "Tubers & Grains",
    color: "#65A30D", // Olive Lime
    peakMonths: "Oct - Jan",
    yields: [90, 70, 50, 40, 40, 45, 55, 65, 80, 95, 100, 95],
    jan: "peak", feb: "moderate", mar: "moderate", apr: "early",
    may: "early", jun: "early", jul: "moderate", aug: "moderate",
    sep: "moderate", oct: "peak", nov: "peak", dec: "peak"
  },
  {
    id: "elephant-yam",
    crop: "Elephant Foot Yam",
    malayalamName: "ചേന",
    category: "Tubers & Grains",
    color: "#713F12", // Earth Brown
    peakMonths: "Nov - Feb",
    yields: [95, 85, 40, 10, 10, 20, 30, 45, 60, 80, 100, 100],
    jan: "peak", feb: "peak", mar: "early", apr: "",
    may: "", jun: "early", jul: "early", aug: "moderate",
    sep: "moderate", oct: "moderate", nov: "peak", dec: "peak"
  },
  {
    id: "taro",
    crop: "Colocasia / Taro",
    malayalamName: "ചേമ്പ്",
    category: "Tubers & Grains",
    color: "#4D7C0F", // Deep Forest
    peakMonths: "Aug - Nov",
    yields: [40, 20, 10, 10, 20, 45, 75, 95, 100, 90, 70, 50],
    jan: "early", feb: "", mar: "", apr: "",
    may: "early", jun: "early", jul: "moderate", aug: "peak",
    sep: "peak", oct: "peak", nov: "moderate", dec: "early"
  },

  // 4. Vegetables
  {
    id: "bitter-gourd",
    crop: "Bitter Gourd",
    malayalamName: "പാവയ്ക്ക",
    category: "Vegetables",
    color: "#16A34A", // Vibrant Green
    peakMonths: "Jun - Sep & Dec - Feb",
    yields: [80, 75, 50, 40, 45, 85, 100, 95, 85, 60, 65, 80],
    jan: "peak", feb: "moderate", mar: "early", apr: "early",
    may: "moderate", jun: "peak", jul: "peak", aug: "peak",
    sep: "peak", oct: "moderate", nov: "moderate", dec: "peak"
  },
  {
    id: "snake-gourd",
    crop: "Snake Gourd",
    malayalamName: "പടവലങ്ങ",
    category: "Vegetables",
    color: "#14B8A6", // Teal Green
    peakMonths: "Jul - Oct",
    yields: [50, 45, 30, 30, 40, 70, 95, 100, 90, 80, 60, 55],
    jan: "moderate", feb: "early", mar: "early", apr: "early",
    may: "moderate", jun: "moderate", jul: "peak", aug: "peak",
    sep: "peak", oct: "peak", nov: "moderate", dec: "moderate"
  },
  {
    id: "okra",
    crop: "Lady's Finger / Okra",
    malayalamName: "വെണ്ടയ്ക്ക",
    category: "Vegetables",
    color: "#6EE7B7", // Mint Green
    peakMonths: "Feb - May & Sep - Nov",
    yields: [60, 85, 95, 100, 90, 60, 50, 65, 90, 95, 85, 65],
    jan: "moderate", feb: "peak", mar: "peak", apr: "peak",
    may: "peak", jun: "moderate", jul: "early", aug: "moderate",
    sep: "peak", oct: "peak", nov: "peak", dec: "moderate"
  },
  {
    id: "brinjal",
    crop: "Eggplant / Brinjal",
    malayalamName: "വഴുതനങ്ങ",
    category: "Vegetables",
    color: "#9333EA", // Purple
    peakMonths: "Oct - Mar",
    yields: [95, 90, 80, 50, 40, 45, 50, 60, 75, 90, 100, 100],
    jan: "peak", feb: "peak", mar: "moderate", apr: "early",
    may: "early", jun: "early", jul: "moderate", aug: "moderate",
    sep: "moderate", oct: "peak", nov: "peak", dec: "peak"
  },
  {
    id: "red-amaranth",
    crop: "Red Amaranth",
    malayalamName: "ചുവപ്പ് ചീര",
    category: "Vegetables",
    color: "#E11D48", // Rose Red
    peakMonths: "Oct - Apr (Dry Season)",
    yields: [95, 100, 95, 85, 50, 30, 25, 35, 60, 85, 95, 100],
    jan: "peak", feb: "peak", mar: "peak", apr: "moderate",
    may: "early", jun: "", jul: "", aug: "early",
    sep: "moderate", oct: "peak", nov: "peak", dec: "peak"
  },

  // 5. Plantation & Cash Crops
  {
    id: "coconut",
    crop: "West Coast Tall Coconut",
    malayalamName: "തേങ്ങ",
    category: "Plantation",
    color: "#0284C7", // Sky Cerulean
    peakMonths: "Mar - Jul (High Nut Yield)",
    yields: [70, 75, 90, 95, 100, 95, 85, 75, 70, 65, 65, 65],
    jan: "moderate", feb: "moderate", mar: "peak", apr: "peak",
    may: "peak", jun: "peak", jul: "peak", aug: "moderate",
    sep: "moderate", oct: "moderate", nov: "moderate", dec: "moderate"
  },
  {
    id: "arecanut",
    crop: "Areca Nut / Betel Nut",
    malayalamName: "അടയ്ക്ക",
    category: "Plantation",
    color: "#C026D3", // Magenta
    peakMonths: "Sep - Jan",
    yields: [80, 40, 20, 10, 10, 15, 30, 60, 90, 100, 95, 90],
    jan: "peak", feb: "early", mar: "", apr: "",
    may: "", jun: "", jul: "early", aug: "moderate",
    sep: "peak", oct: "peak", nov: "peak", dec: "peak"
  },
  {
    id: "coffee",
    crop: "Robusta Coffee",
    malayalamName: "കാപ്പി",
    category: "Plantation",
    color: "#854D0E", // Roasted Brown
    peakMonths: "Dec - Feb (Harvest)",
    yields: [100, 90, 40, 15, 10, 10, 15, 20, 25, 35, 65, 95],
    jan: "peak", feb: "peak", mar: "early", apr: "",
    may: "", jun: "", jul: "", aug: "",
    sep: "", oct: "early", nov: "moderate", dec: "peak"
  }
];
