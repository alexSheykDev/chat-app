"use client";

import { useQuery } from "@tanstack/react-query";
import getChatByIdAction from "@/actions/chat/getChatByIdAction";
import getChatMessagesAction from "@/actions/message/getChatMessagesAction";
import { useSocket } from "@/components/modules/ClientProviders/SocketProvider";
import MessagesListing from "@/components/modules/Message/MessagesListing";
import NoMessagesView from "@/components/modules/Message/NoMessagesView";
import SendMessageArea from "@/components/modules/Message/SendMessageArea";
import { IMessage } from "@/interfaces/message";
import { IUser } from "@/interfaces/user";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useCallback, useMemo } from "react";

interface MessageAreaProps {
  params: Promise<{ chatId: string }>;
}

export default function MessageArea({ params }: MessageAreaProps) {
  const { chatId } = React.use(params);
  const { data: session, status } = useSession();
  const { socket, isConnected } = useSocket();

  const userId = session?.user?.id;

  const {
    data: messages,
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useQuery<IMessage[]>({
    queryKey: ["messages", chatId],
    queryFn: () => getChatMessagesAction(chatId),
    enabled: !!chatId,
  });

  const { data: chat, isLoading: loadingChat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatByIdAction(chatId),
    enabled: !!chatId,
  });

  const membersMap = useMemo(() => {
    if (!chat?.members) return {};
    return chat.members.reduce(
      (acc, user) => {
        if (user?._id) acc[user._id] = user;
        return acc;
      },
      {} as Record<string, IUser>,
    );
  }, [chat]);

  useEffect(() => {
    if (!socket || !isConnected || !chatId) return;

    socket.emit("joinChat", { chatId });

    const handleReceiveMessage = (newMessage: IMessage) => {
      if (newMessage.chatId === chatId) {
        refetchMessages();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.emit("leaveChat", { chatId });
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, isConnected, chatId, refetchMessages]);

  const sendMessage = useCallback(
    (
      data: { text: string; chatId: string; senderId: string },
      setMessage: (msg: string) => void,
    ) => {
      if (socket && chatId) {
        socket.emit("sendMessage", data);
        setMessage("");
        socket.emit("stopTyping", {
          chatId,
          senderId: data.senderId,
        });
      }
    },
    [socket, chatId],
  );

  if (status === "loading" || loadingMessages || loadingChat) {
    return <p>Loading...</p>;
  }

  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col grow justify-between">
      {messages && messages.length === 0 && <NoMessagesView />}
      {messages && messages.length > 0 && (
        <MessagesListing
          userId={userId}
          messages={messages}
          membersMap={membersMap}
        />
      )}
      <SendMessageArea
        userId={userId}
        sendMessage={sendMessage}
        membersMap={membersMap}
      />
    </div>
  );
}
