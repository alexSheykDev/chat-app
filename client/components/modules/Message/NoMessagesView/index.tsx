import Image from "next/image";

const NoMessagesView = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-5 py-2 px-16 overflow-auto">
      <div className="flex flex-col">
        <div className="rounded-xl overflow-hidden">
          <Image
            width={300}
            height={300}
            src="/no-messages.webp"
            alt="No Messages Image"
            className=""
          />
        </div>
        <h1 className="text-2xl font-bold mt-4">
          No messages in this chat yet
        </h1>
      </div>
    </div>
  );
};

export default NoMessagesView;
