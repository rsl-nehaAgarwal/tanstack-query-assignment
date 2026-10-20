// Small fetch wrapper used by every API call.
// "simulateError" is a UI switch that makes the mock server answer with HTTP 500, so the
// error state / optimistic-rollback can be demonstrated on demand.
let simulateError = false
export const setSimulateError = (value) => {
  simulateError = value
}

export async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(simulateError ? { 'x-simulate-error': '1' } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      message = (await response.json()).message || message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  return response.json()
}
