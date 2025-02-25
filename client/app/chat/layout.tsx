import getUserChatsAction from "@/actions/chat/getUserChatsAction";
import ChatsListing from "@/components/modules/Chat/ChatsListing";
import Header from "@/components/modules/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const { user } = session;

  const chats = await getUserChatsAction(user.id);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex grow h-[calc(100%-64px)]">
        <ChatsListing userId={user?.id} chats={chats} />
        {children}
      </div>
    </div>
  );
}
