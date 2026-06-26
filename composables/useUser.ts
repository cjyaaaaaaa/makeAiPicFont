import { useUserService } from '../services/user'
import type { UserProfile } from '../api/user'

const TOKEN_KEY = 'token'
const TOKEN_KEYS = ['token', 'accessToken', 'access_token']

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
		TOKEN_KEYS.forEach((key) => {
			localStorage.removeItem(key)
			sessionStorage.removeItem(key)
		})
	}
}

export const useUser = () => {
	const service = useUserService()
	const user = useState<UserProfile | null>('user.profile', () => null)
	const pending = useState('user.pending', () => false)
	const error = useState<unknown>('user.error', () => null)
	const token = useState<string | null>('user.token', () => readToken())

	const loadUser = async () => {
		const currentToken = token.value || readToken()
		if (!currentToken) {
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
		pending.value = false
	}

	const loginWithToken = async (nextToken: string) => {
		setToken(nextToken)
		try {
			const profile = await loadUser()
			if (!profile) {
				throw new Error('Failed to load user profile')
			}
			return profile
		} catch (err) {
			logout()
			throw err
		}
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
		loginWithToken,
		loadUser,
		initUser,
		logout,
	}
}
