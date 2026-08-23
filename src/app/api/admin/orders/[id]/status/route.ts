import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(orderStatus && { orderStatus: orderStatus as OrderStatus }),
        ...(paymentStatus && { paymentStatus: paymentStatus as PaymentStatus }),
        ...(paymentStatus === "PAID" && {
          payment: {
            update: {
              status: PaymentStatus.PAID,
            },
          },
        }),
      },
      include: {
        payment: true,
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Admin update order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update order." },
      { status: 500 }
    );
  }
}
