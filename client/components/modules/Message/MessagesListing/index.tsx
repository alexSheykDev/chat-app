import { IMessage } from "@/interfaces/message";
import RecipientMessage from "../RecipientMessage";
import UserMessage from "../UserMessage";

interface MessagesListingProps {
  userId: string;
  messages: IMessage[];
}

export default function MessagesListing({
  userId,
  messages,
}: MessagesListingProps) {
  return (
    <div className="flex flex-col gap-y-5 py-2 px-16">
      {messages.map(({ _id, senderId, text, updatedAt }) =>
        senderId === userId ? (
          <UserMessage key={_id} textMessage={text} timestamp={updatedAt} />
        ) : (
          <RecipientMessage
            key={_id}
            textMessage={text}
            timestamp={updatedAt}
          />
        ),
      )}
    </div>
  );
}
