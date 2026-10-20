// Tiny in-memory REST API running inside the Vite dev/preview server.
//   GET /api/users    POST /api/users    DELETE /api/users/:id
// Send the header "x-simulate-error: 1" to make any request fail with HTTP 500.
let users = [
  { id: 1, name: 'Asha Patel', email: 'asha@example.com', role: 'Admin' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', role: 'Editor' },
  { id: 3, name: 'Meera Nair', email: 'meera@example.com', role: 'Viewer' },
  { id: 4, name: 'Karan Shah', email: 'karan@example.com', role: 'Editor' },
]
let nextUserId = 5

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

export async function handleApi(req, res, next, delay = 800) {
  if (!req.url.startsWith('/api/')) return next()
  const path = new URL(req.url, 'http://localhost').pathname
  await sleep(delay) // simulated network latency so pending states are visible

  if (req.headers['x-simulate-error']) return send(res, 500, { message: 'Simulated server error' })

  if (path === '/api/users' && req.method === 'GET') return send(res, 200, users)

  if (path === '/api/users' && req.method === 'POST') {
    const { name, email, role } = await readBody(req)
    if (!name?.trim() || !email?.trim() || !role) {
      return send(res, 400, { message: 'Name, email and role are required' })
    }
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return send(res, 409, { message: 'A user with this email already exists' })
    }
    const user = { id: nextUserId++, name: name.trim(), email: email.trim(), role }
    users.push(user)
    return send(res, 201, user)
  }

  const match = path.match(/^\/api\/users\/(\d+)$/)
  if (match && req.method === 'DELETE') {
    const id = Number(match[1])
    if (!users.some((u) => u.id === id)) return send(res, 404, { message: 'User not found' })
    users = users.filter((u) => u.id !== id)
    return send(res, 200, { id })
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
