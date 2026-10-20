import { request } from './client'

export const fetchProducts = (search = '') =>
  request(`/api/products?search=${encodeURIComponent(search)}`)
