"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSocket } from "../../ClientProviders/SocketProvider";
import getUsersAction from "@/actions/user/getUsersAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import createChatAction from "@/actions/chat/createChatAction";
import { useRouter } from "next/navigation";
import { IUser } from "@/interfaces/user";
import { IChat } from "@/interfaces/chat";
import { CreateGroupChatForm } from "../CreateGroupChatForm";

interface ChatOnlineUsersProps {
  chats: IChat[];
}

export default function ChatOnlineUsers({ chats }: ChatOnlineUsersProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const { onlineUsers } = useSocket();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getUsersAction();

        if (usersData) setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const handleUserClick = useCallback(
    async (userId: string) => {
      if (!session?.user?.id) return;

      // Check if chat already exists
      const existingChat = chats.find(
        (chat) =>
          chat.members.includes(userId) &&
          chat.members.includes(session.user.id) &&
          !chat.isGroup,
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

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        session?.user?.id !== user._id && onlineUsers.includes(user._id),
    );
  }, [onlineUsers, session?.user?.id, users]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Online Now</h2>
        <CreateGroupChatForm />
        <p className="text-xs text-gray-500">More</p>
      </div>

      <div className="flex flex-nowrap gap-x-4 overflow-scroll">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="cursor-pointer w-16"
          >
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute right-0 top-0 z-1 w-4 h-4 rounded-full bg-green-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500 text-center text-wrap">
              {user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
