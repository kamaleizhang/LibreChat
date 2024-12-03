import { QueryKeys, dataService } from 'librechat-data-provider';
import { useQuery } from '@tanstack/react-query';
import type { QueryObserverResult, UseQueryOptions } from '@tanstack/react-query';
import type t from 'librechat-data-provider';

export const useGetUsers = <TData = t.TUser[] | boolean>(
  config?: UseQueryOptions<t.TUser[], unknown, TData>,
): QueryObserverResult<TData, unknown> => {
  return useQuery<t.TUser[], unknown, TData>([QueryKeys.users], () => dataService.getUsers(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config,
  });
};
