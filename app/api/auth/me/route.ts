import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/auth";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        { error: "Not logged in." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        createdAt: customer.createdAt,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer." },
      { status: 500 }
    );
  }
}