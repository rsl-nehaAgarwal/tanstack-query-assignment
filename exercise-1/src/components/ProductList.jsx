import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'

// useState is used ONLY for the search input's own value (allowed by the assignment).
// The server response is never copied into state - it lives in the TanStack Query cache.
export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState('')
  const search = searchTerm.trim()

  const {
    data: products,
    error,
    isPending,
    isFetching,
    isError,
    isSuccess,
    isPlaceholderData,
    refetch,
  } = useQuery({
    // ['products'] with no search, ['products', { search: searchTerm }] with a search term
    queryKey: search ? ['products', { search }] : ['products'],
    queryFn: () => fetchProducts(search),
    staleTime: 30 * 1000, // data is fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // unused cache is kept for 5 minutes
    placeholderData: keepPreviousData, // keep old results visible while a new search loads
  })

  return (
    <section>
      <div className="search">
        <input
          type="search"
          placeholder="Search products (e.g. laptop, audio)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => refetch()} disabled={isFetching}>
          Refresh Products
        </button>
      </div>

      {/* live view of the query flags - handy for the demo video */}
      <p className="meta">
        isPending: <b>{String(isPending)}</b> | isFetching: <b>{String(isFetching)}</b> | isSuccess:{' '}
        <b>{String(isSuccess)}</b> | isError: <b>{String(isError)}</b>
      </p>

      {/* 1. initial loading (no data yet) */}
      {isPending && <p className="status">Loading products…</p>}

      {/* 2. error with nothing to show */}
      {isError && !products && (
        <div>
          <p className="error">Failed to load products: {error.message}</p>
          <button onClick={() => refetch()}>Try again</button>
        </div>
      )}

      {/* error during a refetch: the existing data stays visible */}
      {isError && products && (
        <p className="error">Could not refresh: {error.message}. Showing the cached products.</p>
      )}

      {/* 3. background fetching: the existing data stays on screen */}
      {isFetching && !isPending && (
        <p className="fetching">{isPlaceholderData ? 'Searching…' : 'Updating in the background…'}</p>
      )}

      {/* 4. success */}
      {isSuccess && !isFetching && <p className="success">Loaded {products.length} product(s).</p>}

      {products && (
        <>
          {products.length === 0 && <p className="meta">No products match “{search}”.</p>}
          <div className="grid">
            {products.map((p) => (
              <article className="card" key={p.id}>
                <h2>{p.title}</h2>
                <p className="meta">{p.category}</p>
                <p>
                  <b>${p.price.toFixed(2)}</b> &nbsp; ★ {p.rating}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
