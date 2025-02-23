"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePopover = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{session?.user?.name}</h3>
      <Button onClick={() => router.push("/user/edit")}>Edit Profile</Button>
      <Button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
        Logout
      </Button>
    </div>
  );
};

export default ProfilePopover;
