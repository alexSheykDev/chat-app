import Image from "next/image";
import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";

type RecipientMessageProps = {
  textMessage: string;
  timestamp: string;
  senderName: string;
  senderAvatarUrl?: string;
  showAvatarAndName?: boolean;
};

const RecipientMessage = ({
  textMessage,
  timestamp,
  senderName,
  senderAvatarUrl,
  showAvatarAndName = true,
}: RecipientMessageProps) => {
  const time = formatTo12HourTime(timestamp);

  return (
    <div className="flex flex-col items-start max-w-[75%] self-start">
      {showAvatarAndName && (
        <div className="flex items-center gap-2 mb-1">
          {senderAvatarUrl ? (
            <Image
              src={senderAvatarUrl}
              alt={senderName}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {senderName}
          </span>
        </div>
      )}

      <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none">
        {textMessage}
      </div>
      <p className="mt-2 text-xs text-gray-400">{time}</p>
    </div>
  );
};

export default RecipientMessage;
