import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const login = String(body.login || "").trim();
    const password = String(body.password || "").trim();

    if (!login || !password) {
      return NextResponse.json(
        { error: "Phone/email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = login.toLowerCase();

    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { phone: login },
          { email: normalizedEmail },
        ],
      },
    });

    if (!customer || !customer.isActive) {
      return NextResponse.json(
        { error: "Invalid login details." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid login details." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
      },
    });

    response.cookies.set(CUSTOMER_SESSION_COOKIE, customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json(
      { error: "Failed to login." },
      { status: 500 }
    );
  }
}