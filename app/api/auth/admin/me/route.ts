import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Not logged in as admin." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/admin/me failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin." },
      { status: 500 }
    );
  }
}
