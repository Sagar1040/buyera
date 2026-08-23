import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  houseFlat: z.string().min(1, "Flat / House No. is required"),
  street: z.string().min(3, "Street address is required"),
  area: z.string().min(2, "Area / Locality is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit PIN code"),
  isDefault: z.boolean().default(false),
});

export const couponValidateSchema = z.object({
  code: z.string().min(1, "Coupon code is required").toUpperCase(),
  subtotal: z.number().min(0, "Subtotal must be non-negative"),
});

export const reviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
