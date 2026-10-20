import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, fetchUsers } from '../api/users'

export const USERS_KEY = ['users']

// Requirement 1: useUsers() uses useQuery() with ['users'] as the query key.
export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: fetchUsers })
}

// Requirements 2 & 5: create a user, then invalidate ['users'] so the list refetches.
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

// Requirements 6 & 7: delete a user with an optimistic update and rollback.
export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,

    onMutate: async (id) => {
      // cancel in-flight ['users'] fetches so they cannot overwrite the optimistic data
      await queryClient.cancelQueries({ queryKey: USERS_KEY })
      // snapshot the cache so we can roll back
      const previousUsers = queryClient.getQueryData(USERS_KEY)
      // immediately remove the user from the cached list
      queryClient.setQueryData(USERS_KEY, (old = []) => old.filter((u) => u.id !== id))
      return { previousUsers }
    },

    // server failed -> restore the previous cached data
    onError: (_error, _id, context) => {
      queryClient.setQueryData(USERS_KEY, context?.previousUsers)
    },

    // success or failure -> re-sync with the server
    onSettled: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
