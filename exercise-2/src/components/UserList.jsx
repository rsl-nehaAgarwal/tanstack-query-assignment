import { useDeleteUser, useUsers } from '../hooks/useUsers'

export default function UserList() {
  const { data: users, error, isPending, isFetching, isError, refetch } = useUsers()
  const deleteUser = useDeleteUser()

  return (
    <section>
      <h2>
        Users{' '}
        {isFetching && !isPending && <small className="hint">(syncing with the server…)</small>}
      </h2>

      {isPending && <p className="message">Loading users…</p>}

      {isError && !users && (
        <div>
          <p className="message error">Failed to load users: {error.message}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      )}
      {isError && users && <p className="message error">Could not sync with the server: {error.message}</p>}

      {users && (
        <div className="list">
          {users.length === 0 && <p className="hint">No users yet.</p>}
          {users.map((u) => (
            <div className="user" key={u.id}>
              <div>
                <strong>{u.name}</strong>
                <span>{u.email}</span>
              </div>
              <small>{u.role}</small>
              <button className="danger" onClick={() => deleteUser.mutate(u.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* delete mutation states: pending / success / error */}
      {deleteUser.isPending && <p className="message">Delete status: pending…</p>}
      {deleteUser.isSuccess && <p className="message success">Delete status: success.</p>}
      {deleteUser.isError && (
        <p className="message error">
          Delete status: error – {deleteUser.error.message}. The user was restored.
        </p>
      )}
    </section>
  )
}
