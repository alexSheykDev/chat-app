"use server";

import { IChatDetailed } from "@/interfaces/chat";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getChatByIdAction(
  chatId: string,
): Promise<IChatDetailed | null> {
  try {
    const fetcher = new Fetcher();
    const url = `${getBackendUrl()}api/chats/${chatId}/find`;
    const chat = await fetcher.get(url);
    return chat;
  } catch (error) {
    console.error("Failed to fetch chat by ID", error);
    return null;
  }
}
