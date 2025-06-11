"use server";

import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";
import { IChat } from "@/interfaces/chat";

interface LeaveGroupChatPayload {
  chatId: string;
  userId: string;
}

export default async function leaveGroupChatAction({
  chatId,
  userId,
}: LeaveGroupChatPayload): Promise<IChat | null> {
  const endpoint = `${getBackendUrl()}api/chats/group/${chatId}/leave`;
  const fetcher = new Fetcher();

  try {
    const updatedChat = await fetcher.post(endpoint, { userId } as never);

    if (!updatedChat || !updatedChat._id) {
      console.error("Failed to leave group chat.");
      return null;
    }

    return updatedChat;
  } catch (error) {
    console.error("Error in leaveGroupChatAction:", error);
    return null;
  }
}
