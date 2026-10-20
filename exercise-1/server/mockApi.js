// Tiny in-memory REST API running inside the Vite dev/preview server.
//   GET /api/products?search=term
// Send the header "x-simulate-error: 1" to make any request fail with HTTP 500.
const products = [
  ['Wireless Mouse', 'Accessories', 24.99, 4.4],
  ['Mechanical Keyboard', 'Accessories', 89.5, 4.7],
  ['USB-C Hub', 'Accessories', 39.0, 4.2],
  ['27" Monitor', 'Displays', 219.99, 4.6],
  ['Curved Monitor', 'Displays', 329.0, 4.5],
  ['Laptop Stand', 'Accessories', 29.95, 4.3],
  ['Noise Cancelling Headphones', 'Audio', 199.0, 4.8],
  ['Bluetooth Speaker', 'Audio', 59.99, 4.1],
  ['Studio Microphone', 'Audio', 129.0, 4.5],
  ['Webcam 1080p', 'Video', 49.99, 4.0],
  ['Ring Light', 'Video', 34.5, 4.2],
  ['Gaming Laptop', 'Computers', 1399.0, 4.6],
  ['Ultrabook Laptop', 'Computers', 1099.0, 4.7],
  ['Tablet 10 inch', 'Computers', 349.0, 4.3],
  ['Smartphone Pro', 'Phones', 899.0, 4.6],
  ['Smartphone Lite', 'Phones', 399.0, 4.2],
  ['Phone Case', 'Phones', 14.99, 4.0],
  ['Wireless Charger', 'Phones', 25.0, 4.1],
  ['External SSD 1TB', 'Storage', 99.0, 4.8],
  ['USB Flash Drive 128GB', 'Storage', 15.99, 4.2],
  ['Smart Watch', 'Wearables', 179.0, 4.3],
  ['Fitness Band', 'Wearables', 49.0, 4.1],
  ['Router Wi-Fi 6', 'Networking', 119.0, 4.5],
  ['Ethernet Cable 5m', 'Networking', 9.99, 4.4],
].map(([title, category, price, rating], i) => ({ id: i + 1, title, category, price, rating }))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export async function handleApi(req, res, next, delay = 700) {
  if (!req.url.startsWith('/api/')) return next()
  const url = new URL(req.url, 'http://localhost')
  await sleep(delay) // simulated network latency so loading states are visible

  if (req.headers['x-simulate-error']) return send(res, 500, { message: 'Simulated server error' })

  if (url.pathname === '/api/products' && req.method === 'GET') {
    const search = (url.searchParams.get('search') || '').trim().toLowerCase()
    const list = search
      ? products.filter((p) => `${p.title} ${p.category}`.toLowerCase().includes(search))
      : products
    return send(res, 200, list)
  }
  return send(res, 404, { message: 'Not found' })
}

export default function mockApi() {
  const mw = (req, res, next) => handleApi(req, res, next)
  return {
    name: 'mock-rest-api',
    configureServer(server) {
      server.middlewares.use(mw)
    },
    configurePreviewServer(server) {
      server.middlewares.use(mw)
    },
  }
}
