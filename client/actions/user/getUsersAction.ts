"use server";

import { IUser } from "@/interfaces/user";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getUsersAction(): Promise<IUser[] | null> {
  const userPath = `${getBackendUrl()}api/users`;

  const fetcher = new Fetcher();
  try {
    const usersResponse = await fetcher.get(userPath);

    return usersResponse;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
