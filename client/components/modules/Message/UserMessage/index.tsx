import formatTo12HourTime from "@/lib/helpers/formatTo12HourTime";

type UserMessageProps = {
  textMessage: string;
  timestamp: string;
};

const UserMessage = ({ textMessage, timestamp }: UserMessageProps) => {
  const time = formatTo12HourTime(timestamp);

  return (
    <div className="flex flex-col items-end max-w-[75%] self-end">
      <div className="bg-blue-100 p-3  rounded-lg rounded-br-none">
        {textMessage}
      </div>
      <p className="mt-2 text-xs text-gray-400">{time}</p>
    </div>
  );
};

export default UserMessage;
