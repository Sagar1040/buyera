import { ProductVariantType } from "./product";

export type OrderStatusType =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatusType = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethodType = "RAZORPAY" | "COD";

export interface AddressType {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export interface OrderItemType {
  id: string;
  orderId: string;
  variantId?: string | null;
  variant?: ProductVariantType | null;
  name: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  price: number;
  mrp?: number | null;
}

export interface PaymentType {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethodType;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  status: PaymentStatusType;
  amount: number;
  method?: string | null;
  createdAt: string | Date;
}

export interface ShipmentType {
  id: string;
  orderId: string;
  shiprocketId?: string | null;
  awbNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  status: string;
  shippedAt?: string | Date | null;
  deliveredAt?: string | Date | null;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  shippingAddress: AddressType;
  subtotal: number;
  discount: number;
  couponCode?: string | null;
  shippingCost: number;
  total: number;
  orderStatus: OrderStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod: PaymentMethodType;
  notes?: string | null;
  items: OrderItemType[];
  payment?: PaymentType | null;
  shipment?: ShipmentType | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
