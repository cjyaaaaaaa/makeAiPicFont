export default defineNuxtRouteMiddleware(async () => {
	const { initUser, logout } = useUser()

	try {
		await initUser()
	} catch {
		logout()
	}
})
