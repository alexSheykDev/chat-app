"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../ClientProviders/SocketProvider";
import ChatEntity from "../ChatEntity";
import ChatOnlineUsers from "../ChatOnlineUsers";
import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";
import getChatDetailsAction from "@/actions/chat/getChatDetailsAction";
import getUserChatsAction from "@/actions/chat/getUserChatsAction";

interface ChatsListingProps {
  userId: string;
}

export default function ChatsListing({ userId }: ChatsListingProps) {
  const { onlineUsers, socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const { data: chats = [] } = useQuery({
    queryKey: ["chats", userId],
    queryFn: () => getUserChatsAction(userId),
    refetchOnWindowFocus: false,
  });

  const { data: chatDetails = [] } = useQuery({
    queryKey: ["chatDetails", userId],
    queryFn: async () => {
      const chatDetailsPromises = chats.map(async (chat) => {
        const details = await getChatDetailsAction(
          userId,
          chat.members,
          chat.lastMessageId,
        );

        return {
          id: chat._id,
          groupName: chat.isGroup ? chat.groupName : undefined,
          recipientName: details?.recipientName || "Unknown",
          lastMessageText: details?.lastMessageText || "",
          lastMessageTimestamp: details?.lastMessageTimestamp
            ? formatTo12HourTime(details.lastMessageTimestamp)
            : null,
          unreadCount: chat.unreadCount || 0,
        };
      });

      return Promise.all(chatDetailsPromises);
    },
    enabled: chats.length > 0, // wait for chats to be loaded
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleMessageUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["chatDetails", userId] });
      queryClient.invalidateQueries({ queryKey: ["chats", userId] });
    };

    socket.on("updateChatDetails", handleMessageUpdate);
    socket.on("chat:unread-updated", handleMessageUpdate);

    return () => {
      socket.off("updateChatDetails", handleMessageUpdate);
      socket.off("chat:unread-updated", handleMessageUpdate);
    };
  }, [socket, isConnected, queryClient, userId]);

  const isRecipientOnline = (chatId: string) => {
    const chatMembers =
      chats.find((chat) => chat._id === chatId)?.members || [];
    const recipientId = chatMembers.find((id) => id !== userId) || "";
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
          isOnline={isRecipientOnline(chat.id)}
          unreadMessages={chat.unreadCount}
        />
      ))}
    </div>
  );
}
