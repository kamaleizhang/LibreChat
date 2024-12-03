export enum UserContext {
  avatar = 'avatar',
  username = 'username',
  name = 'name',
  email = 'email',
  updatedAt = 'updatedAt',
  role = 'role',
  action = 'action',
}


export type DeleteUsersResponse = {
  message: string;
  result: Record<string, unknown>;
};

// export type UsersMutationOptions = {
export type UsersMutationUpdate = {
  onSuccess?: (data: DeleteUsersResponse, variables: string[], action: string, value: string, context?: unknown) => void;
  onMutate?: (variables: string[], action: string, value: string) => void | Promise<unknown>;
  onError?: (error: unknown, variables: string[], action: string, value: string, context?: unknown) => void;
}
export type UsersMutationDelete = {
  onSuccess?: (data: DeleteUsersResponse, variables: string[], context?: unknown) => void;
  onMutate?: (variables: string[]) => void | Promise<unknown>;
  onError?: (error: unknown, variables: string[], context?: unknown) => void;
};