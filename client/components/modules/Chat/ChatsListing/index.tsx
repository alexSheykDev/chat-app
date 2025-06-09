"use client";

import { useEffect, useState } from "react";
import getChatDetailsAction from "@/actions/chat/getChatDetailsAction";
import ChatEntity from "../ChatEntity";
import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";
import ChatOnlineUsers from "../ChatOnlineUsers";
import { IChat } from "@/interfaces/chat";
import { useSocket } from "../../ClientProviders/SocketProvider";
import { IMessage } from "@/interfaces/message";

interface ChatsListingProps {
  userId: string;
  chats: IChat[];
}

interface ChatDetails {
  id: string;
  recipientName: string;
  groupName?: string;
  lastMessageText: string | null;
  lastMessageTimestamp: string | null;
}

export default function ChatsListing({ userId, chats }: ChatsListingProps) {
  const [chatDetails, setChatDetails] = useState<ChatDetails[]>([]);
  const { onlineUsers, socket, isConnected } = useSocket();

  useEffect(() => {
    async function fetchChatDetails() {
      try {
        const chatDetailsPromises = chats.map(async (chat) => {
          const details = await getChatDetailsAction(
            userId,
            chat.members,
            chat.lastMessageId,
          );

          return {
            id: chat._id,
            groupName: chat.isGroup ? chat.groupName : undefined,
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

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (newMessage: IMessage) => {
      setChatDetails((prevChatDetails) =>
        prevChatDetails.map((chat) =>
          chat.id === newMessage.chatId
            ? {
                ...chat,
                lastMessageText: newMessage.text,
                lastMessageTimestamp: formatTo12HourTime(newMessage.updatedAt),
              }
            : chat,
        ),
      );
    };

    socket.on("updateChatDetails", handleNewMessage);

    return () => {
      socket.off("updateChatDetails", handleNewMessage);
    };
  }, [socket, isConnected]);

  const isRecipientOnline = (userId: string, chatId: string) => {
    const chatMembers =
      chats.find((chat) => chat._id === chatId)?.members || [];
    const recipientId =
      chatMembers.find((memberId) => memberId !== userId) || "";
    return onlineUsers.includes(recipientId);
  };

  return (
    <div className="w-80 border-r border-gray-300">
      <ChatOnlineUsers chats={chats} />
      <h2 className="text-lg font-semibold px-4 mb-2">Messages</h2>
      {chatDetails.map((chat) => (
        <ChatEntity
          key={chat.id}
          id={chat.id}
          chatName={chat.groupName || chat.recipientName}
          lastMessage={chat.lastMessageText}
          timestamp={chat.lastMessageTimestamp}
          isPinned
          isOnline={isRecipientOnline(userId, chat.id)}
        />
      ))}
    </div>
  );
}
