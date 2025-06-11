import markChatAsReadAction from "@/actions/chat/markChatAsRedAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkChatAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markChatAsReadAction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatDetails", variables.chatId],
      });

      queryClient.invalidateQueries({
        queryKey: ["chats", variables.userId],
      });
    },
  });
};
