"use client";

import { useParams } from "next/navigation";
import { useState, useCallback } from "react";
import InputEmoji from "react-input-emoji";

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
  const [textMessage, setTextMessage] = useState<string>("");
  const params = useParams();
  const chatId = params?.chatId as string;

  const handleSendMessage = useCallback(() => {
    if (!textMessage.trim() || !chatId || !userId) return;

    sendMessage(
      { chatId, senderId: userId, text: textMessage },
      setTextMessage,
    );
  }, [textMessage, chatId, userId, sendMessage]);

  return (
    <div className="flex justify-center pb-16">
      <div className="flex flex-col w-full max-w-[520px]">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          shouldReturn
          shouldConvertEmojiToImage={false}
          fontFamily="nunito"
          borderColor="rgba(72, 112, 223, 0.2)"
        />
        <button
          className="self-end bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={!textMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
