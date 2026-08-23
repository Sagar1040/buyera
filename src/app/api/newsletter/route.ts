import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = newsletterSchema.parse(body);

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: validated.email.toLowerCase().trim() },
      update: { isActive: true },
      create: { email: validated.email.toLowerCase().trim() },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the BUYERA Privé newsletter.",
      data: subscriber,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: err.errors[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
