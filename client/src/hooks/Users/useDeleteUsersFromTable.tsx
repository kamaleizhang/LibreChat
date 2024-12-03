import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys} from 'librechat-data-provider';
import type { TUser } from 'librechat-data-provider';
import { useDeleteUsersMutation } from '~/data-provider';
import useUserDeletion from './useUserDeletion';

export default function useDeleteUsersFromTable(successCallback?: () => void, errorCallback?: (message) => void) {
  const queryClient = useQueryClient();
  const deletionMutation = useDeleteUsersMutation({
    onMutate: async (variables) => {
      const usersToDeleteMap = variables.reduce((acc: Map<string, string>, userId) => {
        acc.set(userId, userId);
        return acc;
      }, new Map<string, string>());
      return { usersToDeleteMap };
    },
    onSuccess: (data, variables, context) => {
      console.log('Users deleted');
      queryClient.setQueryData([QueryKeys.users], (oldUsers: TUser[] | undefined) => {
      const userMap = variables.reduce((acc: Map<string, string>, userId) => {
        acc.set(userId, userId);
        return acc;
      }, new Map<string, string>());

        return userMap?.size
          ? oldUsers?.filter((user) => !userMap.has(user._id))
          : oldUsers;
      });
      successCallback?.();
    },
    onError: (error) => {
      console.log('Error deleting users:', error);
      errorCallback?.(error);
    },
  });

  return useUserDeletion({ mutateAsync: deletionMutation.mutateAsync });
}
