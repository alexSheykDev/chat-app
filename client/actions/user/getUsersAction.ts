"use server";

import { GetUsersResponse } from "@/interfaces/user";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getUsersAction(): Promise<GetUsersResponse> {
  const userPath = `${getBackendUrl()}api/users`;

  const fetcher = new Fetcher();

  const usersResponse = await fetcher.get(userPath);

  return usersResponse;
}
