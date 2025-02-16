"use server";

import { IMessage } from "@/interfaces/message";
import getBackendUrl from "@/lib/helpers/getBackendUrl";
import Fetcher from "@/utils/fetcher";

export default async function getMessageByIdAction(
  messageId: string,
): Promise<IMessage | null> {
  if (!messageId) {
    console.warn("getMessageByIdAction: No message ID provided.");
    return null;
  }

  const fetcher = new Fetcher();

  const messagePath = `${getBackendUrl()}api/messages/find/${messageId}`;

  try {
    const messageResponse: IMessage = await fetcher.get(messagePath);

    if (!messageResponse?._id) {
      console.warn(`Message with ID ${messageId} not found.`);
      return null;
    }

    return messageResponse;
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    return null;
  }
}
