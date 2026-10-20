import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, retryDelay: 500 }, // fail fast so the error UI shows quickly
    mutations: { retry: false },
  },
})
