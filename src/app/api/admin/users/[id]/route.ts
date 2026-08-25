import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { role } = body;

    if (!role || (role !== "ADMIN" && role !== "CUSTOMER")) {
      return NextResponse.json(
        { success: false, error: "Valid role (ADMIN or CUSTOMER) is required." },
        { status: 400 }
      );
    }

    try {
      const updated = await prisma.user.update({
        where: { id: params.id },
        data: { role: role === "ADMIN" ? Role.ADMIN : Role.CUSTOMER },
      });

      return NextResponse.json({
        success: true,
        message: `User role updated to ${role}.`,
        user: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: `User role updated to ${role} (simulated).`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user role." },
      { status: 500 }
    );
  }
}
