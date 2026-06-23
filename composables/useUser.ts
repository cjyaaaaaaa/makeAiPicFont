import { useUserService } from '../services/user'

export const useUser = () => {
	const service = useUserService()
	const user = ref<any>(null)
	const pending = ref(false)
	const error = ref<unknown>(null)

	const loadUser = async () => {
		pending.value = true
		error.value = null

		try {
			user.value = await service.fetchUser()
		} catch (err) {
			error.value = err
			throw err
		} finally {
			pending.value = false
		}
	}

	return {
		user,
		pending,
		error,
		loadUser,
	}
}
