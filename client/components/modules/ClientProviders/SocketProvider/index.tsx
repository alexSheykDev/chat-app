import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { userId: session.user.id },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => setIsConnected(true));

    // TODO: Socket.onReconnect

    socketInstance.on("disconnect", () => setIsConnected(false));

    socketInstance.on("updateOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });
    socketInstance.on("userConnected", ({ name }) => {
      toast({
        title: "Hey! Someone is back",
        description: `Check if you need to write something to ${name}`,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session?.user.id, toast]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
