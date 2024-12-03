import debounce from 'lodash/debounce';
import { useCallback, useState, useEffect } from 'react';
import type * as t from 'librechat-data-provider';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { GenericSetter } from '~/common';
import { useSetUsersToDelete } from './useSetUsersToOperate';
import {TUser} from "librechat-data-provider";

type UserMapSetter = GenericSetter<Map<string, TUser>>;

const useUserDeletion = ({
  mutateAsync,
}: {
  mutateAsync: UseMutateAsyncFunction<t.DeleteUsersResponse, unknown, string[], unknown>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_batch, setUserDeleteBatch] = useState<string[]>([]);
  const setUsersToDelete = useSetUsersToDelete();

  const executeBatchDelete = useCallback(
    ({ usersToDelete }: { usersToDelete: string[];}) => {
      console.log('Deleting users:', usersToDelete);
      mutateAsync(usersToDelete);
      setUserDeleteBatch([]);
    },
    [mutateAsync],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDelete = useCallback(debounce(executeBatchDelete, 1000), []);

  useEffect(() => {
    // Cleanup function for debouncedDelete when component unmounts or before re-render
    return () => debouncedDelete.cancel();
  }, [debouncedDelete]);

  const deleteUser = useCallback(
    ({ userId, setUsers }: { userId: string[]; setUsers?: UserMapSetter; }) => {

      setUserDeleteBatch((prevBatch) => {
        const newBatch = [...prevBatch, userId];
        debouncedDelete({
          usersToDelete: newBatch,
        });
        return newBatch;
      });
    },
    [debouncedDelete, setUsersToDelete],
  );

  const deleteUsers = useCallback(
    ({ userIds, setUsers }: { userIds: string[]; setUsers?: UserMapSetter }) => {

      if (setUsers) {
        setUsers((currentUsers) => {
          const updatedUsers = new Map(currentUsers);
          userIds.forEach((userId) => {
            updatedUsers.delete(userId);
          });
          const usersToUpdate = Object.fromEntries(updatedUsers);
          setUsersToDelete(usersToUpdate);
          return updatedUsers;
        });
      }

      setUserDeleteBatch((prevBatch) => {
        const newBatch = [...prevBatch, ...userIds];
        debouncedDelete({
          usersToDelete: newBatch,
        });
        return newBatch;
      });
    },
    [debouncedDelete, setUsersToDelete],
  );

  return { deleteUser, deleteUsers };
};

export default useUserDeletion;
