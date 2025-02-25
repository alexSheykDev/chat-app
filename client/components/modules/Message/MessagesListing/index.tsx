import { IMessage } from "@/interfaces/message";
import RecipientMessage from "../RecipientMessage";
import UserMessage from "../UserMessage";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

interface MessagesListingProps {
  userId: string;
  messages: IMessage[];
}

export default function MessagesListing({
  userId,
  messages,
}: MessagesListingProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let lastDate: string | null = null;

  return (
    <div className="flex flex-col gap-y-5 py-2 px-16 overflow-auto">
      {messages.map(({ _id, senderId, text, updatedAt }) => {
        const messageDate = format(new Date(updatedAt), "yyyy-MM-dd");
        const showDateSeparator = messageDate !== lastDate;
        lastDate = messageDate;

        return (
          <div key={_id}>
            {showDateSeparator && (
              <div className="flex justify-center my-2">
                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-md">
                  {format(new Date(updatedAt), "MMMM d, yyyy")}
                </span>
              </div>
            )}
            {senderId === userId ? (
              <UserMessage textMessage={text} timestamp={updatedAt} />
            ) : (
              <RecipientMessage textMessage={text} timestamp={updatedAt} />
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
