const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pixel-battle.zebaro.dev/api/v1'

export class ApiClient {
    private accessToken: string | null = null

    constructor(accessToken?: string) {
        this.accessToken = accessToken ||
            (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null)
    }

    setAccessToken(token: string) {
        this.accessToken = token
        if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", token)
        }
    }

    getAccessToken() {
        return this.accessToken
    }

    private async request(url: string, options: RequestInit = {}, retry = true): Promise<any> { // TODO: Убрать any
        const headers = new Headers()
        headers.set('Content-Type', 'application/json')
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => headers.set(key, value))
        }

        if (this.accessToken) {
            headers.set('Authorization', `Bearer ${this.accessToken}`)
        }
        console.log(options)
        const res = await fetch(`${API_URL}${url}`, {headers, ...options})

        if (res.status === 401 && retry) {
            const refreshed = await this.refreshToken()
            if (refreshed) {
                return this.request(url, options, false)
            }
        }

        const text = await res.text()
        let data
        try {
            data = text ? JSON.parse(text) : {}
        } catch {
            data = {message: text}
        }

        if (!res.ok) throw new Error(data?.message || `Ошибка запроса ${res.status}`)

        return data
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            })
            if (!res.ok) return false

            const data: { token: string } = await res.json()
            this.setAccessToken(data.token)
            return true
        } catch {
            return false
        }
    }

    async login(username: string, password: string) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            credentials: 'include'
        })
        this.setAccessToken(data.token)
        return data
    }

    async register(username: string, password: string) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            credentials: 'include'
        })
        this.setAccessToken(data.token)
        return data
    }

    async logout() {
        const data = await this.request('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
        this.setAccessToken("")
        return data
    }

    async session() {
        try {
            return await this.request('/session', {
                method: 'GET',
                credentials: 'include',
            })
        } catch {
            return null
        }
    }

    async fetchPixels() {
        return this.request('/pixel')
    }

    async setPixel(x: number, y: number, color: string) {
        return this.request('/pixel/change', {
            method: 'POST',
            body: JSON.stringify({x, y, color})
        })
    }
}
