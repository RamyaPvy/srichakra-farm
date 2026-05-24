import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

async function main() {
  const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: dbUrl }),
  });

  try {
    await prisma.adminUser.upsert({
      where: { email: "admin@srichakrafarm.com" },
      update: {},
      create: {
        email: "admin@srichakrafarm.com",
        password: "admin123",
        role: "ADMIN",
      },
    });

    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});

    await prisma.product.createMany({
      data: [
        {
          category: "SHEEP",
          name_en: "Young Lamb - L101",
          name_te: "చిన్న గొర్రె - L101",
          name_hi: "यंग लैम्ब - L101",
          unitLabel: "each",
          price: 18000,
          stockQty: 1,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "YOUNG_LAMB",
            sheepId: "L-101",
            ageMonths: 8,
            weightKg: 8,
            whatsappNumber: "919999999999",
            videoCallAvailable: true,
          },
        },
        {
          category: "SHEEP",
          name_en: "Adult Sheep - A301",
          name_te: "పెద్ద గొర్రె - A301",
          name_hi: "एडल्ट शीप - A301",
          unitLabel: "each",
          price: 32000,
          stockQty: 1,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "ADULT_SHEEP",
            sheepId: "A-301",
            ageMonths: 18,
            weightKg: 22,
            whatsappNumber: "919999999999",
            videoCallAvailable: true,
          },
        },
        {
          category: "SHEEP",
          name_en: "Premium Mutton",
          name_te: "ప్రిమియం మటన్",
          name_hi: "प्रीमियम मटन",
          unitLabel: "kg",
          price: 900,
          stockQty: 40,
          imageUrl: "/categories/sheep.jpg",
          imageSource: "PLACEHOLDER",
          isActive: true,
          metaJson: {
            kind: "MUTTON",
            services: [
              "RAW_MIX",
              "HEAD",
              "LEGS",
              "LIVER",
              "INTESTINES",
              "BONLESS",
              "CURRY",
              "FRY",
              "PICKLE",
            ],
            extraCharges: {
              RAW_MIX: 0,
              HEAD: 50,
              LEGS: 40,
              LIVER: 60,
              INTESTINES: 50,
              BONLESS: 120,
              CURRY: 200,
              FRY: 180,
              PICKLE: 280,
            },
            prepMinutes: {
              RAW_MIX: 0,
              HEAD: 10,
              LEGS: 10,
              LIVER: 5,
              INTESTINES: 15,
              BONLESS: 20,
              CURRY: 60,
              FRY: 45,
              PICKLE: 90,
            },
            minOrderKg: 1,
            whatsappNumber: "919999999999",
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