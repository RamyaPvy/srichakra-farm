export type FishType = "seed" | "bulk" | "fresh";

export const fishData: Record<FishType, { id: string; name: string; detail: string; price: string; status: "Available" | "Limited" | "Sold Out" }[]> =
{
  seed: [
    { id: "F-SEED-01", name: "Rohu Seed", detail: "1 inch • 10,000 qty", price: "Call for price", status: "Available" },
    { id: "F-SEED-02", name: "Katla Seed", detail: "2 inch • 8,000 qty", price: "Call for price", status: "Available" },
  ],
  bulk: [
    { id: "F-BULK-01", name: "Rohu (Bulk)", detail: "2 kg avg • 200 kg lot", price: "₹ / kg (Call)", status: "Limited" },
    { id: "F-BULK-02", name: "Tilapia (Bulk)", detail: "1 kg avg • 150 kg lot", price: "₹ / kg (Call)", status: "Available" },
  ],
  fresh: [
    { id: "F-FRESH-01", name: "Curry Cut Pack", detail: "1 kg pack • cleaned", price: "₹ 320", status: "Available" },
    { id: "F-FRESH-02", name: "Whole Fish", detail: "0.75–1 kg", price: "₹ / kg", status: "Available" },
  ],
};


export type Sheep = {
  id: string;
  weightKg: number;
  ageMonths: number;
  price: number;
  status: "Available" | "Limited" | "Sold Out";
};

export const sheepData: Sheep[] = [
  { id: "SCF-012", weightKg: 38, ageMonths: 11, price: 14500, status: "Available" },
  { id: "SCF-015", weightKg: 42, ageMonths: 14, price: 16800, status: "Available" },
  { id: "SCF-019", weightKg: 35, ageMonths: 10, price: 13200, status: "Limited" },
  { id: "SCF-021", weightKg: 48, ageMonths: 18, price: 19200, status: "Available" },
  { id: "SCF-027", weightKg: 30, ageMonths: 8, price: 11800, status: "Available" }
];


export type Veg = {
  id: string;
  name: string;
  pricePerKg: number;
  status: "Available" | "Limited" | "Sold Out";
};

export const vegData: Veg[] = [
  { id: "V-01", name: "Tomato", pricePerKg: 35, status: "Available" },
  { id: "V-02", name: "Okra (Bendakaya)", pricePerKg: 45, status: "Available" },
  { id: "V-03", name: "Onion", pricePerKg: 40, status: "Limited" },
  { id: "V-04", name: "Brinjal (Vankaya)", pricePerKg: 50, status: "Available" },
  { id: "V-05", name: "Chilli", pricePerKg: 80, status: "Limited" }
];
