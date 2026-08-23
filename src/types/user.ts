import { AddressType } from "./order";

export type UserRole = "CUSTOMER" | "ADMIN";
export type Role = UserRole;

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  addresses?: AddressType[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
