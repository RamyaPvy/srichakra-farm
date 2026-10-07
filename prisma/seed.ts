import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

async function main() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: dbUrl }),
  });

  try {
    const initialAdminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (process.env.NODE_ENV === "production" && !initialAdminPassword) {
      throw new Error("ADMIN_INITIAL_PASSWORD must be configured before production seeding.");
    }

    const adminPassword = await bcrypt.hash(initialAdminPassword || "admin123", 10);

    await prisma.adminUser.upsert({
      where: { email: "admin@srichakrafarm.com" },
      update: {},
      create: {
        email: "admin@srichakrafarm.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    const productCount = await prisma.product.count();
    if (productCount > 0) {
      console.log("Seed data already exists; keeping existing products, orders, and stock.");
      return;
    }

    await prisma.product.createMany({
      data: [
        // ==================== FISH - TENDER SEEDS ====================
        {
          category: "FISH",
          fishTab: "TENDER_SEEDS",
          name_en: "Rohu Seeds - 3 Inch (5,000 pcs)",
          name_te: "రోహు విత్తనాలు - 3 అంగుళం (5,000 పిసిలు)",
          name_hi: "रोहू बीज - 3 इंच (5,000 पीसी)",
          unitLabel: "pack",
          price: 3500,
          stockQty: 50,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Rohu",
            sizeLabel: "3-inch",
            countPerPack: 5000,
            perFishPrice: 0.7,
          },
        },
        {
          category: "FISH",
          fishTab: "TENDER_SEEDS",
          name_en: "Catla Seeds - 5 Inch (10,000 pcs)",
          name_te: "కాటల విత్తనాలు - 5 అంగుళం (10,000 పిసిలు)",
          name_hi: "कैटला बीज - 5 इंच (10,000 पीसी)",
          unitLabel: "pack",
          price: 7000,
          stockQty: 30,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Catla",
            sizeLabel: "5-inch",
            countPerPack: 10000,
            perFishPrice: 0.7,
          },
        },
        {
          category: "FISH",
          fishTab: "TENDER_SEEDS",
          name_en: "Grass Carp Seeds - 3 Inch (8,000 pcs)",
          name_te: "గ్రాస్ కార్ప్ విత్తనాలు - 3 అంగుళం (8,000 పిసిలు)",
          name_hi: "ग्रास कार्प बीज - 3 इंच (8,000 पीसी)",
          unitLabel: "pack",
          price: 4800,
          stockQty: 25,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Grass Carp",
            sizeLabel: "3-inch",
            countPerPack: 8000,
            perFishPrice: 0.6,
          },
        },

        // ==================== FISH - BULK LOTS ====================
        {
          category: "FISH",
          fishTab: "BULK_LOTS",
          name_en: "Rohu Fish - Bulk (1-2 kg each)",
          name_te: "రోహు చేపలు - బల్క్ (ఒక్కో 1-2 కిలోలు)",
          name_hi: "रोहू मछली - बल्क (हर एक 1-2 किलो)",
          unitLabel: "kg",
          price: 800,
          stockQty: 200,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Rohu",
            bulkType: "Mixed Size",
            minOrderKg: 5,
            minFishKg: 1,
            maxFishKg: 2,
          },
        },
        {
          category: "FISH",
          fishTab: "BULK_LOTS",
          name_en: "Catla Fish - Bulk (2-3 kg each)",
          name_te: "కాటల చేపలు - బల్క్ (ఒక్కో 2-3 కిలోలు)",
          name_hi: "कैटला मछली - बल्क (हर एक 2-3 किलो)",
          unitLabel: "kg",
          price: 950,
          stockQty: 150,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Catla",
            bulkType: "Large",
            minOrderKg: 5,
            minFishKg: 2,
            maxFishKg: 3,
          },
        },

        // ==================== FISH - FAMILY PACKS ====================
        {
          category: "FISH",
          fishTab: "FAMILY_PACKS",
          name_en: "Rohu - Raw Fish",
          name_te: "రోహు - కచ్చా చేపలు",
          name_hi: "रोहू - कच्ची मछली",
          unitLabel: "kg",
          price: 650,
          stockQty: 100,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Rohu",
            serviceType: "RAW",
            services: ["RAW"],
            prepMinutes: 0,
          },
        },
        {
          category: "FISH",
          fishTab: "FAMILY_PACKS",
          name_en: "Rohu - Cut Pieces (Ready to Cook)",
          name_te: "రోహు - కట్ పీసెస్ (వండుటకు సిద్ధం)",
          name_hi: "रोहू - कट पीसेज़ (पकाने के लिए तैयार)",
          unitLabel: "kg",
          price: 750,
          stockQty: 80,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Rohu",
            serviceType: "CUT_PIECES",
            services: ["CUT_PIECES"],
            prepMinutes: 15,
          },
        },
        {
          category: "FISH",
          fishTab: "FAMILY_PACKS",
          name_en: "Fish Curry - Ready to Cook",
          name_te: "చేపల కూర - వండుటకు సిద్ధం",
          name_hi: "मछली करी - पकाने के लिए तैयार",
          unitLabel: "kg",
          price: 900,
          stockQty: 60,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Mixed",
            serviceType: "CURRY",
            services: ["CURRY"],
            prepMinutes: 45,
          },
        },
        {
          category: "FISH",
          fishTab: "FAMILY_PACKS",
          name_en: "Fish Fry - Ready to Eat",
          name_te: "చేపల ఫ్రై - తినుటకు సిద్ధం",
          name_hi: "मछली तलना - खाने के लिए तैयार",
          unitLabel: "kg",
          price: 850,
          stockQty: 50,
          imageUrl: "/categories/fish.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            fishType: "Mixed",
            serviceType: "FRY",
            services: ["FRY"],
            prepMinutes: 30,
          },
        },

        // ==================== SHEEP - YOUNG LAMB ====================
        {
          category: "SHEEP",
          name_en: "Young Lamb - 8 months old",
          name_te: "చిన్న గొర్రె - 8 నెలల వయస్సు",
          name_hi: "यंग लैम्ब - 8 महीने पुराना",
          unitLabel: "each",
          price: 18000,
          stockQty: 5,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "YOUNG_LAMB",
            sheepId: "L-101",
            ageMonths: 8,
            weightKg: 8,
            videoCallAvailable: true,
          },
        },
        {
          category: "SHEEP",
          name_en: "Young Lamb - 10 months old",
          name_te: "చిన్న గొర్రె - 10 నెలల వయస్సు",
          name_hi: "यंग लैम्ब - 10 महीने पुराना",
          unitLabel: "each",
          price: 20000,
          stockQty: 3,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "YOUNG_LAMB",
            sheepId: "L-102",
            ageMonths: 10,
            weightKg: 10,
            videoCallAvailable: true,
          },
        },

        // ==================== SHEEP - ADULT ====================
        {
          category: "SHEEP",
          name_en: "Adult Sheep - 18 months",
          name_te: "పెద్ద గొర్రె - 18 నెలల వయస్సు",
          name_hi: "एडल्ट शीप - 18 महीने",
          unitLabel: "each",
          price: 32000,
          stockQty: 2,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "ADULT_SHEEP",
            sheepId: "A-301",
            ageMonths: 18,
            weightKg: 22,
            videoCallAvailable: true,
          },
        },

        // ==================== SHEEP - MUTTON ====================
        {
          category: "SHEEP",
          name_en: "Mutton - Raw Mix",
          name_te: "మటన్ - కచ్చా మిక్స్",
          name_hi: "मटन - कच्चा मिश्रण",
          unitLabel: "kg",
          price: 900,
          stockQty: 50,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "MUTTON",
            serviceType: "RAW_MIX",
            services: ["RAW_MIX"],
            extraCharges: { RAW_MIX: 0 },
            prepMinutes: 0,
            minOrderKg: 1,
          },
        },
        {
          category: "SHEEP",
          name_en: "Mutton - Boneless Cut",
          name_te: "మటన్ - ఎముక లేని కట్",
          name_hi: "मटन - हड्डी रहित कटौती",
          unitLabel: "kg",
          price: 1020,
          stockQty: 40,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "MUTTON",
            serviceType: "BONELESS",
            services: ["BONELESS"],
            extraCharges: { BONELESS: 120 },
            prepMinutes: 20,
            minOrderKg: 1,
          },
        },
        {
          category: "SHEEP",
          name_en: "Mutton - Curry Ready",
          name_te: "మటన్ - కూర సిద్ధం",
          name_hi: "मटन - करी तैयार",
          unitLabel: "kg",
          price: 1100,
          stockQty: 35,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "MUTTON",
            serviceType: "CURRY",
            services: ["CURRY"],
            extraCharges: { CURRY: 200 },
            prepMinutes: 60,
            minOrderKg: 1,
          },
        },
        {
          category: "SHEEP",
          name_en: "Mutton - Fry Ready",
          name_te: "మటన్ - ఫ్రై సిద్ధం",
          name_hi: "मटन - तलना तैयार",
          unitLabel: "kg",
          price: 1080,
          stockQty: 30,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "MUTTON",
            serviceType: "FRY",
            services: ["FRY"],
            extraCharges: { FRY: 180 },
            prepMinutes: 45,
            minOrderKg: 1,
          },
        },

        // ==================== VEGETABLES ====================
        {
          category: "VEGETABLES",
          name_en: "Tomatoes - Fresh",
          name_te: "టమోటోలు - తాజా",
          name_hi: "टमाटर - ताज़ा",
          unitLabel: "kg",
          price: 32,
          stockQty: 500,
          imageUrl: "/categories/vegetables.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            vegetableType: "TOMATOES",
            freshness: "Fresh",
            storageLife: "5-7 days",
          },
        },
        {
          category: "VEGETABLES",
          name_en: "Green Chillies",
          name_te: "ఆకుపచ్చ మిరపల",
          name_hi: "हरी मिर्च",
          unitLabel: "kg",
          price: 40,
          stockQty: 300,
          imageUrl: "/categories/vegetables.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            vegetableType: "GREEN_CHILLIES",
            spicyLevel: "Medium-Hot",
            storageLife: "10-12 days",
          },
        },
        {
          category: "VEGETABLES",
          name_en: "Spinach (Leafy)",
          name_te: "ఆకు (ఆకులయిన సాక్",
          name_hi: "पालक (पत्तेदार)",
          unitLabel: "kg",
          price: 25,
          stockQty: 200,
          imageUrl: "/categories/vegetables.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            vegetableType: "SPINACH",
            leafyType: "LEAFY",
            storageLife: "2-3 days",
          },
        },
        {
          category: "VEGETABLES",
          name_en: "Cucumber",
          name_te: "దోసకాయ",
          name_hi: "खीरा",
          unitLabel: "kg",
          price: 28,
          stockQty: 400,
          imageUrl: "/categories/vegetables.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            vegetableType: "CUCUMBER",
            freshness: "Fresh",
            storageLife: "7-10 days",
          },
        },
        {
          category: "VEGETABLES",
          name_en: "Onion - White",
          name_te: "ఎండిపాయ - తెల్ల",
          name_hi: "प्याज़ - सफ़ेद",
          unitLabel: "kg",
          price: 30,
          stockQty: 600,
          imageUrl: "/categories/vegetables.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            vegetableType: "ONION_WHITE",
            freshness: "Fresh",
            storageLife: "30 days",
          },
        },

        // ==================== RICE ====================
        {
          category: "RICE",
          name_en: "Basmati Rice - Premium",
          name_te: "బాస్మతి రైస్ - ప్రీమియం",
          name_hi: "बासमती चावल - प्रीमियम",
          unitLabel: "kg",
          price: 120,
          stockQty: 500,
          imageUrl: "/categories/rice.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            riceType: "BASMATI",
            quality: "Premium",
            origin: "India",
          },
        },
        {
          category: "RICE",
          name_en: "Jasmine Rice",
          name_te: "జాస్మిన్ రైస్",
          name_hi: "चमेली के चावल",
          unitLabel: "kg",
          price: 85,
          stockQty: 400,
          imageUrl: "/categories/rice.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            riceType: "JASMINE",
            quality: "Standard",
            origin: "Thailand",
          },
        },
        {
          category: "RICE",
          name_en: "Brown Rice",
          name_te: "ఎండ నిలువు రైస్",
          name_hi: "ब्राउन राइस",
          unitLabel: "kg",
          price: 95,
          stockQty: 300,
          imageUrl: "/categories/rice.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            riceType: "BROWN",
            quality: "Organic",
            origin: "India",
          },
        },
        {
          category: "RICE",
          name_en: "Sona Masori - Local",
          name_te: "సోన మసోరి - లోకల్",
          name_hi: "सोना मसोरी - स्थानीय",
          unitLabel: "kg",
          price: 65,
          stockQty: 700,
          imageUrl: "/categories/rice.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            riceType: "SONA_MASORI",
            quality: "Standard",
            origin: "Local",
          },
        },
      ],
    });

    console.log("✅ Seed completed");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});