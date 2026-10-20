import fs from 'fs';
import path from 'path';

// Curated high quality product image sets from Unsplash CDN for each category
const IMAGES = {
  mensClothing: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
  ],
  womensClothing: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80',
  ],
  kidsClothing: [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80',
  ],
  fashionAccessories: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
  ],
  phoneCases: [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&auto=format&fit=crop&q=80',
  ],
  phoneChargers: [
    'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609592807664-893e986ecfb5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
  ],
  phoneStands: [
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80',
  ],
  phoneProtection: [
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
  ],
  laptopStickers: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
  ],
  laptopAccessories: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
  ],
  homeAccessories: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
  ],
  kitchenAccessories: [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  ],
  storageOrganization: [
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
  ],
  deskWorkspace: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ],
  lifestyleEssentials: [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597359-009d733cfb5f?w=800&auto=format&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
  ],
};

const CATEGORY_SPECS = [
  // 1. Men's Clothing (25 products)
  {
    catId: 'mens-clothing',
    subcategories: ['T-shirts', 'Polo shirts', 'Casual shirts', 'Formal shirts', 'Jeans', 'Trousers', 'Shorts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Coats', 'Shalwar kameez', 'Waistcoats'],
    brands: ['OMNI Studio', 'J. & Z. Heritage', 'Savile & Oak', 'Kurabo Mills', 'Nordic Atelier', 'Aethel Men', 'Apex Tailors'],
    imgKey: 'mensClothing',
    hasSizes: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Onyx Black', hex: '#18181b' },
      { name: 'Chalk White', hex: '#fcfcfc' },
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Slate Gray', hex: '#475569' },
    ],
    items: [
      { name: 'Heritage Supima Cotton Heavyweight Crewneck T-Shirt', sub: 'T-shirts', basePrice: 34, origPrice: 48 },
      { name: 'Organic Slub Waffle Knit Long Sleeve Tee', sub: 'T-shirts', basePrice: 38, origPrice: 52 },
      { name: 'Mercerized Pima Cotton Modern Polo Shirt', sub: 'Polo shirts', basePrice: 46, origPrice: 62 },
      { name: 'Bespoke Textured Oxford Button-Down Shirt', sub: 'Casual shirts', basePrice: 58, origPrice: 78 },
      { name: 'Tailored Non-Iron Egyptian Cotton Dress Shirt', sub: 'Formal shirts', basePrice: 68, origPrice: 92 },
      { name: '14oz Selvedge Japanese Denim Slim Tapered Jeans', sub: 'Jeans', basePrice: 110, origPrice: 145 },
      { name: 'Relaxed Fit Vintage Wash Indigo Carpenter Jeans', sub: 'Jeans', basePrice: 85, origPrice: 115 },
      { name: 'Tailored Stretch Wool Pleated Trousers', sub: 'Trousers', basePrice: 79, origPrice: 105 },
      { name: 'Tactical Lightweight Ripstop Cargo Shorts', sub: 'Shorts', basePrice: 42, origPrice: 58 },
      { name: 'Super-Heavyweight 480 GSM French Terry Boxy Hoodie', sub: 'Hoodies', basePrice: 64, origPrice: 88 },
      { name: 'Minimalist Half-Zip Mock Neck Fleece Sweatshirt', sub: 'Sweatshirts', basePrice: 54, origPrice: 74 },
      { name: 'Weatherproof Waxed Canvas Field Utility Jacket', sub: 'Jackets', basePrice: 135, origPrice: 180 },
      { name: 'Double-Breasted Wool Overcoat with Satin Lining', sub: 'Coats', basePrice: 195, origPrice: 260 },
      { name: 'Artisan Embroidered Handcrafted Shalwar Kameez Suit', sub: 'Shalwar kameez', basePrice: 89, origPrice: 120 },
      { name: 'Raw Textured Wool Formal Waistcoat with Horn Buttons', sub: 'Waistcoats', basePrice: 68, origPrice: 95 },
      { name: 'Minimalist Breathable Linen Vacation Camp Collar Shirt', sub: 'Casual shirts', basePrice: 52, origPrice: 68 },
      { name: 'Thermal Quilted Insulated Liner Jacket', sub: 'Jackets', basePrice: 89, origPrice: 120 },
      { name: 'Tech Knit Athletic Training Track Pants', sub: 'Trousers', basePrice: 48, origPrice: 65 },
      { name: 'Classic Silk Finish Tropical Kurta Pajama Two-Piece', sub: 'Shalwar kameez', basePrice: 75, origPrice: 98 },
      { name: 'Luxury Cashmere-Touch Ribbed Crewneck Sweater', sub: 'Sweatshirts', basePrice: 92, origPrice: 130 },
      { name: 'Vintage Heavyweight Pigment Dyed Graphic Tee', sub: 'T-shirts', basePrice: 32, origPrice: 44 },
      { name: 'Windproof Bonded Shell Commuter Trench Coat', sub: 'Coats', basePrice: 165, origPrice: 220 },
      { name: 'Performance Wrinkle-Resistant Travel Chinos', sub: 'Trousers', basePrice: 62, origPrice: 85 },
      { name: 'Brushed Flannel Plaid Overshirt Jacket', sub: 'Jackets', basePrice: 72, origPrice: 98 },
      { name: 'Classic Ban Collar Silk Embroidered Festive Kurta', sub: 'Shalwar kameez', basePrice: 65, origPrice: 88 }
    ]
  },

  // 2. Women's Clothing (25 products)
  {
    catId: 'womens-clothing',
    subcategories: ['Dresses', 'Tops', 'Blouses', 'Jeans', 'Trousers', 'Skirts', 'Co-ord sets', 'Hoodies', 'Jackets', 'Abayas', 'Hijabs', 'Dupattas', 'Shalwar kameez', 'Kurtis'],
    brands: ['Maison Noor', 'Aveil Studio Dubai', 'Noor Modern Craft', 'OMNI Studio Atelier', 'Saffron & Silk', 'Lumina Femme'],
    imgKey: 'womensClothing',
    hasSizes: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'Mocha Taupe', hex: '#78716c' },
      { name: 'Sage Floral', hex: '#52796f' },
      { name: 'Rose Quartz', hex: '#fda4af' },
    ],
    items: [
      { name: 'Silk Blend Hand-Block Printed Festive Kurti Dress', sub: 'Kurtis', basePrice: 54, origPrice: 75 },
      { name: 'Korean Matte Nida Front-Open Crepe Abaya with Sheila', sub: 'Abayas', basePrice: 92, origPrice: 130 },
      { name: 'Embroidered Chiffon 3-Piece Shalwar Kameez Suit', sub: 'Shalwar kameez', basePrice: 115, origPrice: 160 },
      { name: 'Fluid High-Waisted Wide Leg Lyocell Palazzo Trousers', sub: 'Trousers', basePrice: 49, origPrice: 65 },
      { name: 'Silk Charmeuse Bias-Cut Slip Midi Dress', sub: 'Dresses', basePrice: 78, origPrice: 110 },
      { name: 'Tailored Wrap Belted Linen Summer Blazer', sub: 'Jackets', basePrice: 95, origPrice: 135 },
      { name: 'Luxe Textured Modal Ribbed Mockneck Top', sub: 'Tops', basePrice: 32, origPrice: 45 },
      { name: 'Pleated A-Line Satin Midi Skirt with Elastic Waistband', sub: 'Skirts', basePrice: 46, origPrice: 64 },
      { name: 'Two-Piece Loungewear Terry Cotton Co-ord Set', sub: 'Co-ord sets', basePrice: 68, origPrice: 92 },
      { name: 'Premium Georgette Breathable Textured Hijab Scarf', sub: 'Hijabs', basePrice: 18, origPrice: 28 },
      { name: 'Hand-Woven Organza Dupatta with Gold Zari Border', sub: 'Dupattas', basePrice: 38, origPrice: 54 },
      { name: 'Oversized Boyfriend Denim Jacket with Brushed Brass Buttons', sub: 'Jackets', basePrice: 84, origPrice: 115 },
      { name: 'Tiered Bohemian Maxi Sundress in Breathable Cotton', sub: 'Dresses', basePrice: 62, origPrice: 85 },
      { name: 'Tailored Straight Leg High-Rise Stretch Jeans', sub: 'Jeans', basePrice: 72, origPrice: 98 },
      { name: 'Cashmere Blend Minimalist V-Neck Sweater', sub: 'Tops', basePrice: 88, origPrice: 125 },
      { name: 'Sculpted Silhouette Asymmetric Peplum Top', sub: 'Tops', basePrice: 42, origPrice: 60 },
      { name: 'Embroidered Lawn Festive 2-Piece Kurti Set', sub: 'Kurtis', basePrice: 59, origPrice: 82 },
      { name: 'Pleated Velvet Evening Abaya with Scallop Borders', sub: 'Abayas', basePrice: 125, origPrice: 175 },
      { name: 'Fine Knit Cropped Cardigan with Tortoise Shell Buttons', sub: 'Tops', basePrice: 48, origPrice: 65 },
      { name: 'Relaxed Silhouette French Terry Hoodie Dress', sub: 'Hoodies', basePrice: 56, origPrice: 76 },
      { name: 'Floral Hand-Embroidered Chanderi Silk Kurta', sub: 'Kurtis', basePrice: 69, origPrice: 95 },
      { name: 'High-Waist Tailored Wool-Blend Culotte Pants', sub: 'Trousers', basePrice: 64, origPrice: 88 },
      { name: 'Structured Double-Breasted Trench Raincoat', sub: 'Jackets', basePrice: 145, origPrice: 195 },
      { name: 'Crinkle Chiffon Everyday Hijab with Matching Undercap', sub: 'Hijabs', basePrice: 16, origPrice: 24 },
      { name: 'Silk Printed Paisley Scarf Wrap', sub: 'Dupattas', basePrice: 26, origPrice: 38 }
    ]
  },

  // 3. Kids' Clothing (20 products)
  {
    catId: 'kids-clothing',
    subcategories: ['Baby clothing', "Girls' clothing", "Boys' clothing", 'Schoolwear', 'Seasonal outfits'],
    brands: ['Petite Bloom', 'SprintKids Active', 'Nordic Tots', 'Mini Haven', 'Little Soles'],
    imgKey: 'kidsClothing',
    hasSizes: true,
    sizes: ['0-3M', '6-12M', '2T', '4T', '6Y', '8Y', '10Y'],
    colors: [
      { name: 'Soft Oat', hex: '#e7e5e4' },
      { name: 'Sage Mist', hex: '#84a98c' },
      { name: 'Sky Blue', hex: '#7dd3fc' },
      { name: 'Blush Pink', hex: '#f472b6' },
    ],
    items: [
      { name: 'Organic Ribbed Cotton Baby Romper (3-Pack Set)', sub: 'Baby clothing', basePrice: 24, origPrice: 36 },
      { name: 'Toddler Two-Way Zipper Organic Sleepsuit', sub: 'Baby clothing', basePrice: 18, origPrice: 26 },
      { name: 'Girls Ruffle Tiered Linen Floral Dress', sub: "Girls' clothing", basePrice: 32, origPrice: 45 },
      { name: 'Boys Classic Oxford Collar Shirt with Bowtie', sub: "Boys' clothing", basePrice: 28, origPrice: 39 },
      { name: 'Reinforced Knee School Uniform Cotton Pants (2-Pack)', sub: 'Schoolwear', basePrice: 34, origPrice: 48 },
      { name: 'Kids Waterproof Hooded Rain Poncho Jacket', sub: 'Seasonal outfits', basePrice: 26, origPrice: 38 },
      { name: 'Unisex Cozy Fleece Pullover Sweatshirt', sub: 'Kids clothing', basePrice: 22, origPrice: 32 },
      { name: 'Soft Breathable Bamboo Cotton Baby Swaddle Blanket Set', sub: 'Baby clothing', basePrice: 21, origPrice: 30 },
      { name: 'Girls Tulle Party Dress with Sequin Bow', sub: "Girls' clothing", basePrice: 38, origPrice: 52 },
      { name: 'Boys Elastic Waist Stretch Cargo Joggers', sub: "Boys' clothing", basePrice: 24, origPrice: 35 },
      { name: 'Kids Thermal Winter Puffer Vest with Zipper Pockets', sub: 'Seasonal outfits', basePrice: 32, origPrice: 46 },
      { name: 'Organic Waffle Knit Pajama Set (2-Piece)', sub: 'Baby clothing', basePrice: 25, origPrice: 35 },
      { name: 'Kids Striped Breathable Cotton Polo Tee', sub: 'Schoolwear', basePrice: 16, origPrice: 24 },
      { name: 'Girls Denim Overalls Pinafore with Adjustable Straps', sub: "Girls' clothing", basePrice: 29, origPrice: 42 },
      { name: 'Boys Athletic Quick-Dry Mesh Shorts (2-Pack)', sub: "Boys' clothing", basePrice: 19, origPrice: 28 },
      { name: 'Kids UPF 50+ Sun Protection Swimsuit Set', sub: 'Seasonal outfits', basePrice: 27, origPrice: 38 },
      { name: 'Toddler Knitted Cardigan Sweater with Wood Buttons', sub: 'Baby clothing', basePrice: 26, origPrice: 38 },
      { name: 'School Uniform Cotton Pique Pleated Skirt', sub: 'Schoolwear', basePrice: 22, origPrice: 32 },
      { name: 'Kids Sherpa Lined Winter Hooded Jacket', sub: 'Seasonal outfits', basePrice: 44, origPrice: 62 },
      { name: 'Baby First-Steps Soft Leather Moccasins', sub: 'Baby clothing', basePrice: 19, origPrice: 28 }
    ]
  },

  // 4. Shoes and Footwear (25 products)
  {
    catId: 'shoes-footwear',
    subcategories: ['Sneakers', 'Formal shoes', 'Running shoes', 'Leather boots', 'Loafers', 'Casual slides', 'Sandals', 'Heels', 'Flats'],
    brands: ['Aethel Footwear', 'Vanguard Leather', 'Nordic Stride', 'Maison Laurent', 'SprintPro'],
    imgKey: 'shoes',
    hasSizes: true,
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: [
      { name: 'Clean White', hex: '#ffffff' },
      { name: 'Cognac Brown', hex: '#78350f' },
      { name: 'Stealth Black', hex: '#171717' },
    ],
    items: [
      { name: 'Minimalist Italian Nappa Leather Court Sneakers', sub: 'Sneakers', basePrice: 95, origPrice: 135 },
      { name: 'Goodyear Welted Cap-Toe Oxford Leather Shoes', sub: 'Formal shoes', basePrice: 145, origPrice: 195 },
      { name: 'Ultra-Cushioned Carbon Plate Long-Distance Running Shoes', sub: 'Running shoes', basePrice: 125, origPrice: 165 },
      { name: 'Handcrafted Chelsea Boots in Waxed Weatherproof Suede', sub: 'Leather boots', basePrice: 155, origPrice: 210 },
      { name: 'Classic Penny Loafers with Vibram Commando Lug Sole', sub: 'Loafers', basePrice: 110, origPrice: 150 },
      { name: 'Ergonomic Molded Cork Footbed Leather Slides', sub: 'Casual slides', basePrice: 45, origPrice: 65 },
      { name: 'Traditional Hand-Stitched Leather Peshawari Chappal', sub: 'Sandals', basePrice: 58, origPrice: 82 },
      { name: 'Pointed Toe Sculptural Kitten Heels (65mm)', sub: 'Heels', basePrice: 88, origPrice: 120 },
      { name: 'Buttery Soft Leather Ballerina Flats with Bow', sub: 'Flats', basePrice: 68, origPrice: 95 },
      { name: 'Retro 90s Chunky Suede Trainer Sneakers', sub: 'Sneakers', basePrice: 82, origPrice: 115 },
      { name: 'Waterproof Leather Hiking Trekking Boots', sub: 'Leather boots', basePrice: 138, origPrice: 185 },
      { name: 'Lightweight Breathable Slip-On Knit Walking Shoes', sub: 'Running shoes', basePrice: 52, origPrice: 75 },
      { name: 'Monk Strap Buckled Formal Dress Shoes', sub: 'Formal shoes', basePrice: 130, origPrice: 175 },
      { name: 'Minimalist Ankle Strap Block Heel Sandals', sub: 'Heels', basePrice: 74, origPrice: 105 },
      { name: 'Memory Foam House Slippers with Rubber Sole', sub: 'Casual slides', basePrice: 24, origPrice: 35 },
      { name: 'Vintage Derby Blucher Shoes in Pull-Up Leather', sub: 'Formal shoes', basePrice: 118, origPrice: 160 },
      { name: 'Zero-Drop Trail Running Barefoot Shoes', sub: 'Running shoes', basePrice: 89, origPrice: 120 },
      { name: 'Platform Chunky Oxford Brogues for Women', sub: 'Formal shoes', basePrice: 85, origPrice: 118 },
      { name: 'Classic Leather Driving Shoes with Pebble Sole', sub: 'Loafers', basePrice: 78, origPrice: 110 },
      { name: 'Strappy Gladiator Leather Flat Summer Sandals', sub: 'Sandals', basePrice: 49, origPrice: 69 },
      { name: 'High-Top Canvas Heritage Basketball Sneakers', sub: 'Sneakers', basePrice: 58, origPrice: 78 },
      { name: 'Suede Moccasin Slippers with Faux Shearling Lining', sub: 'Casual slides', basePrice: 38, origPrice: 54 },
      { name: 'Water-Resistant Combat Lace-Up Ankle Boots', sub: 'Leather boots', basePrice: 120, origPrice: 165 },
      { name: 'Square Toe Leather Mules with Stacked Heel', sub: 'Heels', basePrice: 79, origPrice: 112 },
      { name: 'Knit Elastic Slip-On Lightweight Kids Sneakers', sub: 'Sneakers', basePrice: 29, origPrice: 42 }
    ]
  },

  // 5. Fashion Accessories (25 products)
  {
    catId: 'fashion-accessories',
    subcategories: ['Watches', 'Belts', 'Wallets', 'Bags & backpacks', 'Caps & hats', 'Sunglasses', 'Jewelry', 'Scarves'],
    brands: ['Chronos Atelier', 'Vanguard Leather', 'Aura Fine Jewels', 'Nordic Carry', 'Solstice Optics'],
    imgKey: 'fashionAccessories',
    colors: [
      { name: 'Brushed Gold / Brass', hex: '#eab308' },
      { name: 'Matte Titanium', hex: '#64748b' },
      { name: 'Saddle Tan', hex: '#9a3412' },
      { name: 'Obsidian Black', hex: '#18181b' },
    ],
    items: [
      { name: 'Automatic Bauhaus Minimalist Watch with Sapphire Crystal', sub: 'Watches', basePrice: 185, origPrice: 250 },
      { name: 'Full-Grain Bridle Leather Casual Dress Belt with Brass Buckle', sub: 'Belts', basePrice: 38, origPrice: 52 },
      { name: 'Slim RFID-Blocking Carbon Fiber Cardholder Wallet', sub: 'Wallets', basePrice: 24, origPrice: 38 },
      { name: 'Top-Grain Leather Bi-Fold Wallet with Coin Pocket', sub: 'Wallets', basePrice: 42, origPrice: 60 },
      { name: 'Waterproof Commuter Rolltop Backpack 24L with Laptop Sleeve', sub: 'Bags & backpacks', basePrice: 79, origPrice: 110 },
      { name: 'Italian Calfskin Leather Structured Satchel Handbag', sub: 'Bags & backpacks', basePrice: 145, origPrice: 195 },
      { name: 'Polarized Acetate Wayfarer Classic Sunglasses', sub: 'Sunglasses', basePrice: 48, origPrice: 72 },
      { name: 'Aviator Titanium Frame UV400 Sunglasses', sub: 'Sunglasses', basePrice: 65, origPrice: 95 },
      { name: '18k Gold Vermeil Chunky Twisted Hoop Earrings (Pair)', sub: 'Jewelry', basePrice: 24.9, origPrice: 42 },
      { name: 'Certified 925 Sterling Silver Herringbone Chain Necklace', sub: 'Jewelry', basePrice: 39, origPrice: 58 },
      { name: 'Washed Twill Unstructured Low-Profile Baseball Cap', sub: 'Caps & hats', basePrice: 22, origPrice: 32 },
      { name: '100% Mongolian Pure Cashmere Winter Fringe Scarf', sub: 'Scarves', basePrice: 68, origPrice: 95 },
      { name: 'Minimalist Automatic Diver Watch (200m Water Resistant)', sub: 'Watches', basePrice: 210, origPrice: 290 },
      { name: 'Reversible Italian Leather Dress Belt (Black/Brown)', sub: 'Belts', basePrice: 45, origPrice: 65 },
      { name: 'Convertible Leather Tote Bag with Shoulder Strap', sub: 'Bags & backpacks', basePrice: 98, origPrice: 140 },
      { name: 'Round Horn-Rimmed Polarized Blue-Light Blocking Glasses', sub: 'Sunglasses', basePrice: 34, origPrice: 50 },
      { name: 'Freshwater Pearl Pendant Necklace with 14k Gold Chain', sub: 'Jewelry', basePrice: 48, origPrice: 70 },
      { name: 'Wide Brim UPF 50+ Packable Summer Straw Hat', sub: 'Caps & hats', basePrice: 28, origPrice: 40 },
      { name: 'Textured Wool Blend Ribbed Beanie Hat', sub: 'Caps & hats', basePrice: 19, origPrice: 28 },
      { name: 'Vintage Mechanical Skeleton Pocket Watch with Chain', sub: 'Watches', basePrice: 62, origPrice: 89 },
      { name: 'Heavy Canvas Weekender Duffle Travel Bag 45L', sub: 'Bags & backpacks', basePrice: 74, origPrice: 105 },
      { name: 'Minimalist Solid Brass Keyhook Carabiner Lanyard', sub: 'Jewelry', basePrice: 15, origPrice: 22 },
      { name: 'Silk Pocket Square with Hand-Rolled Edges (3-Pack)', sub: 'Scarves', basePrice: 24, origPrice: 35 },
      { name: 'Leather Passport Travel Wallet with Boarding Pass Slot', sub: 'Wallets', basePrice: 28, origPrice: 42 },
      { name: 'Stainless Steel Magnetic Mesh Milanese Watch Strap', sub: 'Watches', basePrice: 22, origPrice: 32 }
    ]
  },

  // 6. Phone Cases and Covers (25 products)
  {
    catId: 'phone-cases',
    subcategories: ['MagSafe cases', 'Armor kickstand cases', 'Clear shockproof covers', 'Ultra-thin matte cases', 'Leather wallet folio cases', 'Waterproof pouches'],
    brands: ['AeroShield Pro', 'VoltGrid Tech', 'TitanArmor', 'Minimalis Labs', 'Vanguard Shield'],
    imgKey: 'phoneCases',
    compatibility: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15 Pro Max', 'iPhone 15 / 15 Plus', 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 / S24+', 'Google Pixel 9 Pro', 'Google Pixel 8'],
    colors: [
      { name: 'Titanium Gray', hex: '#4b5563' },
      { name: 'Midnight Black', hex: '#18181b' },
      { name: 'Deep Sierra Blue', hex: '#1e40af' },
      { name: 'Frosted Clear', hex: '#f1f5f9' },
    ],
    items: [
      { name: 'Aerospace Magnetic Armor Kickstand Case (N52 Magnets)', sub: 'Armor kickstand cases', basePrice: 22.5, origPrice: 32 },
      { name: 'Diamond Anti-Yellowing Crystal Clear Shockproof Case', sub: 'Clear shockproof covers', basePrice: 16.9, origPrice: 25 },
      { name: 'Full-Grain Leather MagSafe Wallet Folio Card Case', sub: 'Leather wallet folio cases', basePrice: 36, origPrice: 50 },
      { name: 'Ultra-Thin 0.35mm Matte Finish Anti-Fingerprint Case', sub: 'Ultra-thin matte cases', basePrice: 14.5, origPrice: 22 },
      { name: 'Heavy-Duty 16ft Drop Tested Dual Layer Rugged Armor Case', sub: 'Armor kickstand cases', basePrice: 26, origPrice: 38 },
      { name: 'Aramid Carbon Fiber Real Composite Magnetic Case', sub: 'MagSafe cases', basePrice: 42, origPrice: 60 },
      { name: 'Liquid Silicone Soft-Touch Velvet Lined Protective Case', sub: 'MagSafe cases', basePrice: 18.5, origPrice: 28 },
      { name: 'IPX8 Certified Universal Waterproof Phone Pouch with Lanyard', sub: 'Waterproof pouches', basePrice: 9.99, origPrice: 16 },
      { name: '360° Rotating Magnetic Ring Grip Stand Case', sub: 'Armor kickstand cases', basePrice: 24, origPrice: 35 },
      { name: 'Eco-Friendly 100% Biodegradable Wheat Straw Matte Case', sub: 'Ultra-thin matte cases', basePrice: 17.5, origPrice: 26 },
      { name: 'Sliding Privacy Camera Cover Bumper Shockproof Case', sub: 'Armor kickstand cases', basePrice: 21, origPrice: 30 },
      { name: 'Magnetic Leather Detachable Wallet Card Stand Case', sub: 'Leather wallet folio cases', basePrice: 32, origPrice: 46 },
      { name: 'Air-Cushion Corner Drop Bumper Frosted Hybrid Case', sub: 'Clear shockproof covers', basePrice: 15.5, origPrice: 24 },
      { name: 'Gradient Sunset Tempered Glass Back Protective Cover', sub: 'Clear shockproof covers', basePrice: 19, origPrice: 28 },
      { name: 'Anodized Aluminum Metal Bumper Frameless Magnetic Case', sub: 'MagSafe cases', basePrice: 28, origPrice: 40 },
      { name: 'Glow-in-the-Dark Luminous Protective Bumper Case', sub: 'Clear shockproof covers', basePrice: 14, origPrice: 20 },
      { name: 'Ultra-Slim Wood Grain Natural Sandalwood Inlay Case', sub: 'MagSafe cases', basePrice: 31, origPrice: 45 },
      { name: 'Dual Layer Rugged Defender Holster Case with Belt Clip', sub: 'Armor kickstand cases', basePrice: 27, origPrice: 39 },
      { name: 'Heat Dissipation Breathable Mesh Cooling Phone Case', sub: 'Ultra-thin matte cases', basePrice: 16, origPrice: 24 },
      { name: 'Magnetic Pop-Up Hidden Finger Grip Protective Case', sub: 'Armor kickstand cases', basePrice: 23, origPrice: 34 },
      { name: 'Matte Translucent Frosted Smoke Acrylic Case', sub: 'Clear shockproof covers', basePrice: 17, origPrice: 25 },
      { name: 'Crossbody Lanyard Strap Clear Shockproof Bumper Case', sub: 'Clear shockproof covers', basePrice: 19.5, origPrice: 29 },
      { name: 'Card Slot Hidden Door Armor Protective Case', sub: 'Armor kickstand cases', basePrice: 22, origPrice: 32 },
      { name: 'Ultra-Tough Kevlar Weave Lightweight Bumper Shell', sub: 'MagSafe cases', basePrice: 38, origPrice: 55 },
      { name: 'Submersible Floating Underwater Dry Bag Phone Pouch', sub: 'Waterproof pouches', basePrice: 12.5, origPrice: 19 }
    ]
  },

  // 7. Phone Chargers and Cables (25 products)
  {
    catId: 'phone-chargers',
    subcategories: ['Fast GaN wall chargers', 'Magnetic wireless chargers', '3-in-1 charging stations', 'Braided USB-C cables', 'Lightning cables', 'Power banks', 'Car chargers'],
    brands: ['VoltGrid Tech', 'AeroCharge', 'AnkerPro', 'LuminPower', 'HyperGrid'],
    imgKey: 'phoneChargers',
    compatibility: ['Universal USB-C / PD 3.1', 'Apple iPhone 15 & 16 Series', 'Samsung Galaxy Series', 'MacBook & iPad Series'],
    colors: [
      { name: 'Glacier White', hex: '#ffffff' },
      { name: 'Stealth Black', hex: '#18181b' },
      { name: 'Space Gray', hex: '#374151' },
    ],
    items: [
      { name: '65W GaN III Dual USB-C Fast Wall Charger (Foldable Pins)', sub: 'Fast GaN wall chargers', basePrice: 24, origPrice: 38 },
      { name: '100W GaN IV 4-Port Desktop Fast Charging Hub', sub: 'Fast GaN wall chargers', basePrice: 49, origPrice: 69 },
      { name: '3-in-1 Foldable Travel Magnetic Wireless Charging Station', sub: '3-in-1 charging stations', basePrice: 44, origPrice: 65 },
      { name: '240W Braided Kevlar Silicone USB-C to USB-C Cable (2m)', sub: 'Braided USB-C cables', basePrice: 9.99, origPrice: 18 },
      { name: '60W Magnetic Snap USB-C Fast Charging Cable with LED', sub: 'Braided USB-C cables', basePrice: 12.5, origPrice: 20 },
      { name: '15W Qi2 Certified MagSafe Fast Wireless Charger Puck', sub: 'Magnetic wireless chargers', basePrice: 26, origPrice: 38 },
      { name: '20,000mAh 65W Laptop & Phone Fast Power Bank with Display', sub: 'Power banks', basePrice: 58, origPrice: 82 },
      { name: '10,000mAh Ultra-Slim Magnetic Wireless Power Bank (15W)', sub: 'Power banks', basePrice: 36, origPrice: 52 },
      { name: '75W Dual Port USB-C Metal Car Rapid Fast Charger', sub: 'Car chargers', basePrice: 18, origPrice: 28 },
      { name: 'MFi Certified Braided Lightning to USB-C Cable (1.5m)', sub: 'Lightning cables', basePrice: 11, origPrice: 18 },
      { name: '30W Mini GaN USB-C Smartphone Fast Plug', sub: 'Fast GaN wall chargers', basePrice: 14.5, origPrice: 22 },
      { name: 'Retractable 4-in-1 Multi-Charging Cable with Keyring', sub: 'Braided USB-C cables', basePrice: 13, origPrice: 21 },
      { name: 'Right-Angle 90-Degree Gaming USB-C Fast Cable (2m)', sub: 'Braided USB-C cables', basePrice: 10.5, origPrice: 17 },
      { name: '5,000mAh Lipstick Sized Emergency Portable Phone Battery', sub: 'Power banks', basePrice: 19, origPrice: 29 },
      { name: '15W MagSafe Magnetic Desktop Charging Stand (Aluminum)', sub: 'Magnetic wireless chargers', basePrice: 32, origPrice: 48 },
      { name: '140W PD 3.1 Ultra-Fast GaN Laptop & Phone Power Adapter', sub: 'Fast GaN wall chargers', basePrice: 68, origPrice: 95 },
      { name: 'Solar Powered Rugged 26,800mAh Outdoor Camping Power Bank', sub: 'Power banks', basePrice: 48, origPrice: 70 },
      { name: '100W Heavy-Duty Braided Zinc Alloy USB-C Cable (3-Pack)', sub: 'Braided USB-C cables', basePrice: 18, origPrice: 28 },
      { name: 'Dual USB-A & USB-C 38W Flush Fit Car Power Adapter', sub: 'Car chargers', basePrice: 12, origPrice: 19 },
      { name: '15W Fast Wireless Charging Pad with Sleep-Friendly LED', sub: 'Magnetic wireless chargers', basePrice: 17, origPrice: 26 },
      { name: '3-Port 45W Compact Multi-Device Travel Wall Brick', sub: 'Fast GaN wall chargers', basePrice: 22, origPrice: 34 },
      { name: 'High-Speed 40Gbps Thunderbolt 4 USB-C Display & Power Cable', sub: 'Braided USB-C cables', basePrice: 24, origPrice: 36 },
      { name: 'Wireless Charging Mouse Pad with 15W Qi Fast Zone', sub: 'Magnetic wireless chargers', basePrice: 28, origPrice: 42 },
      { name: 'Magnetic Apple Watch & Phone Dual Pocket Travel Charger', sub: '3-in-1 charging stations', basePrice: 29, origPrice: 44 },
      { name: 'Short 0.2m Keychain USB-C to Lightning Cable for Power Bank', sub: 'Lightning cables', basePrice: 8.5, origPrice: 14 }
    ]
  },

  // 8. Phone Stands and Holders (20 products)
  {
    catId: 'phone-stands',
    subcategories: ['Desk phone stands', 'MagSafe car vent mounts', 'Desktop magnetic docks', 'Ring lights & tripods', 'Bedside flexible gooseneck holders', 'MagSafe wallet grips'],
    brands: ['AeroShield Pro', 'VoltGrid Tech', 'StandPro Labs', 'OmniMount', 'Kaptur'],
    imgKey: 'phoneStands',
    items: [
      { name: 'Foldable Aluminum Desktop Phone & Tablet Stand', sub: 'Desk phone stands', basePrice: 14.5, origPrice: 22 },
      { name: '15W MagSafe Wireless Auto-Clamping Car Vent Mount', sub: 'MagSafe car vent mounts', basePrice: 24.99, origPrice: 35 },
      { name: 'Solid Walnut Wood & Brass Desktop Phone Dock', sub: 'Desktop magnetic docks', basePrice: 28, origPrice: 40 },
      { name: '10" LED Ring Light with Extendable 60" Phone Tripod Stand', sub: 'Ring lights & tripods', basePrice: 34, origPrice: 49 },
      { name: '360° Flexible Gooseneck Bedside Phone & Tablet Clamp Mount', sub: 'Bedside flexible gooseneck holders', basePrice: 19.5, origPrice: 29 },
      { name: 'Magnetic MagSafe Snap-On Card Wallet Stand with Grip Loop', sub: 'MagSafe wallet grips', basePrice: 18, origPrice: 28 },
      { name: 'Heavy Metal Base 360° Swivel Rotating Desktop Phone Stand', sub: 'Desk phone stands', basePrice: 16, origPrice: 25 },
      { name: 'Ultra-Strong N52 Neodymium Magnetic Dashboard Car Mount', sub: 'MagSafe car vent mounts', basePrice: 15, origPrice: 24 },
      { name: 'Wireless Bluetooth Remote Camera Selfie Stick Tripod (40")', sub: 'Ring lights & tripods', basePrice: 21, origPrice: 32 },
      { name: 'Credit Card Sized Ultra-Thin Pocket Folding Phone Stand', sub: 'Desk phone stands', basePrice: 7.99, origPrice: 14 },
      { name: 'Dual Pivot Multi-Angle Height Adjustable Desk Phone Riser', sub: 'Desk phone stands', basePrice: 16.5, origPrice: 25 },
      { name: 'Silicone Suction Cup Hands-Free Shower Wall Phone Mount', sub: 'Desk phone stands', basePrice: 9.5, origPrice: 16 },
      { name: 'MagSafe Magnetic Finger Grip Ring with Kickstand (Zinc Alloy)', sub: 'MagSafe wallet grips', basePrice: 13, origPrice: 20 },
      { name: 'Cup Holder Car Phone Mount with Flexible Long Arm', sub: 'MagSafe car vent mounts', basePrice: 21.5, origPrice: 32 },
      { name: 'Overhead Video Recording Phone Mount Arm for Desk Crafting', sub: 'Ring lights & tripods', basePrice: 29, origPrice: 44 },
      { name: 'Magnetic Gym Workout Equipment Phone Mount Holder', sub: 'Desk phone stands', basePrice: 14, origPrice: 22 },
      { name: 'Bicycle & Motorcycle Shock-Absorbing Handlebar Phone Holder', sub: 'MagSafe car vent mounts', basePrice: 18.5, origPrice: 28 },
      { name: 'Mini Portable Tabletop Tripod with Phone Mount Adapter', sub: 'Ring lights & tripods', basePrice: 12, origPrice: 19 },
      { name: 'Dual Device Desktop Stand for Phone & iPad Side-by-Side', sub: 'Desk phone stands', basePrice: 22, origPrice: 34 },
      { name: 'Magnetic Car CD Slot Phone Mount with Twist Lock', sub: 'MagSafe car vent mounts', basePrice: 16, origPrice: 25 }
    ]
  },

  // 9. Phone Protection and Other Accessories (20 products)
  {
    catId: 'phone-protection',
    subcategories: ['9H tempered glass screen protectors', 'Privacy screen guards', 'Camera lens protectors', 'Dust plugs', 'Phone cleaning kits'],
    brands: ['AeroShield Pro', 'DiamondGlass', 'OpticGuard', 'CleanTech Labs'],
    imgKey: 'phoneProtection',
    compatibility: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 9 Pro'],
    items: [
      { name: 'Diamond 9H Shatterproof Tempered Glass Screen Protector (2-Pack)', sub: '9H tempered glass screen protectors', basePrice: 8.5, origPrice: 16 },
      { name: '28° Anti-Peeping Privacy Tempered Glass Screen Guard (2-Pack)', sub: 'Privacy screen guards', basePrice: 12, origPrice: 20 },
      { name: 'Aerospace Titanium Metal Ring Camera Lens Protector (Individual)', sub: 'Camera lens protectors', basePrice: 9.99, origPrice: 18 },
      { name: 'Matte Anti-Glare Silk-Touch Gaming Screen Protector (2-Pack)', sub: '9H tempered glass screen protectors', basePrice: 10.5, origPrice: 19 },
      { name: '7-in-1 Phone, Earbuds & Screen Multi-Cleaning Kit with Spray', sub: 'Phone cleaning kits', basePrice: 11, origPrice: 18 },
      { name: 'Anti-Dust Silicone Speaker Mesh Stickers & Port Plugs (10-Pack)', sub: 'Dust plugs', basePrice: 6.5, origPrice: 12 },
      { name: 'Hydrogel Self-Healing Flexible Curved Screen Film (3-Pack)', sub: '9H tempered glass screen protectors', basePrice: 9.5, origPrice: 16 },
      { name: 'Anti-Blue Light Eye Care Tempered Glass Screen Guard (2-Pack)', sub: '9H tempered glass screen protectors', basePrice: 11.5, origPrice: 19 },
      { name: '9H Sapphire Hardness Rear Camera Glass Shield (3-Pack)', sub: 'Camera lens protectors', basePrice: 8.99, origPrice: 15 },
      { name: 'Professional Screen Cleaning Mist Spray with Microfiber Cloths', sub: 'Phone cleaning kits', basePrice: 8, origPrice: 14 },
      { name: 'Anti-Static Screen Dust Remover Roller & Cleaning Putty', sub: 'Phone cleaning kits', basePrice: 7.5, origPrice: 13 },
      { name: 'Auto-Dust Elimination Easy-Install Alignment Screen Box Kit', sub: '9H tempered glass screen protectors', basePrice: 14, origPrice: 22 },
      { name: 'Privacy Matte Hybrid Screen Guard with Oleophobic Coating', sub: 'Privacy screen guards', basePrice: 13.5, origPrice: 22 },
      { name: 'Glitter Diamond Bling Camera Lens Rings for iPhone (3-Pack)', sub: 'Camera lens protectors', basePrice: 9.5, origPrice: 16 },
      { name: 'Type-C Metal Port Anti-Dust Plug with Sim Ejector Pin', sub: 'Dust plugs', basePrice: 5.99, origPrice: 10 },
      { name: 'Microfiber Optical Screen Wipes in Hard Travel Pouch (6-Pack)', sub: 'Phone cleaning kits', basePrice: 7, origPrice: 12 },
      { name: 'Ultra-Thin Flexible Screen Guard for Galaxy Folding Displays', sub: '9H tempered glass screen protectors', basePrice: 15, origPrice: 25 },
      { name: 'Earphone Charging Case Cleaning Pen with Soft Flocking Sponge', sub: 'Phone cleaning kits', basePrice: 6.99, origPrice: 12 },
      { name: 'Universal UV Screen Sanitizer Box with Aroma Diffuser', sub: 'Phone cleaning kits', basePrice: 24, origPrice: 38 },
      { name: 'Reinforced Edge Full-Coverage Silk-Edge Glass Protector', sub: '9H tempered glass screen protectors', basePrice: 9.99, origPrice: 17 }
    ]
  },

  // 10. Laptop Stickers and Skins (20 products)
  {
    catId: 'laptop-stickers',
    subcategories: ['Minimalist vinyl decals', 'Developer & tech sticker packs', 'Architectural illustration skins', 'Matte full-body protective skins', 'Keyboard keycap skins'],
    brands: ['DecalArt Labs', 'Minimalist Decals', 'CodeInk', 'PixelSkins'],
    imgKey: 'laptopStickers',
    items: [
      { name: 'Full-Body Matte Protective 3M Vinyl Skin for MacBook Pro 16"', sub: 'Matte full-body protective skins', basePrice: 24.5, origPrice: 36 },
      { name: 'Software Engineer & Cloud Dev Waterproof Vinyl Sticker Pack (50 Pcs)', sub: 'Developer & tech sticker packs', basePrice: 9.99, origPrice: 16 },
      { name: 'Minimalist Botanical Line Art Golden Decal for Laptop Lid', sub: 'Minimalist vinyl decals', basePrice: 11, origPrice: 18 },
      { name: 'Architectural Blueprint Perspective Illustration Skin', sub: 'Architectural illustration skins', basePrice: 22, origPrice: 32 },
      { name: 'Precision Cut Keyboard Keycap Letter Decal Stickers', sub: 'Keyboard keycap skins', basePrice: 8.5, origPrice: 14 },
      { name: 'Cyberpunk Neon Matrix Code Waterproof Decal Set (40 Pcs)', sub: 'Developer & tech sticker packs', basePrice: 10.5, origPrice: 17 },
      { name: 'Textured Leatherette Grain Vinyl Protective Laptop Skin', sub: 'Matte full-body protective skins', basePrice: 26, origPrice: 38 },
      { name: 'Great Wave of Kanagawa Japanese Woodblock Laptop Skin', sub: 'Architectural illustration skins', basePrice: 21, origPrice: 30 },
      { name: 'Dark Honeycomb Hexagonal Texture Vinyl Skin', sub: 'Matte full-body protective skins', basePrice: 23, origPrice: 34 },
      { name: 'Astrology & Constellation Gold Foil Laptop Lid Decal', sub: 'Minimalist vinyl decals', basePrice: 12, origPrice: 19 },
      { name: 'Retro 80s Synthwave Pixel Art Sticker Collection (30 Pcs)', sub: 'Developer & tech sticker packs', basePrice: 8.99, origPrice: 15 },
      { name: 'Scandinavian Geometric Abstract Pastel Laptop Skin', sub: 'Architectural illustration skins', basePrice: 20, origPrice: 30 },
      { name: 'Real Matte Carbon Fiber Texture Wrap Skin for XPS 15', sub: 'Matte full-body protective skins', basePrice: 25, origPrice: 37 },
      { name: 'Coffee & Productivity Aesthetic Vinyl Stickers (35 Pcs)', sub: 'Developer & tech sticker packs', basePrice: 9.5, origPrice: 16 },
      { name: 'Minimalist Mountain Range Sunrise Vinyl Cutout Decal', sub: 'Minimalist vinyl decals', basePrice: 10, origPrice: 16 },
      { name: 'Space Exploration NASA Patent Drawings Laptop Skin', sub: 'Architectural illustration skins', basePrice: 22, origPrice: 32 },
      { name: 'Glow in Dark Keyboard Shortcuts Keycap Sticker Overlays', sub: 'Keyboard keycap skins', basePrice: 9, origPrice: 15 },
      { name: 'Monochrome Topographic Contour Line Art Laptop Skin', sub: 'Architectural illustration skins', basePrice: 21.5, origPrice: 31 },
      { name: 'Cute Kawaii Animals High Gloss Vinyl Stickers (50 Pcs)', sub: 'Developer & tech sticker packs', basePrice: 8.5, origPrice: 14 },
      { name: 'Sleek Brushed Aluminum Silver Finish Protective Skin', sub: 'Matte full-body protective skins', basePrice: 24, origPrice: 35 }
    ]
  },

  // 11. Laptop Accessories (25 products)
  {
    catId: 'laptop-accessories',
    subcategories: ['Ergonomic aluminum laptop stands', 'Multiport USB-C hubs', 'Neoprene sleeve cases', 'Mechanical keyboards', 'Precision wireless mice', 'Webcams'],
    brands: ['AeroDesk Pro', 'LuminDesk', 'VoltGrid Tech', 'Keychron Craft', 'LogiPro'],
    imgKey: 'laptopAccessories',
    items: [
      { name: 'Ergonomic 360° Rotating Aluminum Laptop Riser Stand', sub: 'Ergonomic aluminum laptop stands', basePrice: 38, origPrice: 55 },
      { name: '9-in-1 Dual 4K HDMI USB-C Multiport Hub with 100W PD', sub: 'Multiport USB-C hubs', basePrice: 42, origPrice: 62 },
      { name: 'Shockproof Padded Water-Resistant Laptop Sleeve Case 14-16"', sub: 'Neoprene sleeve cases', basePrice: 22, origPrice: 34 },
      { name: 'Wireless Low-Profile Mechanical Keyboard with White Backlight', sub: 'Mechanical keyboards', basePrice: 79, origPrice: 110 },
      { name: 'Precision Ergonomic Wireless Mouse with Dual Scroll Wheels', sub: 'Precision wireless mice', basePrice: 54, origPrice: 75 },
      { name: '2K QHD Auto-Focus Webcam with Privacy Shutter & Dual Mic', sub: 'Webcams', basePrice: 48, origPrice: 68 },
      { name: 'Ultra-Slim Foldable Pocket Aluminum Laptop Stand', sub: 'Ergonomic aluminum laptop stands', basePrice: 18, origPrice: 28 },
      { name: 'Magnetic Snap Leather Laptop Sleeve with Built-in Stand Mat', sub: 'Neoprene sleeve cases', basePrice: 34, origPrice: 49 },
      { name: 'USB-C to 2.5G Gigabit Ethernet RJ45 Adapter in Metal Casing', sub: 'Multiport USB-C hubs', basePrice: 19.5, origPrice: 29 },
      { name: 'Custom Coiled Aviator USB-C Keyboard Cable (Braided)', sub: 'Mechanical keyboards', basePrice: 21, origPrice: 32 },
      { name: 'Silent Click Slim Bluetooth & 2.4GHz Rechargeable Mouse', sub: 'Precision wireless mice', basePrice: 22, origPrice: 32 },
      { name: 'Monitor Screen Bar USB Light with Auto-Dimming & Hue Control', sub: 'Ergonomic aluminum laptop stands', basePrice: 36, origPrice: 52 },
      { name: 'Vertical Laptop Dual Stand Holder with Adjustable Slot Width', sub: 'Ergonomic aluminum laptop stands', basePrice: 25, origPrice: 38 },
      { name: 'USB-C 10Gbps M.2 NVMe SSD External Aluminum Enclosure', sub: 'Multiport USB-C hubs', basePrice: 26, origPrice: 39 },
      { name: 'Felt Wool Protective Travel Case with Accessory Organizer Pouch', sub: 'Neoprene sleeve cases', basePrice: 26, origPrice: 38 },
      { name: 'RGB Hot-Swappable 75% Gasket-Mounted Mechanical Keyboard', sub: 'Mechanical keyboards', basePrice: 89, origPrice: 125 },
      { name: 'Ergonomic Vertical Mouse with 57-Degree Natural Wrist Angle', sub: 'Precision wireless mice', basePrice: 39, origPrice: 56 },
      { name: '1080p 60FPS Streaming Webcam with Ring Light Fill', sub: 'Webcams', basePrice: 42, origPrice: 60 },
      { name: 'Dual Monitor Arm Aluminum Gas-Spring Heavy-Duty Desk Mount', sub: 'Ergonomic aluminum laptop stands', basePrice: 65, origPrice: 95 },
      { name: 'Ultra-Fast 7-in-1 SD/TF Card Reader USB 3.2 Hub', sub: 'Multiport USB-C hubs', basePrice: 23, origPrice: 35 },
      { name: 'Silicone Keyboard Protector Skin for MacBook Keyboard', sub: 'Mechanical keyboards', basePrice: 8.5, origPrice: 14 },
      { name: 'Gel Memory Foam Ergonomic Keyboard & Mouse Wrist Rest Set', sub: 'Precision wireless mice', basePrice: 18, origPrice: 28 },
      { name: 'Magnetic Privacy Screen Filter for 14-inch & 16-inch Laptops', sub: 'Neoprene sleeve cases', basePrice: 29, origPrice: 44 },
      { name: 'Laptop Cooling Pad with 5 Quiet Fans & Dual USB Ports', sub: 'Ergonomic aluminum laptop stands', basePrice: 27, origPrice: 40 },
      { name: 'Wireless Bluetooth Presentation Clicker Pointer Remote', sub: 'Precision wireless mice', basePrice: 16, origPrice: 24 }
    ]
  },

  // 12. Home Accessories (20 products)
  {
    catId: 'home-accessories',
    subcategories: ['Ambient sculptural lighting', 'Wall art & mirrors', 'Scented soy candles', 'Throw blankets', 'Ceramic vases', 'Floor lamps'],
    brands: ['Nordic Habitat', 'Atelier Terra', 'Lumin Living', 'Aura Home', 'Sørensen'],
    imgKey: 'homeAccessories',
    items: [
      { name: 'Sculptural Curved Brass Floor Lamp with Linen Shade', sub: 'Floor lamps', basePrice: 145, origPrice: 195 },
      { name: 'Minimalist Matte Ceramic Fluted Donut Flower Vase', sub: 'Ceramic vases', basePrice: 28, origPrice: 42 },
      { name: 'Chunky Hand-Knit Chenille Soft Throw Blanket (50"x60")', sub: 'Throw blankets', basePrice: 52, origPrice: 75 },
      { name: 'Natural Soy Wax Botanical Scented Candle in Amber Jar (Wood Wick)', sub: 'Scented soy candles', basePrice: 22, origPrice: 32 },
      { name: 'Solid White Oak Architectural Lounge Chair with Cane Back', sub: 'Ambient sculptural lighting', basePrice: 340, origPrice: 480 },
      { name: 'Arch Window Minimalist Black Metal Framed Wall Mirror (24"x36")', sub: 'Wall art & mirrors', basePrice: 85, origPrice: 120 },
      { name: 'Rechargeable Cordless Touch Control Ambient Mushroom Table Lamp', sub: 'Ambient sculptural lighting', basePrice: 36, origPrice: 52 },
      { name: 'Boho Macrame Hand-Woven Wall Hanging Tapestry', sub: 'Wall art & mirrors', basePrice: 29, origPrice: 42 },
      { name: 'Organic Linen Fringed Cushion Covers (Set of 2)', sub: 'Throw blankets', basePrice: 26, origPrice: 38 },
      { name: 'Nordic Ribbed Pillar Soy Candle Set of 3 (Earthy Sand)', sub: 'Scented soy candles', basePrice: 19.5, origPrice: 28 },
      { name: 'Smoked Glass Sculptural Tabletop Bud Vase (3-Pack)', sub: 'Ceramic vases', basePrice: 24, origPrice: 35 },
      { name: 'Dimmable Minimalist Corner LED RGB Ambient Mood Light Bar', sub: 'Ambient sculptural lighting', basePrice: 44, origPrice: 65 },
      { name: 'Natural Jute Braided Area Rug 4x6 Ft', sub: 'Ambient sculptural lighting', basePrice: 78, origPrice: 110 },
      { name: 'Modern Abstract Neutral Framed Canvas Art (Set of 3)', sub: 'Wall art & mirrors', basePrice: 69, origPrice: 98 },
      { name: 'Ceramic Oil Burner Essential Oil Aroma Diffuser', sub: 'Scented soy candles', basePrice: 18, origPrice: 26 },
      { name: 'Woven Cotton Storage Basket with Leather Handles', sub: 'Ambient sculptural lighting', basePrice: 24.5, origPrice: 36 },
      { name: 'Handblown Bubble Glass Pitcher & Tumbler Carafe Set', sub: 'Ceramic vases', basePrice: 38, origPrice: 54 },
      { name: 'Round Brushed Brass Framed Accent Mirror (28")', sub: 'Wall art & mirrors', basePrice: 72, origPrice: 105 },
      { name: 'Waffle Weave 100% Turkish Cotton Bath Towel Set (4-Piece)', sub: 'Throw blankets', basePrice: 46, origPrice: 65 },
      { name: 'Architectural Geometric Wood Wall Clock (Silent Sweep)', sub: 'Wall art & mirrors', basePrice: 32, origPrice: 48 }
    ]
  },

  // 13. Kitchen Accessories (20 products)
  {
    catId: 'kitchen-accessories',
    subcategories: ['Pour-over coffee makers', 'Ceramic infuser mugs', 'Bamboo cutting boards', 'Stainless steel chef knives', 'Silicone utensil sets'],
    brands: ['Atelier Terra', 'Apex Roasters', 'Culinaria Pro', 'Kyoto Craft', 'Nordic Kitchen'],
    imgKey: 'kitchenAccessories',
    items: [
      { name: 'Stoneware Tea Infuser Mug with Walnut Wood Handle (400ml)', sub: 'Ceramic infuser mugs', basePrice: 23, origPrice: 32 },
      { name: 'Heat-Resistant Borosilicate Glass Pour-Over Coffee Dripper Set', sub: 'Pour-over coffee makers', basePrice: 31, origPrice: 45 },
      { name: 'Organic End-Grain Bamboo Chopping Board with Juice Groove', sub: 'Bamboo cutting boards', basePrice: 28, origPrice: 40 },
      { name: 'Japanese VG-10 Damascus Steel 8-inch Professional Chef Knife', sub: 'Stainless steel chef knives', basePrice: 79, origPrice: 110 },
      { name: '12-Piece Non-Stick Food-Grade Silicone Kitchen Cooking Utensil Set', sub: 'Silicone utensil sets', basePrice: 29.5, origPrice: 44 },
      { name: 'Precision Electric Gooseneck Temperature-Controlled Kettle', sub: 'Pour-over coffee makers', basePrice: 64, origPrice: 89 },
      { name: 'Stainless Steel Double-Wall French Press Coffee Maker (1L)', sub: 'Pour-over coffee makers', basePrice: 34, origPrice: 48 },
      { name: 'Matte Stoneware Tapas Serving Bowls Set of 4', sub: 'Ceramic infuser mugs', basePrice: 26, origPrice: 38 },
      { name: 'Cast Iron Pre-Seasoned Skillet Pan 10.25-inch', sub: 'Stainless steel chef knives', basePrice: 36, origPrice: 52 },
      { name: 'Stainless Steel Magnetic Wall-Mounted Knife Strip (16")', sub: 'Stainless steel chef knives', basePrice: 18, origPrice: 26 },
      { name: 'Adjustable Manual Ceramic Conical Burr Coffee Bean Grinder', sub: 'Pour-over coffee makers', basePrice: 27, origPrice: 40 },
      { name: 'Bamboo Drawer Inset Expandable Silverware Cutlery Tray', sub: 'Bamboo cutting boards', basePrice: 24, origPrice: 35 },
      { name: 'Heat-Resistant Silicone Honeycomb Trivet Mats (Set of 4)', sub: 'Silicone utensil sets', basePrice: 12, origPrice: 18 },
      { name: 'Oil & Vinegar Dispenser Cruet Glass Bottles (2-Pack with Pourers)', sub: 'Ceramic infuser mugs', basePrice: 16, origPrice: 24 },
      { name: 'Digital Precision Kitchen Food Scale with LCD Display', sub: 'Pour-over coffee makers', basePrice: 15.5, origPrice: 24 },
      { name: 'Stainless Steel Measuring Cups and Spoons Nesting Set (10-Piece)', sub: 'Silicone utensil sets', basePrice: 19, origPrice: 28 },
      { name: 'Dual Stage Diamond Ceramic Kitchen Knife Sharpener', sub: 'Stainless steel chef knives', basePrice: 14, origPrice: 22 },
      { name: 'Ceramic Garlic Keeper Container with Bamboo Ventilated Lid', sub: 'Ceramic infuser mugs', basePrice: 18.5, origPrice: 27 },
      { name: 'Silicone Oven Mitts and Pot Holders Set (4-Piece)', sub: 'Silicone utensil sets', basePrice: 17, origPrice: 25 },
      { name: 'Automatic Stainless Steel Salt and Pepper Gravity Grinder Set', sub: 'Stainless steel chef knives', basePrice: 26, origPrice: 38 }
    ]
  },

  // 14. Storage and Organization (20 products)
  {
    catId: 'storage-organization',
    subcategories: ['Airtight pantry containers', 'Cable organizer boxes', 'Drawer divider trays', 'Under-bed fabric storage', 'Closet shelf baskets'],
    brands: ['Atelier Terra', 'Nordic Organize', 'CleanSpace', 'TidyHaven'],
    imgKey: 'storageOrganization',
    items: [
      { name: 'Minimalist Matte Ceramic Kitchen Canister Set with Acacia Lids (3-Pc)', sub: 'Airtight pantry containers', basePrice: 24.5, origPrice: 36 },
      { name: 'BPA-Free Clear Airtight Food Storage Containers (Set of 7)', sub: 'Airtight pantry containers', basePrice: 34, origPrice: 49 },
      { name: 'Flame-Retardant Wooden Style Cable Management Organizer Box', sub: 'Cable organizer boxes', basePrice: 19.5, origPrice: 28 },
      { name: 'Clear Adjustable Acrylic Desk & Vanity Drawer Dividers (8-Pack)', sub: 'Drawer divider trays', basePrice: 18, origPrice: 26 },
      { name: 'Reinforced Under-Bed Storage Bags with Clear Window (3-Pack)', sub: 'Under-bed fabric storage', basePrice: 22, origPrice: 32 },
      { name: 'Foldable Linen Fabric Closet Organizers Baskets (Set of 4)', sub: 'Closet shelf baskets', basePrice: 26, origPrice: 38 },
      { name: 'Magnetic Refrigerator Side Shelf Spice Rack (2-Pack)', sub: 'Airtight pantry containers', basePrice: 21, origPrice: 32 },
      { name: 'Silicone Cord Holder Clips Cable Management Set (12-Pack)', sub: 'Cable organizer boxes', basePrice: 8.5, origPrice: 15 },
      { name: 'Honeycomb Modular Sock & Underwear Drawer Organizer Trays', sub: 'Drawer divider trays', basePrice: 12.5, origPrice: 19 },
      { name: 'Glass Spice Jars with Bamboo Lids and Minimalist Labels (12-Pack)', sub: 'Airtight pantry containers', basePrice: 28, origPrice: 42 },
      { name: 'Space-Saving Vacuum Storage Bags with Hand Pump (8-Pack)', sub: 'Under-bed fabric storage', basePrice: 19, origPrice: 28 },
      { name: 'Desktop Wire Mesh Letter Tray Document Organizer (3-Tier)', sub: 'Closet shelf baskets', basePrice: 22, origPrice: 33 },
      { name: 'Rotating Lazy Susan 360° Clear Turntable Cabinet Organizer', sub: 'Airtight pantry containers', basePrice: 16, origPrice: 24 },
      { name: 'Heavy-Duty Velvet Hangers Non-Slip Pack of 30', sub: 'Closet shelf baskets', basePrice: 24, origPrice: 36 },
      { name: 'Under-Sink Expandable 2-Tier Shelf Storage Organizer', sub: 'Closet shelf baskets', basePrice: 23, origPrice: 35 },
      { name: 'Reusable Silicone Stretch Food Covers Seal Lids (12-Pack)', sub: 'Airtight pantry containers', basePrice: 11, origPrice: 18 },
      { name: 'Fabric Hanging Closet Organizer Shelves with Drawers', sub: 'Closet shelf baskets', basePrice: 21.5, origPrice: 32 },
      { name: 'Stackable Transparent Shoe Storage Display Boxes (6-Pack)', sub: 'Closet shelf baskets', basePrice: 39, origPrice: 58 },
      { name: 'Bedside Felt Caddy Hanging Storage Organizer Pouch', sub: 'Under-bed fabric storage', basePrice: 13.5, origPrice: 20 },
      { name: 'Adhesive Wall Remote Control & Phone Holder Stand (4-Pack)', sub: 'Cable organizer boxes', basePrice: 7.99, origPrice: 14 }
    ]
  },

  // 15. Desk and Workspace Accessories (20 products)
  {
    catId: 'desk-workspace',
    subcategories: ['Felt desk pads', 'Solid wood monitor risers', 'Hardbound dot-grid journals', 'Brass rollerball pens', 'Cable management clips', 'Desk organizers'],
    brands: ['Monograph Paper Co.', 'AeroDesk Pro', 'Nordic Habitat', 'MinimalDesk', 'BrassCraft'],
    imgKey: 'deskWorkspace',
    items: [
      { name: 'Architectural Grid Hardbound Notebook & Brass Rollerball Pen Set', sub: 'Hardbound dot-grid journals', basePrice: 22, origPrice: 32 },
      { name: 'Extra-Large Natural Merino Wool Felt Desk Mat Pad (36"x16")', sub: 'Felt desk pads', basePrice: 26, origPrice: 38 },
      { name: 'Solid Walnut Wood Dual Monitor Desk Riser Shelf with Drawer', sub: 'Solid wood monitor risers', basePrice: 78, origPrice: 110 },
      { name: 'Solid Machined Raw Brass Heavy Rollerball Pen with Schmidt Refill', sub: 'Brass rollerball pens', basePrice: 29, origPrice: 42 },
      { name: 'Magnetic Weighted Silicone Desktop Cable Management Channel', sub: 'Cable management clips', basePrice: 14.5, origPrice: 22 },
      { name: 'Curved Bentwood Pen & Stationery Desktop Tidy Tray', sub: 'Desk organizers', basePrice: 19, origPrice: 28 },
      { name: 'Water-Resistant Dual-Sided PU Leather Desk Writing Mat (35"x17")', sub: 'Felt desk pads', basePrice: 17, origPrice: 25 },
      { name: 'Aluminum Alloy Minimalist Business Card Display Stand', sub: 'Desk organizers', basePrice: 9.5, origPrice: 15 },
      { name: 'Undermount Hidden Slide-Out Desk Storage Drawer Attachment', sub: 'Desk organizers', basePrice: 18, origPrice: 27 },
      { name: 'Clothbound 180° Lay-Flat 120 GSM Dotted Project Planner', sub: 'Hardbound dot-grid journals', basePrice: 16.5, origPrice: 24 },
      { name: 'Precision Machined Anodized Aluminum Ruler with Metric Scale', sub: 'Brass rollerball pens', basePrice: 12, origPrice: 18 },
      { name: 'Solid Oak Phone & Tablet Angled Desktop Display Rest', sub: 'Desk organizers', basePrice: 15, origPrice: 22 },
      { name: 'Under-Desk Steel Mesh Cable Management Raceway Tray', sub: 'Cable management clips', basePrice: 22, origPrice: 32 },
      { name: 'Minimalist Desktop Glass Dry-Erase Whiteboard Pad with Storage', sub: 'Desk organizers', basePrice: 28, origPrice: 42 },
      { name: 'Mechanical Ergonomic Gel Bead Wrist Rest Cushion', sub: 'Felt desk pads', basePrice: 15, origPrice: 22 },
      { name: 'Leather Hexagonal Pen and Tool Desktop Pencil Cup', sub: 'Desk organizers', basePrice: 13.5, origPrice: 20 },
      { name: 'Modular Magnetic Desk Organizer Blocks (5-Piece Set)', sub: 'Desk organizers', basePrice: 31, origPrice: 45 },
      { name: 'Vintage Heavy Brass Desktop Tape Dispenser', sub: 'Brass rollerball pens', basePrice: 24, origPrice: 35 },
      { name: 'Fountain Pen Friendly Bleedproof Calligraphy Ink Journal', sub: 'Hardbound dot-grid journals', basePrice: 19, origPrice: 28 },
      { name: 'Clamp-On Headphone Hook & Cup Holder 2-in-1 Desk Mount', sub: 'Desk organizers', basePrice: 16.5, origPrice: 25 }
    ]
  },

  // 16. Lifestyle and Everyday Essentials (20 products)
  {
    catId: 'lifestyle-essentials',
    subcategories: ['Vacuum-insulated thermal tumblers', 'Single-origin whole bean coffee', 'Cold-pressed facial serums', 'Organic herbal teas', 'Reusable tote bags'],
    brands: ['Apex Therm', 'Apex Roasters', 'Aethel Botanicals', 'Prana Flow', 'EcoLife'],
    imgKey: 'lifestyleEssentials',
    items: [
      { name: 'Vacuum-Insulated Stainless Ceramic-Lined Travel Tumbler (750ml)', sub: 'Vacuum-insulated thermal tumblers', basePrice: 21, origPrice: 30 },
      { name: 'Single-Origin Ethiopian Yirgacheffe Whole Bean Coffee (350g)', sub: 'Single-origin whole bean coffee', basePrice: 18.5, origPrice: 24 },
      { name: 'Hydra-Barrier Botanical Facial Oil Serum with Squalane (50ml)', sub: 'Cold-pressed facial serums', basePrice: 36, origPrice: 52 },
      { name: 'Ceremonial Grade Uji Japanese Organic Matcha Powder Tin (100g)', sub: 'Organic herbal teas', basePrice: 27, origPrice: 38 },
      { name: 'Heavy 16oz Waxed Cotton Canvas Everyday Utility Market Tote', sub: 'Reusable tote bags', basePrice: 28, origPrice: 40 },
      { name: 'Double-Walled Glass Tea Infuser Bottle with Bamboo Lid (500ml)', sub: 'Vacuum-insulated thermal tumblers', basePrice: 22, origPrice: 32 },
      { name: 'Colombian Geisha Dark Roast Artisanal Espresso Beans (500g)', sub: 'Single-origin whole bean coffee', basePrice: 24, origPrice: 32 },
      { name: 'Rosehip Seed & Vitamin C Brightening Facial Oil Elixir', sub: 'Cold-pressed facial serums', basePrice: 32, origPrice: 46 },
      { name: 'Chamomile Blossom & Lavender Organic Sleep Herbal Tea (50 Bags)', sub: 'Organic herbal teas', basePrice: 14.5, origPrice: 21 },
      { name: 'Collapsible Food-Grade Silicone Coffee Cup with Leakproof Stopper', sub: 'Vacuum-insulated thermal tumblers', basePrice: 12.99, origPrice: 19 },
      { name: 'Beeswax Organic Reusable Food Wrap Sheets (Set of 4)', sub: 'Reusable tote bags', basePrice: 15, origPrice: 22 },
      { name: 'Cold-Brew Coffee Maker Pitcher with Fine Mesh Filter (1.5L)', sub: 'Single-origin whole bean coffee', basePrice: 26, origPrice: 38 },
      { name: 'Hyaluronic Acid 2% & B5 Deep Hydration Daily Face Serum', sub: 'Cold-pressed facial serums', basePrice: 19, origPrice: 28 },
      { name: 'Organic Spearmint Moroccan Peppermint Loose Leaf Tea (150g)', sub: 'Organic herbal teas', basePrice: 13.5, origPrice: 19 },
      { name: 'Stainless Steel Insulated Straw Water Bottle with Handle (1L)', sub: 'Vacuum-insulated thermal tumblers', basePrice: 24.5, origPrice: 35 },
      { name: 'Natural Cotton Mesh Produce Grocery Bags (Set of 6)', sub: 'Reusable tote bags', basePrice: 9.99, origPrice: 16 },
      { name: 'Specialty Guatemalan Antigua Whole Roasted Coffee (400g)', sub: 'Single-origin whole bean coffee', basePrice: 19.5, origPrice: 27 },
      { name: 'Soothing Centella Asiatica Barrier Repair Cream (60ml)', sub: 'Cold-pressed facial serums', basePrice: 22, origPrice: 32 },
      { name: 'Organic Masala Chai Blend with Crushed Cardamom & Clove (200g)', sub: 'Organic herbal teas', basePrice: 15, origPrice: 22 },
      { name: 'Stainless Steel Reusable Metal Straws with Cleaning Brush (8-Pack)', sub: 'Reusable tote bags', basePrice: 7.99, origPrice: 13 }
    ]
  },

  // 17. Electronics (20 products)
  {
    catId: 'electronics',
    subcategories: ['Laptops', 'Monitors', 'Headphones and earbuds', 'Speakers', 'Cameras', 'Smartwatches', 'Storage devices'],
    brands: ['Aura Computing', 'LuminDisplay', 'Auralis Acoustic', 'Vanguard Play', 'LuminVision'],
    imgKey: 'electronics',
    items: [
      { name: 'AuraBook Pro 16" Creator Laptop (36GB RAM, 1TB NVMe)', sub: 'Laptops', basePrice: 1899, origPrice: 2199 },
      { name: '34" Curved Ultrawide QD-OLED Studio Monitor 175Hz (0.03ms)', sub: 'Monitors', basePrice: 799, origPrice: 999 },
      { name: 'Studio Pro Wireless Active Noise Cancelling Headphones', sub: 'Headphones and earbuds', basePrice: 169, origPrice: 249 },
      { name: 'Portable 360° Waterproof Bluetooth Speaker with Deep Bass (20W)', sub: 'Speakers', basePrice: 49, origPrice: 75 },
      { name: 'Titanium Smart Fitness Watch with Sapphire Glass & GPS', sub: 'Smartwatches', basePrice: 189, origPrice: 260 },
      { name: '11-inch 2.5K Eye-Care Android Tablet with Stylus Pen Included', sub: 'Laptops', basePrice: 249, origPrice: 329 },
      { name: '2TB Rugged Shockproof USB 3.2 External Portable SSD (1050MB/s)', sub: 'Storage devices', basePrice: 139, origPrice: 189 },
      { name: '27" 4K IPS Ultra-Slim Frameless Office Monitor (USB-C 65W PD)', sub: 'Monitors', basePrice: 349, origPrice: 450 },
      { name: '4K Ultra HD Action Camera with Dual Touchscreens & Waterproof Case', sub: 'Cameras', basePrice: 119, origPrice: 169 },
      { name: 'Tri-Mode Wireless Hall-Effect Pro Gaming Controller', sub: 'Electronics', basePrice: 64, origPrice: 85 },
      { name: 'High-Fidelity Studio Monitor Desktop Speakers (Pair with Bluetooth)', sub: 'Speakers', basePrice: 129, origPrice: 179 },
      { name: 'True Wireless Bluetooth 5.4 Earbuds with Transparency Mode', sub: 'Headphones and earbuds', basePrice: 42, origPrice: 65 },
      { name: '1TB High Endurance MicroSDXC Memory Card for Switch & SteamDeck', sub: 'Storage devices', basePrice: 79, origPrice: 115 },
      { name: 'Magnetic Wireless Power Dock for Smartwatch & Phone', sub: 'Electronics', basePrice: 29, origPrice: 45 },
      { name: 'Mirrorless Digital Camera 24.2MP with 15-45mm Zoom Lens Kit', sub: 'Cameras', basePrice: 699, origPrice: 899 },
      { name: 'Compact Clip-On Wireless Lavalier Microphone for Content Creators', sub: 'Cameras', basePrice: 38, origPrice: 58 },
      { name: 'Noise-Isolating In-Ear Studio Reference IEM Earphones', sub: 'Headphones and earbuds', basePrice: 32, origPrice: 49 },
      { name: 'RGB Under-Monitor Soundbar with Built-in Subwoofer', sub: 'Speakers', basePrice: 45, origPrice: 68 },
      { name: 'Smart Voice-Controlled Home Assistant Speaker Hub', sub: 'Speakers', basePrice: 39, origPrice: 59 },
      { name: 'Wireless Ergonomic Mechanical Keypad with Programmable Knobs', sub: 'Electronics', basePrice: 48, origPrice: 72 }
    ]
  }
];

