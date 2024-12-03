import {useUpdateUsersMutation} from '~/data-provider';
import useUserAddition from "./useUserAddition";

export default function useAddUsersFromTable(successCallback?: () => void, errorCallback?: (message) => void) {
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

  return useUserAddition({ mutateAsync: updateMutation.mutateAsync });
}