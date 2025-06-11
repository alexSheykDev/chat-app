"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import getUsersAction from "@/actions/user/getUsersAction";
import { IUser } from "@/interfaces/user";
import addUsersToGroupChatAction from "@/actions/chat/addUsersToGroupChatAction";
import { useToast } from "@/hooks/use-toast";

interface AddUsersFormProps {
  chatId: string;
  existingMemberIds: string[];
  refetchChat: () => void;
}

interface AddUsersFormValues {
  members: string[];
}

export function AddUsersToGroupForm({
  chatId,
  existingMemberIds,
  refetchChat,
}: AddUsersFormProps) {
  const [open, setOpen] = useState(false);

  const {
    data: users = [],
    refetch,
    isFetching,
  } = useQuery<IUser[] | null>({
    queryKey: ["users"],
    queryFn: getUsersAction,
    staleTime: 0,
  });

  const { handleSubmit, setValue, watch, reset } = useForm<AddUsersFormValues>({
    defaultValues: {
      members: [],
    },
  });

  const { toast } = useToast();

  const selectedMembers = watch("members");

  const availableUsers =
    users?.filter((user) => !existingMemberIds.includes(user._id)) ?? [];

  useEffect(() => {
    if (open) {
      refetch();
      refetchChat();
    }
  }, [open, refetch, refetchChat]);

  const onSubmit = async (data: AddUsersFormValues) => {
    try {
      await addUsersToGroupChatAction({
        chatId,
        userIds: data.members,
      });
      refetchChat();
      toast({
        title: "Users Added",
        description: `${data.members.length} user(s) added to the group.`,
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add users to group", error);
      toast({
        title: "Error",
        description: "Could not add users. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Add Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Users to Group</DialogTitle>
        </DialogHeader>

        {availableUsers.length === 0 && !isFetching ? (
          <p className="text-sm text-gray-500">No users available to add.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {availableUsers.map((user) => (
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

            <Button type="submit" className="w-full">
              Add Selected Users
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
