const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const TOKEN_KEY = 'htx_admin_token'

export function getAuthToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

export function setAuthToken(token) {
    try {
        if (token) sessionStorage.setItem(TOKEN_KEY, token)
        else sessionStorage.removeItem(TOKEN_KEY)
    } catch { /* session storage unavailable */ }
}

export async function apiFetch(path, options = {}) {
    const { auth = true, headers: inputHeaders, ...fetchOptions } = options
    const headers = new Headers(inputHeaders || {})
    const token = getAuthToken()
    if (auth && token) headers.set('Authorization', `Bearer ${token}`)
    if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    const url = /^https?:\/\//.test(path) ? path : `${API}${path.startsWith('/') ? path : `/${path}`}`
    const response = await fetch(url, { ...fetchOptions, headers })
    if (response.status === 401 && auth) {
        setAuthToken('')
        window.dispatchEvent(new CustomEvent('admin-session-expired'))
    }
    return response
}

export async function responseError(response, fallback = 'Yêu cầu thất bại') {
    const body = await response.json().catch(() => null)
    return new Error(body?.error || `${fallback} (${response.status})`)
}

export { API, TOKEN_KEY }
