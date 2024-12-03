import {useUpdateUsersMutation} from '~/data-provider';
import useUserUpdating from "./useUserUpdation";

export default function useUpdateUsersFromTable(successCallback?: () => void, errorCallback?: (message) => void) {
  const updateMutation = useUpdateUsersMutation({
    onMutate: async (variables) => {
      console.log("444444")
      return variables;
    },
    onSuccess: (data, variables, context) => {
      successCallback?.();
    },
    onError: (error) => {
      console.log('Error updating users:', error);
      errorCallback?.(error);
    },
  });

  return useUserUpdating({ mutateAsync: updateMutation.mutateAsync });
}