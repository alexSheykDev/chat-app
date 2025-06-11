"use server";

import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";
import { IChat } from "@/interfaces/chat";

interface AddUsersToGroupPayload {
  chatId: string;
  userIds: string[];
}

export default async function addUsersToGroupChatAction({
  chatId,
  userIds,
}: AddUsersToGroupPayload): Promise<IChat | null> {
  const endpoint = `${getBackendUrl()}api/chats/group/${chatId}/add-users`;
  const fetcher = new Fetcher();

  try {
    const updatedChat = await fetcher.post(endpoint, { userIds } as never);

    if (!updatedChat || !updatedChat._id) {
      console.error("Failed to add users to group chat.");
      return null;
    }

    return updatedChat;
  } catch (error) {
    console.error("Error in addUsersToGroupChatAction:", error);
    return null;
  }
}
