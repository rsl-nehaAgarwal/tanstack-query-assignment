import { request } from './client'

export const fetchUsers = () => request('/api/users')
export const createUser = (user) =>
  request('/api/users', { method: 'POST', body: JSON.stringify(user) })
export const deleteUser = (id) => request(`/api/users/${id}`, { method: 'DELETE' })
