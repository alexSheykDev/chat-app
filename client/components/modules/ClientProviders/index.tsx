"use client";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketProvider";
import { Toaster } from "@/components/ui/toaster";
const ClientProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider refetchOnWindowFocus>
      <SocketProvider>
        {children}
        <Toaster />
      </SocketProvider>
    </SessionProvider>
  );
};

export default ClientProviders;
