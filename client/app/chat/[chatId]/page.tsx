"use client";

import getChatMessagesAction from "@/actions/message/getChatMessagesAction";
import { useSocket } from "@/components/modules/ClientProviders/SocketProvider";
import MessagesListing from "@/components/modules/Message/MessagesListing";
import SendMessageArea from "@/components/modules/Message/SendMessageArea";
import { IMessage } from "@/interfaces/message";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";

interface MessageAreaProps {
  params: Promise<{ chatId: string }>;
}

export default function MessageArea({ params }: MessageAreaProps) {
  const { chatId } = React.use(params);
  const { data: session, status } = useSession();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);

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

    socket.on("receiveMessage", (newMessage: IMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, isConnected]);

  const sendMessage = useCallback(
    (
      data: { text: string; chatId: string; senderId: string },
      setMessage: (msg: string) => void,
    ) => {
      if (socket && chatId) {
        socket.emit("sendMessage", data);
        setMessage("");
      }
    },
    [socket, chatId],
  );

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Ensure user is logged in
  const userId = session?.user?.id;

  return (
    <div className="flex flex-col justify-between w-full">
      <MessagesListing userId={userId} messages={messages} />
      <SendMessageArea userId={userId} sendMessage={sendMessage} />
    </div>
  );
}
