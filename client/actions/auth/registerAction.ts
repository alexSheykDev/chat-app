"use server";

import { RegisterFormData } from "@/components/modules/AuthForm";
import { RegisterResponse } from "@/interfaces/auth";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function registerAction(
  registerData: RegisterFormData,
): Promise<RegisterResponse | null> {
  const registerPath = `${getBackendUrl()}api/users/register`;

  const fetcher = new Fetcher();

  try {
    const registerResponse: RegisterResponse = await fetcher.post(
      registerPath,
      registerData as never,
    );

    if (!registerResponse?.token) {
      console.warn("Registration failed: Invalid response from server.");
      return null;
    }

    return registerResponse;
  } catch (error) {
    console.error("Error in registerAction:", error);
    return null;
  }
}
