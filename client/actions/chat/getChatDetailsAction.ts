"use server";

import getUserDetailsAction from "../user/getUserDetailsAction";
import getMessageByIdAction from "../message/getMessageByIdAction";
import { IChatDetails } from "@/interfaces/chat";

export default async function getChatDetailsAction(
  userId: string,
  members: string[],
  lastMessageId?: string,
): Promise<IChatDetails | null> {
  const recipientId = members.find((id) => id !== userId);

  if (!recipientId) {
    throw new Error("Recipient ID could not be determined.");
  }

  try {
    // Fetch recipient details and last message of the chat
    const [recipient, lastMessage] = await Promise.all([
      getUserDetailsAction(recipientId),
      lastMessageId ? getMessageByIdAction(lastMessageId) : null,
    ]);

    return {
      recipientName: recipient?.name || "Unknown User",
      lastMessageText: lastMessage?.text || null,
      lastMessageTimestamp: lastMessage?.updatedAt || null,
    };
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return null;
  }
}
