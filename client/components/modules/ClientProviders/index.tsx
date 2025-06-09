"use client";
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./SocketProvider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const ClientProviders = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [client] = useState(() => new QueryClient());
  return (
    <SessionProvider refetchOnWindowFocus>
      <SocketProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
        <Toaster />
      </SocketProvider>
    </SessionProvider>
  );
};

export default ClientProviders;
