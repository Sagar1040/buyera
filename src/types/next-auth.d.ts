import { DefaultSession } from "next-auth";
import { Role } from "@/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role | string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role | string;
  }
}
