"use server";

import { IUser } from "@/interfaces/user";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getUserDetailsAction(
  userId: string,
): Promise<IUser | null> {
  if (!userId) {
    console.warn("getUserDetailsAction: No user ID provided.");
    return null;
  }

  const fetcher = new Fetcher();

  const userPath = `${getBackendUrl()}api/users/find/${userId}`;

  try {
    const userResponse: IUser = await fetcher.get(userPath);

    if (!userResponse?._id) {
      console.warn(`User with ID ${userId} not found.`);
      return null;
    }

    return userResponse;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
