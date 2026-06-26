import { getUser } from '../api/user'
import type { UserProfile } from '../api/user'

export const useUserService = () => {
	const fetchUser = async () => {
		const response = await getUser()
		if (!response || typeof response !== 'object') return null
		return 'data' in response ? response.data : (response as UserProfile)
	}

	return {
		fetchUser,
	}
}