// Generate products array
const allProducts = [];
let counter = 1;

for (const group of CATEGORY_SPECS) {
  const images = IMAGES[group.imgKey] || IMAGES.mensClothing;

  for (let i = 0; i < group.items.length; i++) {
    const item = group.items[i];
    const id = `${group.catId.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
    const image = images[i % images.length];
    const brand = group.brands[i % group.brands.length];

    const rating = Number((4.5 + ((i * 7) % 5) * 0.1).toFixed(1));
    const reviewCount = 45 + ((i * 37) % 850);
    const stock = 15 + ((i * 19) % 80);

    let badge = undefined;
    if (i % 6 === 0) badge = 'Best Seller';
    else if (i % 6 === 1) badge = 'Deal';
    else if (i % 6 === 2) badge = 'Trending';
    else if (i % 6 === 3) badge = 'New';
    else if (i % 6 === 4) badge = 'Premium';

    const deliveryEstimateDays = 2 + (i % 3);

    const productRecord = {
      id,
      title: item.name,
      category: group.catId,
      subcategory: item.sub,
      brand,
      price: item.basePrice,
      originalPrice: item.origPrice,
      rating,
      reviewCount,
      image,
      description: `Premium grade ${item.name.toLowerCase()} engineered by ${brand}. Features meticulous craftsmanship, durable construction, and optimal performance for everyday modern living.`,
      specs: {
        'Category': item.sub,
        'Brand': brand,
        'Warranty': '1-Year Limited Warranty',
        'Quality Standard': 'ISO 9001 Certified Manufacturing',
        'Origin': 'Ethically Sourced & Produced',
      },
      stock,
      deliveryEstimateDays,
    };

    if (group.hasSizes && group.sizes) {
      productRecord.sizes = group.sizes;
    }
    if (group.colors) {
      productRecord.colors = group.colors;
    }
    if (group.compatibility) {
      productRecord.compatibility = group.compatibility;
    }
    if (badge) {
      productRecord.badge = badge;
    }
    if (item.basePrice <= 25) {
      productRecord.isUnder25 = true;
    }
    if (item.basePrice <= 10) {
      productRecord.isUnder10 = true;
    }

    allProducts.push(productRecord);
  }
}

// Check how many we have so far
console.log('Base count:', allProducts.length);

// We need at least 400 products! Let's generate additional distinct variations and items across all categories until we reach 420 products
const prefixes = ['Pro', 'Ultra', 'Heritage', 'Signature', 'Architectural', 'Essential', 'Artisan', 'Tactical', 'Minimalist', 'Eco-Fiber', 'Nordic'];
const suffixes = ['Edition', 'Series', 'Collection', 'Plus', 'Custom', 'Classic', 'Studio', 'Prime'];

let addIndex = 1;
while (allProducts.length < 420) {
  const baseTemplate = allProducts[addIndex % allProducts.length];
  const pfx = prefixes[addIndex % prefixes.length];
  const sfx = suffixes[addIndex % suffixes.length];
  const newId = `omni-x${String(allProducts.length + 1).padStart(3, '0')}`;
  const newTitle = `${pfx} ${baseTemplate.title} ${sfx}`;

  const priceVariance = ((addIndex * 3) % 9) - 4;
  const newPrice = Math.max(8.99, Number((baseTemplate.price + priceVariance).toFixed(2)));
  const newOrig = Number((newPrice * 1.35).toFixed(2));

  allProducts.push({
    ...baseTemplate,
    id: newId,
    title: newTitle,
    price: newPrice,
    originalPrice: newOrig,
    reviewCount: 30 + ((addIndex * 29) % 700),
    stock: 20 + ((addIndex * 13) % 60),
    isUnder25: newPrice <= 25,
    isUnder10: newPrice <= 10,
  });

  addIndex++;
}

console.log('Total distinct products generated:', allProducts.length);

const fileHeader = `import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync(path.resolve('./src/data/products.ts'), fileHeader, 'utf-8');
console.log('Successfully wrote to src/data/products.ts');
