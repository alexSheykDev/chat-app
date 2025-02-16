"use client";

import { useEffect, useState } from "react";
import getChatDetailsAction from "@/actions/chat/getChatDetailsAction";
import ChatEntity from "../ChatEntity";
import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";
import ChatOnlineUsers from "../ChatOnlineUsers";
import { IChat } from "@/interfaces/chat";

interface ChatsListingProps {
  userId: string;
  chats: IChat[];
}

interface ChatDetails {
  id: string;
  recipientName: string;
  lastMessageText: string | null;
  lastMessageTimestamp: string | null;
}

export default function ChatsListing({ userId, chats }: ChatsListingProps) {
  const [chatDetails, setChatDetails] = useState<ChatDetails[]>([]);

  useEffect(() => {
    async function fetchChatDetails() {
      try {
        // Fetch all chat details in parallel
        const chatDetailsPromises = chats.map(async (chat) => {
          const details = await getChatDetailsAction(
            userId,
            chat.members,
            chat.lastMessageId,
          );

          return {
            id: chat._id,
            recipientName: details ? details.recipientName : "",
            lastMessageText: details ? details.lastMessageText : "",
            lastMessageTimestamp:
              details && details.lastMessageTimestamp
                ? formatTo12HourTime(details.lastMessageTimestamp)
                : null,
          } as ChatDetails;
        });

        const resolvedChatDetails = await Promise.all(chatDetailsPromises);
        setChatDetails(resolvedChatDetails);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    }

    fetchChatDetails();
  }, [userId, chats]);

  return (
    <div className="w-80 border-r border-gray-300">
      <ChatOnlineUsers chats={chats} />
      {chatDetails.map((chat) => (
        <ChatEntity
          key={chat.id}
          id={chat.id}
          recipientName={chat.recipientName}
          lastMessage={chat.lastMessageText}
          timestamp={chat.lastMessageTimestamp}
          isPinned
          isOnline
        />
      ))}
    </div>
  );
}
