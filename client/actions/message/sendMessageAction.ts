"use server";

import { IMessage, SendMessageRequest } from "@/interfaces/message";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

const fetcher = new Fetcher();

export default async function sendMessageAction(
  messageData: SendMessageRequest,
): Promise<IMessage | null> {
  if (!messageData.chatId || !messageData.senderId || !messageData.text) {
    console.warn("sendMessageAction: Missing required message fields.");
    return null;
  }

  const messagesPath = `${getBackendUrl()}api/messages`;

  try {
    const messagesResponse: IMessage = await fetcher.post(
      messagesPath,
      messageData as never,
    );

    if (!messagesResponse?._id) {
      console.warn("sendMessageAction: Invalid response from server.");
      return null;
    }

    return messagesResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}
