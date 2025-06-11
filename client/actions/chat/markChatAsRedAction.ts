"use server";

import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function markChatAsReadAction({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}): Promise<boolean> {
  const readPath = `${getBackendUrl()}api/chats/${chatId}/read`;

  const fetcher = new Fetcher();

  try {
    const response = await fetcher.patch(readPath, { userId } as never);

    if (!response?.success) {
      console.error("Failed to mark chat as read.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in markChatAsRead:", error);
    return false;
  }
}
