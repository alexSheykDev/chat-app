"use server";

import { LoginRequest, LoginResponse } from "@/interfaces/auth";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function loginAction(
  loginData: LoginRequest,
): Promise<LoginResponse | null> {
  const loginPath = `${getBackendUrl()}api/users/login`;

  const fetcher = new Fetcher();

  try {
    const loginResponse: LoginResponse = await fetcher.post(
      loginPath,
      loginData as never,
    );

    if (!loginResponse?.token) {
      console.warn("Login failed: Invalid response from server.");
      return null;
    }

    return loginResponse;
  } catch (error) {
    console.error("Error in loginAction:", error);
    return null;
  }
}
