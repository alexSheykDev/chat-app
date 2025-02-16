"use client";

import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PinIcon from "@/assets/icons/PinIcon";
import { useRouter } from "next/navigation";

type ChatEntityProps = {
  id: string;
  recipientName: string;
  lastMessage: string | null;
  timestamp: string | null;
  isOnline?: boolean;
  isPinned?: boolean;
  unreadMessages?: number;
};

const ChatEntity: FC<ChatEntityProps> = ({
  id,
  recipientName,
  lastMessage,
  timestamp,
  isOnline = false,
  isPinned = false,
  unreadMessages = 0,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex gap-x-2 p-4" onClick={handleClick}>
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -right-1 bottom-1 z-1 w-3 h-3 rounded-full bg-green-500" />
        )}
      </div>

      <div className="flex flex-col grow max-w-44">
        <p className="text-sm font-semibold text-slate-900">{recipientName}</p>
        <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <p className="text-xs text-gray-400">{timestamp}</p>
        {isPinned && !unreadMessages && <PinIcon />}
        {unreadMessages > 0 && (
          <p className="flex justify-center items-center w-5 h-5 bg-blue-600 text-white text-xs font-semibold rounded-full">
            {unreadMessages}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatEntity;
