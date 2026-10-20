import { useState } from 'react'
import { useCreateUser } from '../hooks/useUsers'

const ROLES = ['Admin', 'Editor', 'Viewer']
const EMPTY = { name: '', email: '', role: 'Viewer' }

export default function UserForm() {
  const [form, setForm] = useState(EMPTY) // the form's own input values (client state)
  const createUser = useCreateUser()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    createUser.mutate(form, { onSuccess: () => setForm(EMPTY) })
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Add user</h2>
      <input name="name" placeholder="Name" aria-label="Name" value={form.name} onChange={handleChange} required />
      <input
        name="email"
        type="email"
        placeholder="Email"
        aria-label="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <select name="role" aria-label="Role" value={form.role} onChange={handleChange}>
        {ROLES.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating…' : 'Create user'}
      </button>

      {/* mutation states: pending / success / error */}
      {createUser.isPending && <p className="message">Status: pending – saving the user…</p>}
      {createUser.isSuccess && <p className="message success">Status: success – user created.</p>}
      {createUser.isError && <p className="message error">Status: error – {createUser.error.message}</p>}
    </form>
  )
}
