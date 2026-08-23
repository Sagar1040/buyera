import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const normalizedEmail = validated.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Hash password securely with bcrypt
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user and initialize empty cart
    const user = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: normalizedEmail,
        phone: validated.phone?.trim() || null,
        password: hashedPassword,
        cart: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please sign in.",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User registration error:", error);

    if (error.name === "ZodError") {
      const message = error.errors?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
