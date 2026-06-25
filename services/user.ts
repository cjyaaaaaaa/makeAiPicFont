import { getUser } from '../api/user'

export const useUserService = () => {
	const fetchUser = async () => {
		const response = await getUser()
		return response.data
	}

	return {
		fetchUser,
	}
}
