import { prisma } from "@/lib/prisma";
import { getShiprocketToken, trackShipmentAWB } from "@/lib/shiprocket";

export class ShippingService {
  /**
   * Generates shipment record in database and optionally triggers Shiprocket AWB
   */
  static async createShipmentForOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        items: true,
      },
    });

    if (!order) throw new Error("Order not found");

    const shipment = await prisma.shipment.upsert({
      where: { orderId },
      update: {},
      create: {
        orderId,
        status: "Processing",
      },
    });

    return shipment;
  }

  /**
   * Syncs real-time shipment status from Shiprocket
   */
  static async syncShipmentStatus(awbNumber: string) {
    const trackingInfo = await trackShipmentAWB(awbNumber);
    if (!trackingInfo) return null;

    const shipment = await prisma.shipment.findFirst({
      where: { awbNumber },
    });

    if (shipment) {
      const currentStatus =
        trackingInfo?.tracking_data?.shipment_track?.[0]?.current_status ||
        shipment.status;

      return prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: currentStatus,
          updatedAt: new Date(),
        },
      });
    }

    return null;
  }
}
