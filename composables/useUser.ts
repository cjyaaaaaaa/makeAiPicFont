import { useUserService } from '../services/user'
import type { UserProfile } from '../api/user'

const TOKEN_KEY = 'token'

const readToken = () => {
	const tokenCookie = useCookie<string | null>(TOKEN_KEY)
	if (import.meta.client) {
		return localStorage.getItem(TOKEN_KEY) ?? tokenCookie.value ?? null
	}
	return tokenCookie.value ?? null
}

const writeToken = (token: string) => {
	const tokenCookie = useCookie<string | null>(TOKEN_KEY)
	tokenCookie.value = token
	if (import.meta.client) {
		localStorage.setItem(TOKEN_KEY, token)
	}
}

const clearToken = () => {
	const tokenCookie = useCookie<string | null>(TOKEN_KEY)
	tokenCookie.value = null
	if (import.meta.client) {
		localStorage.removeItem(TOKEN_KEY)
	}
}

export const useUser = () => {
	const service = useUserService()
	const user = useState<UserProfile | null>('user.profile', () => null)
	const pending = useState('user.pending', () => false)
	const error = useState<unknown>('user.error', () => null)
	const token = useState<string | null>('user.token', () => readToken())

	const loadUser = async () => {
		if (!readToken()) {
			user.value = null
			return null
		}

		pending.value = true
		error.value = null

		try {
			user.value = await service.fetchUser()
			return user.value
		} catch (err) {
			error.value = err
			throw err
		} finally {
			pending.value = false
		}
	}

	const setToken = (nextToken: string) => {
		writeToken(nextToken)
		token.value = nextToken
	}

	const logout = () => {
		clearToken()
		token.value = null
		user.value = null
		error.value = null
	}

	const initUser = async () => {
		const savedToken = readToken()
		token.value = savedToken
		if (!savedToken || user.value || pending.value) return user.value
		return await loadUser()
	}

	return {
		user,
		pending,
		error,
		token,
		setToken,
		loadUser,
		initUser,
		logout,
	}
}
