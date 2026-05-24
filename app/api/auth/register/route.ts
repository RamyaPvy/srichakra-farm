import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();
    const emailRaw = String(body.email || "").trim();
    const email = emailRaw ? emailRaw.toLowerCase() : null;
    const password = String(body.password || "").trim();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { error: "Full name, phone, and password are required." },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 }
      );
    }

    const existingPhone = await prisma.customer.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "An account already exists with this phone number." },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.customer.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "An account already exists with this email." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        fullName,
        phone,
        email,
        password: hashedPassword,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful.",
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
    console.error("POST /api/auth/register failed:", error);
    return NextResponse.json(
      { error: "Failed to register customer." },
      { status: 500 }
    );
  }
}