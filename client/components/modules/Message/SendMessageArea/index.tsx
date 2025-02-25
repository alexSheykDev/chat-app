"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import { useSocket } from "../../ClientProviders/SocketProvider";
import { Button } from "@/components/ui/button";

interface SendMessageProps {
  sendMessage: (
    data: { chatId: string; senderId: string; text: string },
    setMessage: (msg: string) => void,
  ) => void;
  userId: string;
}

export default function SendMessageArea({
  sendMessage,
  userId,
}: SendMessageProps) {
  const { socket, isConnected } = useSocket();
  const [textMessage, setTextMessage] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const params = useParams();
  const chatId = params?.chatId as string;

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("userTyping", ({ senderId }) => {
      setTypingUsers((prev) =>
        prev.includes(senderId) ? prev : [...prev, senderId],
      );
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== senderId));
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, isConnected, chatId]);

  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", { chatId, senderId: userId });

      setTimeout(() => {
        socket.emit("stopTyping", {
          chatId,
          senderId: userId,
        });
      }, 3000);
    }
  };

  const handleSendMessage = useCallback(() => {
    if (!textMessage.trim() || !chatId || !userId) return;

    sendMessage(
      { chatId, senderId: userId, text: textMessage },
      setTextMessage,
    );
  }, [textMessage, chatId, userId, sendMessage]);

  return (
    <div className="flex flex-col justify-center items-center pb-16">
      {typingUsers.length > 0 && (
        <p className="text-gray-500">
          {typingUsers.length === 1
            ? "User is typing..."
            : "Multiple people are typing..."}
        </p>
      )}
      <div className="flex items-center w-full max-w-[520px]">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          onKeyDown={handleTyping}
          shouldReturn
          shouldConvertEmojiToImage={false}
          fontFamily="nunito"
          borderColor="rgba(72, 112, 223, 0.2)"
        />
        <Button onClick={handleSendMessage} disabled={!textMessage.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
