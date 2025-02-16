import { DefaultUser } from "next-auth";

// Extend NextAuth's User type
export interface CustomUser extends DefaultUser {
  id: string;
  accessToken: string;
}

// Extend JWT Type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
  }
}

// Extend NextAuth Session
declare module "next-auth" {
  interface Session {
    user: CustomUser;
    accessToken: string;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}
