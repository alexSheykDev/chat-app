"use server";

import { CreateChatRequest, IChat } from "@/interfaces/chat";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function createChatAction(
  chatData: CreateChatRequest,
): Promise<IChat | null> {
  const chatPath = `${getBackendUrl()}api/chats`;

  const fetcher = new Fetcher();

  try {
    const chatResponse: IChat | null = await fetcher.post(
      chatPath,
      chatData as never,
    );

    if (!chatResponse || !chatResponse._id) {
      console.error("Failed to create chat.");
      return null;
    }

    return chatResponse;
  } catch (error) {
    console.error("Error in createChatAction:", error);
    return null;
  }
}
