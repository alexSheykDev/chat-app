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

  console.log(user.id);

  const chats = await getUserChatsAction(user.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex grow h-full">
        <ChatsListing userId={user?.id} chats={chats} />
        {children}
      </div>
    </div>
  );
}
