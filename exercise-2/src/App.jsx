import { useState } from 'react'
import { setSimulateError } from './api/client'
import UserForm from './components/UserForm'
import UserList from './components/UserList'

export default function App() {
  const [simulate, setSimulate] = useState(false)

  const toggleSimulate = (e) => {
    setSimulate(e.target.checked)
    setSimulateError(e.target.checked)
  }

  return (
    <main className="container">
      <h1>Exercise 2: User Management</h1>
      <p className="hint">User creation, deletion, mutations, invalidation, and optimistic updates.</p>

      <label className="simulate">
        <input type="checkbox" checked={simulate} onChange={toggleSimulate} />
        Simulate server error (makes create / delete requests fail)
      </label>

      <UserForm />
      <UserList />
    </main>
  )
}
