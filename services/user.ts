import { getUser } from '../api/user'

export const useUserService = () => {
	const fetchUser = () => {
		return getUser()
	}

	return {
		fetchUser,
	}
}
