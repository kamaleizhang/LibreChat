import {LocalStorageKeys, TUser} from 'librechat-data-provider';

export function useSetUsersToDelete() {
  const useSetUsersToDelete = (users: Record<string, TUser>) =>
    localStorage.setItem(LocalStorageKeys.USERS_TO_DELETE, JSON.stringify(users));
  return useSetUsersToDelete;
}
export function useSetUsersToUpdate() {
  const useSetUsersToUpdate = (users: Record<string, TUser>) =>
    localStorage.setItem(LocalStorageKeys.USERS_TO_UPDATE, JSON.stringify(users));
  return useSetUsersToUpdate;
}
