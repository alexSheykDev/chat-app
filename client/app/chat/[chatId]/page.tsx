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
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { useMarkChatAsRead } from "@/hooks/use-mark-as-read";
import { Button } from "@/components/ui/button";
import { AddUsersToGroupForm } from "@/components/modules/Chat/AddUsersToGroupForm";
import leaveGroupChatAction from "@/actions/chat/leaveGroupChatAction";
import { useToast } from "@/hooks/use-toast";

interface MessageAreaProps {
  params: Promise<{ chatId: string }>;
}

export default function MessageArea({ params }: MessageAreaProps) {
  const { chatId } = React.use(params);
  const { data: session, status } = useSession();
  const { socket, isConnected } = useSocket();
  const { mutate: markAsRead } = useMarkChatAsRead();
  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { toast } = useToast();

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

  const {
    data: chat,
    isLoading: loadingChat,
    refetch: refetchChat,
  } = useQuery({
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

  useEffect(() => {
    if (chatId && userId) {
      markAsRead({ chatId, userId });
    }
  }, [chatId, markAsRead, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleLeaveGroup = async () => {
    if (!chatId || !userId) return;
    try {
      await leaveGroupChatAction({ chatId, userId });
      toast({ description: "You left the group chat" });
      router.push("/chat");
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "Failed to leave group" });
    }
  };

  if (status === "loading" || loadingMessages || loadingChat) {
    return <p>Loading...</p>;
  }

  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col grow h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300" />
            <h2 className="text-md font-semibold text-gray-900">
              {chat?.isGroup
                ? chat.groupName
                : chat?.members?.find((member) => member._id !== userId)
                    ?.name || "Unknown"}
            </h2>
          </div>

          {chat?.isGroup && (
            <div className="flex flex-wrap gap-2 mt-1">
              {chat.members.map((member) => (
                <span
                  key={member._id}
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700"
                >
                  {member.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {chat?.isGroup && chatId && (
          <div className="flex gap-2">
            <AddUsersToGroupForm
              chatId={chatId}
              existingMemberIds={chat.members.map((member) => member._id)}
              refetchChat={refetchChat}
            />
            <Button size="sm" variant="destructive" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2"
        >
          {messages && messages.length === 0 && <NoMessagesView />}
          {messages && messages.length > 0 && (
            <MessagesListing
              userId={userId}
              messages={messages}
              membersMap={membersMap}
            />
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <SendMessageArea
            userId={userId}
            sendMessage={sendMessage}
            membersMap={membersMap}
          />
        </div>
      </div>
    </div>
  );
}
