"use server";

import { GetUserChatsResponse, IChat } from "@/interfaces/chat";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getUserChatsAction(
  userId: string,
): Promise<GetUserChatsResponse> {
  if (!userId) {
    console.warn("getUserChatsAction: No user ID provided.");
    return [];
  }

  const fetcher = new Fetcher();

  try {
    const chatsPath = `${getBackendUrl()}api/chats/${userId}`;
    const chatsResponse: IChat[] = await fetcher.get(chatsPath);

    return Array.isArray(chatsResponse) ? chatsResponse : [];
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}
