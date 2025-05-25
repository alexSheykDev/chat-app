"use server";

import { IMessage } from "@/interfaces/message";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getChatMessagesAction(
  chatId: string,
): Promise<IMessage[] | []> {
  if (!chatId) {
    console.warn("getChatMessagesAction: No chat ID provided.");
    return [];
  }

  // Add fetcher initialization to the block tra catch
  const fetcher = new Fetcher();

  const messagePath = `${getBackendUrl()}api/messages/${chatId}`;

  try {
    const messageResponse: IMessage[] = await fetcher.get(messagePath);

    return Array.isArray(messageResponse) ? messageResponse : [];
  } catch (error) {
    console.error(`Error fetching messages for chat ${chatId}:`, error);
    return [];
  }
}
