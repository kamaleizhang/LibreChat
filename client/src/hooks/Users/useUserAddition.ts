import debounce from 'lodash/debounce';
import { useCallback, useState, useEffect } from 'react';
import type * as t from 'librechat-data-provider';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { ExtendedUser, GenericSetter } from '~/common';
import { useSetUsersToUpdate } from './useSetUsersToOperate';

type UserMapSetter = GenericSetter<Map<string, ExtendedUser>>;

const useUserUpdating = ({
  mutateAsync
}: {
  mutateAsync: UseMutateAsyncFunction<t.DeleteUsersResponse, unknown, unknown>;
}) => {
  const [_batch, setUserUpdateBatch] = useState<string[]>([]);
  const setUsersToUpdate = useSetUsersToUpdate();

  const executeBatchUpdate = useCallback(
    ({
      userIds, action, value
    }: {
      userIds: string[];
      action: string;
      value: string;
    }) => {
      console.log('333333-33')
      const payload = {
        userIds: userIds,
        action: action,
        value: value
      };
      console.log('Update users:', payload);
      mutateAsync(payload);
      setUserUpdateBatch([]);
    },
    [mutateAsync],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(debounce(executeBatchUpdate, 1000), []);

  useEffect(() => {
    // Cleanup function for debouncedUpdate when component unmounts or before re-render
    return () => debouncedUpdate.cancel();
  }, [debouncedUpdate]);

  const updateUsers = useCallback(
    ({ userIds, action, value, setUsers }: {
      userIds: string[];
      action: string;
      value: string;
      setUsers?: UserMapSetter;
    }) => {
      console.log('11111')
      if (setUsers) {
        setUsers((currentUsers) => {
          const updatedUsers = new Map(currentUsers);
          const usersToUpdate = Object.fromEntries(updatedUsers);
          setUsersToUpdate(usersToUpdate);
          return updatedUsers;
        });
      }

      setUserUpdateBatch((prevBatch) => {
      console.log('222222')
        const newBatch = [...prevBatch, ...userIds];
        debouncedUpdate({
          userIds: newBatch,
          action: action,
          value: value,
        });
        return newBatch;
      });
    },
    [debouncedUpdate, setUsersToUpdate],
  );

  return { updateUsers };
};

export default useUserUpdating;
