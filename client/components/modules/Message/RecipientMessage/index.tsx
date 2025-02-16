import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";

type RecipientMessageProps = {
  textMessage: string;
  timestamp: string;
};

const RecipientMessage = ({
  textMessage,
  timestamp,
}: RecipientMessageProps) => {
  const time = formatTo12HourTime(timestamp);

  return (
    <div className="flex flex-col items-start max-w-[75%] self-start">
      <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none">
        {textMessage}
      </div>
      <p className="mt-2 text-xs text-gray-400">{time}</p>
    </div>
  );
};

export default RecipientMessage;
