import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    let addresses: any[] = [];

    if (userId) {
      addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });
    } else if (session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          addresses: {
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
          },
        },
      });
      addresses = user?.addresses || [];
    }

    return NextResponse.json({ addresses });
  } catch (error: any) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses", addresses: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      houseFlat,
      street,
      area = "",
      city,
      district = "",
      state,
      pinCode,
      isDefault = false,
    } = body;

    if (!fullName || !phone || !houseFlat || !street || !city || !state || !pinCode) {
      return NextResponse.json(
        { error: "Please provide all required address fields." },
        { status: 400 }
      );
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If setting default, unset existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address, make it default automatically
    const existingCount = await prisma.address.count({
      where: { userId },
    });

    const newAddress = await prisma.address.create({
      data: {
        userId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        houseFlat: houseFlat.trim(),
        street: street.trim(),
        area: (area || street).trim(),
        city: city.trim(),
        district: (district || city).trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        isDefault: existingCount === 0 ? true : Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create address" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      fullName,
      phone,
      houseFlat,
      street,
      area = "",
      city,
      district = "",
      state,
      pinCode,
      isDefault,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    let userId = session.user.id;
    if (!userId && session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) userId = user.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        fullName: fullName?.trim(),
        phone: phone?.trim(),
        houseFlat: houseFlat?.trim(),
        street: street?.trim(),
        area: area?.trim(),
        city: city?.trim(),
        district: district?.trim(),
        state: state?.trim(),
        pinCode: pinCode?.trim(),
        ...(typeof isDefault === "boolean" ? { isDefault } : {}),
      },
    });

    return NextResponse.json({ success: true, address: updated });
  } catch (error: any) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Address ID required" }, { status: 400 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}
