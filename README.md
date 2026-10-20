# TanStack Query Assignment

- `answers.txt` - Part A (MCQ answers)
- `exercise-1/` - Product Listing with caching, loading states and query keys
- `exercise-2/` - User Management with mutations, invalidation and optimistic updates

Each exercise is a separate Vite + React app (based on the provided starter structure):

```bash
cd exercise-1      # or exercise-2
npm install
npm run dev
```

Both apps use `@tanstack/react-query` v5 with React Query DevTools (floating button at the bottom-left).

## Mock REST API

Each exercise has `server/mockApi.js` - a small in-memory REST API that runs inside the Vite dev/preview server
(~0.7-0.8 s latency so loading states are visible). Tick **Simulate server error** in the app to make every request
fail with HTTP 500 (used for the error state and the failed-delete rollback). Data resets when the dev server restarts.
