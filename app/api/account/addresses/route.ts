import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const addresses = await prisma.customerAddress.findMany({
    where: { customerId: customer.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ addresses });
}