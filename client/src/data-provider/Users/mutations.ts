import {LocalStorageKeys, SystemRoles, TUser, UserContext} from 'librechat-data-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QueryKeys,
  dataService,
  MutationKeys,
} from 'librechat-data-provider';
import type * as t from 'librechat-data-provider';
import type { UseMutationResult } from '@tanstack/react-query';
import {useSetRecoilState} from "recoil";
import store from "~/store";

export const  useDeleteUserMutation = (
  options?: t.MutationOptions<unknown, undefined>,
): UseMutationResult<unknown, unknown, undefined, unknown> => {
  const queryClient = useQueryClient();
  const setDefaultPreset = useSetRecoilState(store.defaultPreset);
  return useMutation([MutationKeys.deleteUser], {
    mutationFn: () => dataService.deleteUser(),

    ...(options || {}),
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
    },
    onMutate: (...args) => {
      setDefaultPreset(null);
      queryClient.removeQueries();
      localStorage.removeItem(LocalStorageKeys.LAST_CONVO_SETUP);
      localStorage.removeItem(`${LocalStorageKeys.LAST_CONVO_SETUP}_0`);
      localStorage.removeItem(`${LocalStorageKeys.LAST_CONVO_SETUP}_1`);
      localStorage.removeItem(LocalStorageKeys.LAST_MODEL);
      localStorage.removeItem(LocalStorageKeys.LAST_TOOLS);
      localStorage.removeItem(LocalStorageKeys.FILES_TO_DELETE);
      options?.onMutate?.(...args);
    },
  });
};

export const useDeleteUsersMutation = (
  _options?: t.UsersMutationDelete,
): UseMutationResult<t.DeleteUsersResponse, unknown, string[], unknown> => {
  console.log('33333-002')
  const queryClient = useQueryClient();
  const { onSuccess, ...options } = _options || {};
  // const setDefaultPreset = useSetRecoilState(store.defaultPreset);
  return useMutation([MutationKeys.deleteUsers], {
    mutationFn: (body: string[]) => dataService.deleteUsers(body),
    ...options,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData<t.TUser[] | undefined>([QueryKeys.users], (cacheUsers) => {
        // const { usersToDelete } = args[0];
        const usersToDelete = args[0]
        const userMap = usersToDelete.reduce((acc: Map<string, string>, userId) => {
          acc.set(userId, userId);
          return acc;
        }, new Map<string, string>());

        return (cacheUsers ?? []).filter((user) => !userMap.has(user.id));
      });
      onSuccess?.(data, ...args);
    },
  });
};

export const useAddUsersMutation = (
  _options?: t.UsersMutationDelete,
): UseMutationResult<t.DeleteUsersResponse, unknown, TUser, unknown> => {
  console.log('33333-add')
  const queryClient = useQueryClient();
  const { onSuccess, ...options } = _options || {};
  // const setDefaultPreset = useSetRecoilState(store.defaultPreset);
  return useMutation([MutationKeys.addUsers], {
    mutationFn: (body: string[]) => dataService.deleteUsers(body),
    ...options,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData<t.TUser[] | undefined>([QueryKeys.users], (cacheUsers) => {
        // const { usersToDelete } = args[0];
        const usersToDelete = args[0]
        const userMap = usersToDelete.reduce((acc: Map<string, string>, userId) => {
          acc.set(userId, userId);
          return acc;
        }, new Map<string, string>());

        return (cacheUsers ?? []).filter((user) => !userMap.has(user.id));
      });
      onSuccess?.(data, ...args);
    },
  });
};

export const useUpdateUsersMutation = (
  _options?: t.UsersMutationUpdate,
): UseMutationResult<t.DeleteUsersResponse, unknown, unknown> => {
  console.log('33333-001')
  const queryClient = useQueryClient();
  const { onSuccess, ...options } = _options || {};
  // const setDefaultPreset = useSetRecoilState(store.defaultPreset);
  return useMutation([MutationKeys.usersUpload], {
    mutationFn: (body: object) => dataService.updateUsers(body),
    ...options,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData<t.TUser[] | undefined>([QueryKeys.users], (cacheUsers) => {
        console.log(args)
        const { userIds, action, value} = args[0];

        const userMap = userIds.reduce((acc, userId) => {
          acc.set(userId, userId);
          return acc;
        }, new Map<string, string>());

        for (let i in cacheUsers) {
          const user = cacheUsers[i]
          if (userMap.has(user._id)) {
            user[UserContext.role] = value || SystemRoles.USER;
            cacheUsers[i] = user
          }
        }

        return cacheUsers;//(cacheUsers ?? []).filter((user) => !userMap.has(user._id));
      });
      onSuccess?.(data, ...args);
    },
  });
};