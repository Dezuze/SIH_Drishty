export const VENDORS_DATA = [
  {
    id: 'v-wayanad-01',
    name: 'Wayanad Highland Agro Guild',
    slug: 'wayanad-highland-agro-guild',
    type: 'Cooperative',
    district: 'Wayanad',
    taluk: 'Sulthan Bathery',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2021,
    isOrganic: true,
    giTag: {
      code: 'GI-588',
      name: 'WAYANAD ROBUSTA',
      certificateNumber: 'GI/KL/2019/588'
    },
    rating: 4.9,
    reviewsCount: 184,
    productsCount: 42,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    tagline: 'Shade-grown single-origin Robusta and high-altitude spices cultivated along misted Western Ghats slopes.',
    description: 'A dedicated tribal & smallholder collective spanning 140 acres across the Chembra and Ambukuthi foothills. We specialize in naturally shade-grown Robusta cherries intercropped with native black pepper vines and organic cardamom.',
    farmSizeAcres: 140,
    elevationMeters: 950,
    farmingPractices: ['Rainforest Shade-Grown', 'Vermi-composting', 'Rainwater Harvesting', 'Zero Chemical Pesticides'],
    productCategories: ['Coffee', 'Black Pepper', 'Cardamom', 'Raw Honey'],
    featuredCrops: ['Robusta Coffee', 'Panniyur Pepper', 'Wild Forest Honey'],
    products: [
      {
        id: 'p-w01-1',
        name: 'Wayanad GI Shade-Grown Robusta Beans',
        category: 'Coffee',
        price: 480,
        unit: '500g',
        image: '/assets/products/black-pepper.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-w01-2',
        name: 'Whole Tellicherry Malabar Black Pepper',
        category: 'Spices',
        price: 360,
        unit: '250g',
        image: '/assets/products/black-pepper.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-w01-3',
        name: 'Fresh Green Cardamom Pods (8mm+)',
        category: 'Spices',
        price: 750,
        unit: '200g',
        image: '/assets/products/green-cardamom.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94472 81920',
      email: 'contact@wayanadhighlandguild.org',
      address: 'Muthanga Road, Sulthan Bathery, Wayanad - 673592'
    }
  },
  {
    id: 'v-palakkad-02',
    name: 'Palakkad Grain Heritage Trust',
    slug: 'palakkad-grain-heritage-trust',
    type: 'Cooperative',
    district: 'Palakkad',
    taluk: 'Chittur',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2020,
    isOrganic: true,
    giTag: {
      code: 'GI-025',
      name: 'PALAKKADAN MATTA',
      certificateNumber: 'GI/KL/2006/025'
    },
    rating: 4.8,
    reviewsCount: 230,
    productsCount: 36,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    tagline: 'Preserving ancient nutrient-dense red parboiled rice varieties across the Bharathapuzha basin.',
    description: 'Palakkad Grain Heritage represents 78 traditional paddy farming families practicing sustainable canal-fed wet agriculture in the Chittur plains. Our indigenous Palakkadan Matta undergoes single-boil processing to retain maximum bran fiber.',
    farmSizeAcres: 210,
    elevationMeters: 110,
    farmingPractices: ['Canal Irrigation System', 'Green Manure Mulching', 'Sun-Dried Parboiling', 'Heritage Seed Bank'],
    productCategories: ['Paddy / Rice', 'Pulses', 'Coconut'],
    featuredCrops: ['Matta Unda Rice', 'Vazhakkala Red Rice', 'Desi Cow Ghee'],
    products: [
      {
        id: 'p-p02-1',
        name: 'Traditional Palakkadan Matta Unda Rice',
        category: 'Paddy / Rice',
        price: 110,
        unit: 'kg',
        image: '/assets/products/rice.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-p02-2',
        name: 'Wood-Pressed Desi Sesame Oil',
        category: 'Oils',
        price: 420,
        unit: '500ml',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=60',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94951 44320',
      email: 'orders@palakkadmatta.coop',
      address: 'Kollengode Road, Chittur, Palakkad - 678101'
    }
  },
  {
    id: 'v-idukki-03',
    name: 'Cardamom Hills Organic Estate',
    slug: 'cardamom-hills-organic-estate',
    type: 'Family Farm',
    district: 'Idukki',
    taluk: 'Udumbanchola',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2022,
    isOrganic: true,
    giTag: {
      code: 'GI-114',
      name: 'MARAYOOR JAGGERY',
      certificateNumber: 'GI/KL/2019/114'
    },
    rating: 4.9,
    reviewsCount: 165,
    productsCount: 28,
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    tagline: 'High-altitude organic spice garden & traditional wood-fired Marayoor Sharkara artisans.',
    description: 'Rooted at 1,100 meters above sea level in Vandanmedu, this third-generation family estate uses bio-dynamic methods to harvest boutique batches of Alleppey Green Extra Bold Cardamom and pure Marayoor sugarcane jaggery balls.',
    farmSizeAcres: 48,
    elevationMeters: 1120,
    farmingPractices: ['Bio-Dynamic Sprays', 'Bee-Pollinated Groves', 'Wood-Fired Copper Vats', 'Compost Teas'],
    productCategories: ['Cardamom', 'Spices', 'Sweets / Traditional'],
    featuredCrops: ['Marayoor Sharkara', 'Alleppey Green Cardamom', 'Zanzibar Clove'],
    products: [
      {
        id: 'p-i03-1',
        name: 'GI Authenticated Marayoor Jaggery Balls',
        category: 'Sweets / Traditional',
        price: 190,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=500&q=60',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-i03-2',
        name: 'Handpicked Grade-A Green Cardamom',
        category: 'Spices',
        price: 880,
        unit: '250g',
        image: '/assets/products/green-cardamom.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94460 77123',
      email: 'estate@cardamomhills.in',
      address: 'Vandanmedu Post, Udumbanchola, Idukki - 685551'
    }
  },
  {
    id: 'v-ernakulam-04',
    name: 'Vazhakulam Queen Pineapple Growers',
    slug: 'vazhakulam-queen-pineapple-growers',
    type: 'Cooperative',
    district: 'Ernakulam',
    taluk: 'Muvattupuzha',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2023,
    isOrganic: false,
    giTag: {
      code: 'GI-130',
      name: 'VAZHAKULAM PINEAPPLE',
      certificateNumber: 'GI/KL/2009/130'
    },
    rating: 4.7,
    reviewsCount: 198,
    productsCount: 19,
    image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    tagline: 'The sweet golden nectar of Asia’s largest pineapple hub harvested directly at peak brix.',
    description: 'Located in the Pineapple City of Vazhakulam, our 120-member grower federation cultivates the renowned "Mauritius" variety. Celebrated for its crisp golden flesh, pleasant aroma, and supreme natural sweetness.',
    farmSizeAcres: 320,
    elevationMeters: 60,
    farmingPractices: ['GAP (Good Agricultural Practices)', 'Inter-cropping in Rubber', 'Soil Moisture Sensors', 'Integrated Pest Management'],
    productCategories: ['Fruits', 'Vegetables'],
    featuredCrops: ['Mauritius Pineapple', 'Kew Pineapple', 'Pineapple Vinegar'],
    products: [
      {
        id: 'p-e04-1',
        name: 'Vazhakulam GI Mauritius Queen Pineapple',
        category: 'Fruits',
        price: 75,
        unit: 'piece (1.2kg)',
        image: '/assets/products/pineapple.jpg',
        isGiTagged: true,
        organic: false
      },
      {
        id: 'p-e04-2',
        name: 'Cold-Pressed Raw Pineapple Jam (No Sugar Added)',
        category: 'Fruits',
        price: 240,
        unit: '350g',
        image: '/assets/products/pineapple.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 485 226 7744',
      email: 'sales@vazhakulampineapple.org',
      address: 'Main Market Road, Vazhakulam, Muvattupuzha, Ernakulam - 686670'
    }
  },
  {
    id: 'v-kuttanad-05',
    name: 'Kuttanad Wetlands Bio-Collective',
    slug: 'kuttanad-wetlands-bio-collective',
    type: 'Cooperative',
    district: 'Alappuzha',
    taluk: 'Kuttanad',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2021,
    isOrganic: true,
    giTag: {
      code: 'GI-121',
      name: 'POKKALI ORGANIC RICE',
      certificateNumber: 'GI/KL/2007/121'
    },
    rating: 4.9,
    reviewsCount: 142,
    productsCount: 24,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    tagline: 'Farming below sea-level: Salt-tolerant organic Pokkali paddy rotated with tidal tiger prawns.',
    description: 'Kuttanad represents India’s only below sea-level agricultural heritage (Globally Important Agricultural Heritage System - GIAHS). Our farmers alternate chemical-free Pokkali rice with organic tidal aquaculture during the monsoon tides.',
    farmSizeAcres: 185,
    elevationMeters: -2,
    farmingPractices: ['Tidal Flood Plain Cycling', 'Zero Chemical Input', 'Heritage Seed Germination', 'Integrated Aquaculture'],
    productCategories: ['Paddy / Rice', 'Coconut'],
    featuredCrops: ['Pokkali Rice', 'Tender Coconuts', 'Duck Eggs'],
    products: [
      {
        id: 'p-k05-1',
        name: 'GI Certified Organic Pokkali Red Grain',
        category: 'Paddy / Rice',
        price: 155,
        unit: 'kg',
        image: '/assets/products/rice.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-k05-2',
        name: 'Extra Virgin Wet-Milled Coconut Oil',
        category: 'Coconut',
        price: 380,
        unit: '500ml',
        image: '/assets/products/coconut.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 98471 33201',
      email: 'pokkali@kuttanadagro.org',
      address: 'Near Kayal Boat Jetty, Nedumudy, Kuttanad, Alappuzha - 688503'
    }
  },
  {
    id: 'v-thrissur-06',
    name: 'Kole Wetlands Organic Guild',
    slug: 'kole-wetlands-organic-guild',
    type: 'Family Farm',
    district: 'Thrissur',
    taluk: 'Chavakkad',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2024,
    isOrganic: true,
    giTag: {
      code: 'GI-663',
      name: 'CHENGALIKODAN BANANA',
      certificateNumber: 'GI/KL/2015/663'
    },
    rating: 4.8,
    reviewsCount: 110,
    productsCount: 31,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tagline: 'Cultivating the divine golden Chengalikodan Nendran bananas in fertile kole wetland silt.',
    description: 'Renowned for producing Kerala’s most prized Onam table banana, our farm utilizes mineral-rich river alluvium and organic neem cake compost to nurture thick, honey-sweet, golden-skinned Chengalikodan bunches.',
    farmSizeAcres: 35,
    elevationMeters: 15,
    farmingPractices: ['Cow Dung Slurry', 'Neem Seed Kernel Extracts', 'Mulched Furrows', 'Trichoderma Bio-controls'],
    productCategories: ['Banana / Plantain', 'Vegetables'],
    featuredCrops: ['Chengalikodan Banana', 'Nendran Chips', 'Elephant Foot Yam'],
    products: [
      {
        id: 'p-t06-1',
        name: 'GI Grade Chengalikodan Nendran Cluster',
        category: 'Banana / Plantain',
        price: 90,
        unit: 'kg',
        image: '/assets/products/nendran-banana.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-t06-2',
        name: 'Pure Coconut Oil Fried Banana Chips',
        category: 'Banana / Plantain',
        price: 180,
        unit: '250g',
        image: '/assets/products/nendran-banana.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 97455 21088',
      email: 'orders@chengalikodan.farm',
      address: 'Puzhakkal Kole Basin, Chavakkad Road, Thrissur - 680553'
    }
  },
  {
    id: 'v-wayanad-07',
    name: 'Kabini River Valley Spices',
    slug: 'kabini-river-valley-spices',
    type: 'Individual Farmer',
    district: 'Wayanad',
    taluk: 'Mananthavady',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2022,
    isOrganic: true,
    giTag: {
      code: 'GI-391',
      name: 'JEERAKASALA RICE',
      certificateNumber: 'GI/KL/2010/391'
    },
    rating: 4.9,
    reviewsCount: 96,
    productsCount: 18,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    tagline: 'Aromatic micro-climate cultivation along the Kabini river basin by farmer George Kurian.',
    description: 'George Kurian operates an award-winning integrated permaculture farm along the upper banks of the Kabini. He has preserved original Wayanad Jeerakasala scented rice genetics alongside ginger and turmeric cultivars.',
    farmSizeAcres: 18,
    elevationMeters: 780,
    farmingPractices: ['Permaculture Guilds', 'Heritage Grain Seed Saver', 'Apiculture Pollination', 'Zero Tillage'],
    productCategories: ['Paddy / Rice', 'Spices'],
    featuredCrops: ['Jeerakasala Biryani Rice', 'Wayanad Turmeric', 'Wild Ginger'],
    products: [
      {
        id: 'p-w07-1',
        name: 'Aromatic Wayanad Jeerakasala Biryani Rice',
        category: 'Paddy / Rice',
        price: 185,
        unit: 'kg',
        image: '/assets/products/rice.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-w07-2',
        name: 'Sun-Dried Malabar Raw Ginger (Curcuma)',
        category: 'Spices',
        price: 140,
        unit: '250g',
        image: '/assets/products/ginger.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94478 90312',
      email: 'george@kabinivalley.in',
      address: 'Thirunelly Road, Mananthavady, Wayanad - 670645'
    }
  },
  {
    id: 'v-kozhikode-08',
    name: 'Malabar Spice Coast Alliance',
    slug: 'malabar-spice-coast-alliance',
    type: 'Cooperative',
    district: 'Kozhikode',
    taluk: 'Vadakara',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2020,
    isOrganic: true,
    giTag: {
      code: 'GI-102',
      name: 'MALABAR BLACK PEPPER',
      certificateNumber: 'GI/KL/2008/102'
    },
    rating: 4.8,
    reviewsCount: 215,
    productsCount: 45,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    tagline: 'The historic "Black Gold" port merchant collective connecting back-garden vines to world tables.',
    description: 'With over 200 smallholder farmer members across the Kuttiadi foothills, the Alliance aggregates steam-sterilized, sun-cured Malabar pepper known globally for its high piperine kick and citrus-woody undertones.',
    farmSizeAcres: 280,
    elevationMeters: 140,
    farmingPractices: ['Sun-Floor Curing', 'Steam Sterilization', 'Farmer Price Floor Guarantee', 'Fair Trade Certified'],
    productCategories: ['Black Pepper', 'Spices'],
    featuredCrops: ['Tellicherry Bold Pepper', 'Nutmeg Mace', 'Ceylon Cinnamon'],
    products: [
      {
        id: 'p-k08-1',
        name: 'GI Malabar Garbled Black Pepper (TGSEB Grade)',
        category: 'Black Pepper',
        price: 390,
        unit: '250g',
        image: '/assets/products/black-pepper.jpg',
        isGiTagged: true,
        organic: true
      },
      {
        id: 'p-k08-2',
        name: 'Freshly Grated Red Nutmeg Mace',
        category: 'Spices',
        price: 490,
        unit: '100g',
        image: '/assets/products/green-cardamom.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 495 241 8900',
      email: 'trade@malabaralliance.org',
      address: 'Spice Bazaar, Beach Road, Vadakara, Kozhikode - 673101'
    }
  },
  {
    id: 'v-kasaragod-09',
    name: 'Bekal Hillside Coconut & Desi Dairy',
    slug: 'bekal-hillside-coconut-dairy',
    type: 'Family Farm',
    district: 'Kasaragod',
    taluk: 'Hosdurg',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2023,
    isOrganic: true,
    rating: 4.7,
    reviewsCount: 88,
    productsCount: 22,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    tagline: 'Pure A2 Kasaragod dwarf cow milk, wood-pressed copra oils, and tender organic coconuts.',
    description: 'Perched on the coastal laterite hills of Bekal, this sustainable integrated farm nurtures purebred indigenous Kasaragod dwarf cows. Cow dung and urine fertilize 25 acres of West Coast Tall coconut palms.',
    farmSizeAcres: 25,
    elevationMeters: 45,
    farmingPractices: ['A2 Indigenous Cattle Free-Grazing', 'Circular Bio-gas Loop', 'Wood-Pressed Expeller', 'Drip Micro-fertigation'],
    productCategories: ['Dairy Products', 'Coconut'],
    featuredCrops: ['A2 Bilona Ghee', 'Raw Coconut Sugar', 'Virgin Copra Oil'],
    products: [
      {
        id: 'p-ks09-1',
        name: 'Handcrafted A2 Desi Cow Bilona Ghee',
        category: 'Dairy Products',
        price: 950,
        unit: '500ml',
        image: '/assets/products/fresh-cow-milk.jpg',
        organic: true
      },
      {
        id: 'p-ks09-2',
        name: 'Raw Unrefined Coconut Blossom Sugar',
        category: 'Coconut',
        price: 260,
        unit: '500g',
        image: '/assets/products/coconut.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94972 10834',
      email: 'hello@bekalheritagefarms.com',
      address: 'Kanhangad Coastal Strip, Hosdurg, Kasaragod - 671315'
    }
  },
  {
    id: 'v-kottayam-10',
    name: 'Meenachil River Polyhouse Greens',
    slug: 'meenachil-river-polyhouse-greens',
    type: 'Individual Farmer',
    district: 'Kottayam',
    taluk: 'Meenachil',
    state: 'Kerala',
    verified: false,
    verifiedSince: 2025,
    isOrganic: true,
    rating: 4.6,
    reviewsCount: 62,
    productsCount: 16,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80',
    tagline: 'Pesticide-free salad greens, bell peppers, and native gourds grown under climate-sheltered polyhouses.',
    description: 'Started by young agri-entrepreneur Anjali Mathew, Meenachil Greens leverages climate-smart controlled polyhouses with automated drip nutrition to deliver crisp exotic veggies within 6 hours of harvest.',
    farmSizeAcres: 12,
    elevationMeters: 35,
    farmingPractices: ['Protected Cultivation', 'Hydro-organic Fertigation', 'Solar Insect Traps', 'Same-Day Cold Packing'],
    productCategories: ['Vegetables'],
    featuredCrops: ['Color Bell Peppers', 'Cherry Tomatoes', 'Butterhead Lettuce'],
    products: [
      {
        id: 'p-kt10-1',
        name: 'Sweet Hydro-Organic Cherry Tomatoes',
        category: 'Vegetables',
        price: 65,
        unit: '250g',
        image: '/assets/products/tomato.jpg',
        organic: true
      },
      {
        id: 'p-kt10-2',
        name: 'Farm Fresh Green Chillies (Pesticide Safe)',
        category: 'Vegetables',
        price: 35,
        unit: '250g',
        image: '/assets/products/green-chilli.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 94465 88912',
      email: 'anjali@meenachilgreens.in',
      address: 'Pala By-pass Road, Meenachil, Kottayam - 686575'
    }
  },
  {
    id: 'v-idukki-11',
    name: 'Munnar Misty Leaf Tea Estate',
    slug: 'munnar-misty-leaf-tea-estate',
    type: 'Estate',
    district: 'Idukki',
    taluk: 'Devikulam',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2019,
    isOrganic: true,
    rating: 4.9,
    reviewsCount: 310,
    productsCount: 38,
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    tagline: 'Artisanal whole-leaf black, white, and silver needle teas hand-plucked above 1,600 meters.',
    description: 'Situated among the highest peaks in South India, Munnar Misty Leaf crafts orthodox hand-rolled whole leaf teas. The unique diurnal temperature shift concentrates floral muscatel aromatic notes in every tea bud.',
    farmSizeAcres: 95,
    elevationMeters: 1650,
    farmingPractices: ['Two Leaves and a Bud Hand Plucking', 'Single-Estate Orthodox Rolling', 'Solar Loft Withering', 'Rainforest Alliance Certified'],
    productCategories: ['Tea'],
    featuredCrops: ['Silver Needle White Tea', 'Highland Golden Pekoe', 'Lemongrass Green Tea'],
    products: [
      {
        id: 'p-m11-1',
        name: 'Highland Orthodox Hand-Rolled Black Tea',
        category: 'Tea',
        price: 320,
        unit: '200g',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=60',
        organic: true
      }
    ],
    contact: {
      phone: '+91 486 523 0988',
      email: 'tastingroom@munnarmistyleaf.com',
      address: 'Top Station Route, Devikulam, Idukki - 685613'
    }
  },
  {
    id: 'v-palakkad-12',
    name: 'Nila Valley Heritage Banana Cooperative',
    slug: 'nila-valley-banana-cooperative',
    type: 'Cooperative',
    district: 'Palakkad',
    taluk: 'Ottapalam',
    state: 'Kerala',
    verified: true,
    verifiedSince: 2021,
    isOrganic: true,
    rating: 4.8,
    reviewsCount: 172,
    productsCount: 26,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    tagline: 'Farmer-owned society cultivating traditional heirloom banana varieties along River Nila.',
    description: 'Encompassing 64 smallholder farm holdings, Nila Valley specializes in native varieties including Kadali, Poovan, Robusta, and Red Kappa bananas ripened naturally without artificial calcium carbide fumes.',
    farmSizeAcres: 85,
    elevationMeters: 90,
    farmingPractices: ['Natural Smoke Ethylene Chamber', 'Mulched Leaf Composting', 'Cow Urine Growth Promoters', 'Pheromone Trap Protection'],
    productCategories: ['Banana / Plantain'],
    featuredCrops: ['Kadali Temple Banana', 'Red Kappa Banana', 'Raw Banana Flour'],
    products: [
      {
        id: 'p-n12-1',
        name: 'Naturally Tree-Ripened Kadali Banana',
        category: 'Banana / Plantain',
        price: 70,
        unit: 'dozen',
        image: '/assets/products/nendran-banana.jpg',
        organic: true
      },
      {
        id: 'p-n12-2',
        name: 'Gluten-Free Organic Green Banana Flour',
        category: 'Banana / Plantain',
        price: 160,
        unit: '500g',
        image: '/assets/products/nendran-banana.jpg',
        organic: true
      }
    ],
    contact: {
      phone: '+91 466 224 5500',
      email: 'nilabanana@kisanmarket.in',
      address: 'Varikkasseri Road, Ottapalam, Palakkad - 679101'
    }
  }
];

export const KERALA_DISTRICTS = [
  'All Districts',
  'Wayanad',
  'Idukki',
  'Palakkad',
  'Ernakulam',
  'Alappuzha',
  'Thrissur',
  'Kozhikode',
  'Kasaragod',
  'Kottayam'
];

export const VENDOR_TYPES = [
  'All Types',
  'Individual Farmer',
  'Cooperative',
  'Family Farm',
  'Estate'
];

export const CROP_CATEGORIES = [
  'All Crops',
  'Coffee',
  'Black Pepper',
  'Cardamom',
  'Paddy / Rice',
  'Coconut',
  'Banana / Plantain',
  'Spices',
  'Fruits',
  'Vegetables',
  'Dairy Products',
  'Tea'
];
