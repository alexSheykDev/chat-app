"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import getUsersAction from "@/actions/user/getUsersAction";
import { IUser } from "@/interfaces/user";
import createGroupChatAction from "@/actions/chat/createGroupChatAction";
import { useSession } from "next-auth/react";

interface CreateGroupChatFormValues {
  groupName: string;
  members: string[];
}

export function CreateGroupChatForm() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const { data: users = [] } = useQuery<IUser[] | null>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsersAction();
      return res;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateGroupChatFormValues>({
    defaultValues: {
      groupName: "",
      members: [],
    },
  });

  if (!session) return null;

  const onSubmit = async (data: CreateGroupChatFormValues) => {
    try {
      console.log(data);
      await createGroupChatAction({
        groupName: data.groupName,
        memberIds: data.members,
        adminId: session?.user?.id,
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Group creation failed", error);
    }
  };

  const selectedMembers = watch("members");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Group Chat</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Group Name</label>
            <Input
              {...register("groupName", { required: true })}
              placeholder="Cool Team"
            />
            {errors.groupName && (
              <p className="text-sm text-red-500">Group name is required</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Select Members</label>
            <div className="max-h-52 overflow-y-auto space-y-2">
              {users
                ?.filter((user) => user._id !== session?.user?.id)
                ?.map((user) => (
                  <div key={user._id} className="flex items-center gap-2">
                    <Checkbox
                      id={user._id}
                      checked={selectedMembers.includes(user._id)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...selectedMembers, user._id]
                          : selectedMembers.filter((id) => id !== user._id);
                        setValue("members", newValue);
                      }}
                    />
                    <label htmlFor={user._id} className="text-sm">
                      {user.name} ({user.email})
                    </label>
                  </div>
                ))}
            </div>
            {errors.members && (
              <p className="text-sm text-red-500">Select at least one member</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
