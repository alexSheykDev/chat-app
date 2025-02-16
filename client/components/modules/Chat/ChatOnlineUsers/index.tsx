"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../../ClientProviders/SocketProvider";
import getUsersAction from "@/actions/user/getUsersAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import createChatAction from "@/actions/chat/createChatAction";
import { useRouter } from "next/navigation";
import { IUser } from "@/interfaces/user";
import { IChat } from "@/interfaces/chat";

interface ChatOnlineUsersProps {
  chats: IChat[];
}

export default function ChatOnlineUsers({ chats }: ChatOnlineUsersProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const { onlineUsers } = useSocket();
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch online users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsersAction();
        const onlineUsers = usersData.filter(
          (user) => user.online && user._id !== session?.user?.id,
        );

        setUsers(onlineUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, [onlineUsers, session?.user?.id]);

  // Handle user click (navigate to existing chat or create a new one)
  const handleUserClick = useCallback(
    async (userId: string) => {
      if (!session?.user?.id) return;

      // Check if chat already exists
      const existingChat = chats.find(
        (chat) =>
          chat.members.includes(userId) &&
          chat.members.includes(session.user.id),
      );

      if (existingChat) {
        router.push(`/chat/${existingChat._id}`);
      } else {
        try {
          const newChat = await createChatAction({
            firstId: userId,
            secondId: session.user.id,
          });

          if (newChat) {
            router.push(`/chat/${newChat._id}`);
          }
        } catch (error) {
          console.error("Error creating chat:", error);
        }
      }
    },
    [chats, router, session?.user?.id],
  );

  return (
    <div>
      <h2>Online Users</h2>
      <div className="flex gap-x-4">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="cursor-pointer"
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -right-1 bottom-1 z-1 w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
