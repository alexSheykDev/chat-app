"use client";

import getChatMessagesAction from "@/actions/message/getChatMessagesAction";
import { useSocket } from "@/components/modules/ClientProviders/SocketProvider";
import MessagesListing from "@/components/modules/Message/MessagesListing";
import NoMessagesView from "@/components/modules/Message/NoMessagesView";
import SendMessageArea from "@/components/modules/Message/SendMessageArea";
import { IMessage } from "@/interfaces/message";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

interface MessageAreaProps {
  params: Promise<{ chatId: string }>;
}

export default function MessageArea({ params }: MessageAreaProps) {
  const { chatId } = React.use(params);
  const { data: session, status } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IMessage[] | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const messages = await getChatMessagesAction(chatId);
        setMessages(messages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("joinChat", { chatId });

    socket.on("receiveMessage", (newMessage: IMessage) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...(prev as IMessage[]), newMessage]);
      }
    });

    return () => {
      socket.emit("leaveChat", { chatId });
      socket.off("receiveMessage");
    };
  }, [socket, isConnected, chatId]);

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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col grow justify-between">
      {messages && messages.length === 0 && <NoMessagesView />}
      {messages && messages.length > 0 && (
        <MessagesListing userId={userId} messages={messages} />
      )}
      <SendMessageArea userId={userId} sendMessage={sendMessage} />
    </div>
  );
}
