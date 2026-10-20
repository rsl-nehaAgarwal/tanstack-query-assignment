import { useState } from 'react'
import { setSimulateError } from './api/client'
import ProductList from './components/ProductList'

export default function App() {
  const [page, setPage] = useState('products')
  const [simulate, setSimulate] = useState(false)

  const toggleSimulate = (e) => {
    setSimulate(e.target.checked)
    setSimulateError(e.target.checked)
  }

  return (
    <main className="container">
      <h1>Exercise 1: Product Listing</h1>
      <p className="hint">
        Product fetching, caching, query keys, loading states, search, and background fetching.
      </p>

      <div className="topbar">
        <nav>
          <button className={page === 'products' ? 'tab active' : 'tab'} onClick={() => setPage('products')}>
            Products
          </button>
          <button className={page === 'other' ? 'tab active' : 'tab'} onClick={() => setPage('other')}>
            Another page
          </button>
        </nav>
        <label className="simulate">
          <input type="checkbox" checked={simulate} onChange={toggleSimulate} />
          Simulate server error
        </label>
      </div>

      {/* Switching pages unmounts ProductList - its data stays in the QueryClient cache. */}
      {page === 'products' ? (
        <ProductList />
      ) : (
        <p className="meta">
          You left the products page. Go back within 30 seconds (staleTime) and the cached products
          appear instantly with no loading state.
        </p>
      )}
    </main>
  )
}
