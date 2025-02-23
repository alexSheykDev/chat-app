"use client";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketProvider";
const ClientProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider refetchOnWindowFocus>
      <SocketProvider>{children}</SocketProvider>
    </SessionProvider>
  );
};

export default ClientProviders;
